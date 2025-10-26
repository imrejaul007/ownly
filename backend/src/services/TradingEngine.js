import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import Order from '../models/Order.js';
import Trade from '../models/Trade.js';
import Portfolio from '../models/Portfolio.js';
import ExchangeAsset from '../models/ExchangeAsset.js';
import Wallet from '../models/Wallet.js';

class TradingEngine {
  constructor() {
    this.orderBooks = new Map(); // In-memory order books for fast matching
    this.tradingFeePercent = 0.005; // 0.5% trading fee
  }

  /**
   * Place a new order
   */
  async placeOrder(orderData) {
    const transaction = await sequelize.transaction();

    try {
      const { user_id, asset_id, order_type, side, quantity, price, time_in_force } = orderData;

      // Get asset info
      const asset = await ExchangeAsset.findByPk(asset_id);
      if (!asset) {
        throw new Error('Asset not found');
      }

      // Check if asset is tradable
      if (asset.trading_phase === 'paused' || asset.trading_phase === 'closed') {
        throw new Error(`Asset is not tradable (status: ${asset.trading_phase})`);
      }

      // Calculate total amount
      const effectivePrice = order_type === 'market' ? asset.current_price : price;
      const total_amount = parseFloat((quantity * effectivePrice).toFixed(2));

      // Validate user balance for buy orders
      if (side === 'buy') {
        const wallet = await Wallet.findOne({ where: { user_id }, transaction });
        if (!wallet || parseFloat(wallet.balance) < total_amount * 1.005) { // Include 0.5% fee
          throw new Error('Insufficient balance');
        }

        // Lock funds
        await wallet.update({
          balance: parseFloat(wallet.balance) - total_amount * 1.005
        }, { transaction });
      }

      // Validate portfolio for sell orders
      if (side === 'sell') {
        const portfolio = await Portfolio.findOne({
          where: { user_id, asset_id },
          transaction
        });

        if (!portfolio || portfolio.quantity < quantity) {
          throw new Error('Insufficient holdings');
        }
      }

      // Create order
      const order = await Order.create({
        user_id,
        asset_id,
        order_type,
        side,
        quantity,
        price: effectivePrice,
        total_amount,
        remaining_quantity: quantity,
        time_in_force: time_in_force || 'GTC',
        status: 'pending',
      }, { transaction });

      await transaction.commit();

      // Try to match order immediately
      setImmediate(() => this.matchOrders(asset_id));

      return order;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Core order matching algorithm
   */
  async matchOrders(assetId) {
    const asset = await ExchangeAsset.findByPk(assetId);
    if (!asset) return;

    // Get all pending buy orders (highest price first)
    const buyOrders = await Order.findAll({
      where: {
        asset_id: assetId,
        side: 'buy',
        status: { [Op.in]: ['pending', 'partial'] },
        remaining_quantity: { [Op.gt]: 0 }
      },
      order: [['price', 'DESC'], ['created_at', 'ASC']]
    });

    // Get all pending sell orders (lowest price first)
    const sellOrders = await Order.findAll({
      where: {
        asset_id: assetId,
        side: 'sell',
        status: { [Op.in]: ['pending', 'partial'] },
        remaining_quantity: { [Op.gt]: 0 }
      },
      order: [['price', 'ASC'], ['created_at', 'ASC']]
    });

    // Match orders
    for (const buyOrder of buyOrders) {
      for (const sellOrder of sellOrders) {
        // Check if orders can be matched
        if (parseFloat(buyOrder.price) >= parseFloat(sellOrder.price)) {
          const matchQuantity = Math.min(
            buyOrder.remaining_quantity,
            sellOrder.remaining_quantity
          );

          if (matchQuantity > 0) {
            await this.executeTrade(buyOrder, sellOrder, matchQuantity, asset);
          }
        }

        // If buy order is fully filled, move to next buy order
        if (buyOrder.remaining_quantity <= 0) break;
      }
    }

    // Update market price to last trade price
    await this.updateMarketPrice(assetId);
  }

  /**
   * Execute a trade between matched orders
   */
  async executeTrade(buyOrder, sellOrder, quantity, asset) {
    const transaction = await sequelize.transaction();

    try {
      // Execution price is the sell order price (price-time priority)
      const executionPrice = parseFloat(sellOrder.price);
      const totalAmount = parseFloat((quantity * executionPrice).toFixed(2));

      // Calculate fees (0.5% each side)
      const buyerFee = parseFloat((totalAmount * this.tradingFeePercent).toFixed(2));
      const sellerFee = parseFloat((totalAmount * this.tradingFeePercent).toFixed(2));

      // Create trade record
      const trade = await Trade.create({
        asset_id: asset.id,
        buy_order_id: buyOrder.id,
        sell_order_id: sellOrder.id,
        buyer_id: buyOrder.user_id,
        seller_id: sellOrder.user_id,
        quantity,
        price: executionPrice,
        total_amount: totalAmount,
        buyer_fee: buyerFee,
        seller_fee: sellerFee,
        trade_type: 'matched',
        settlement_status: 'pending',
      }, { transaction });

      // Update orders
      await buyOrder.update({
        filled_quantity: buyOrder.filled_quantity + quantity,
        remaining_quantity: buyOrder.remaining_quantity - quantity,
        status: buyOrder.remaining_quantity - quantity === 0 ? 'filled' : 'partial',
        executed_at: buyOrder.remaining_quantity - quantity === 0 ? new Date() : buyOrder.executed_at,
      }, { transaction });

      await sellOrder.update({
        filled_quantity: sellOrder.filled_quantity + quantity,
        remaining_quantity: sellOrder.remaining_quantity - quantity,
        status: sellOrder.remaining_quantity - quantity === 0 ? 'filled' : 'partial',
        executed_at: sellOrder.remaining_quantity - quantity === 0 ? new Date() : sellOrder.executed_at,
      }, { transaction });

      // Update buyer's portfolio
      await this.updatePortfolio(
        buyOrder.user_id,
        asset.id,
        quantity,
        executionPrice,
        'buy',
        transaction
      );

      // Update seller's portfolio
      await this.updatePortfolio(
        sellOrder.user_id,
        asset.id,
        quantity,
        executionPrice,
        'sell',
        transaction
      );

      // Update buyer's wallet (refund any excess from limit order)
      const buyerWallet = await Wallet.findOne({
        where: { user_id: buyOrder.user_id },
        transaction
      });

      // Update seller's wallet (credit sale proceeds minus fee)
      const sellerWallet = await Wallet.findOne({
        where: { user_id: sellOrder.user_id },
        transaction
      });

      await sellerWallet.update({
        balance: parseFloat(sellerWallet.balance) + totalAmount - sellerFee
      }, { transaction });

      // Update asset statistics
      await asset.update({
        current_price: executionPrice,
        daily_volume: parseFloat(asset.daily_volume) + totalAmount,
        last_price_update: new Date(),
      }, { transaction });

      // Mark trade as settled
      await trade.update({
        settlement_status: 'settled',
        settled_at: new Date(),
      }, { transaction });

      await transaction.commit();

      return trade;

    } catch (error) {
      await transaction.rollback();
      console.error('Trade execution error:', error);
      throw error;
    }
  }

  /**
   * Update user portfolio after trade
   */
  async updatePortfolio(userId, assetId, quantity, price, side, transaction) {
    let portfolio = await Portfolio.findOne({
      where: { user_id: userId, asset_id: assetId },
      transaction
    });

    if (side === 'buy') {
      if (portfolio) {
        // Update existing position
        const newQuantity = portfolio.quantity + quantity;
        const newTotalInvested = parseFloat(portfolio.total_invested) + (quantity * price);
        const newAverageBuyPrice = newTotalInvested / newQuantity;

        await portfolio.update({
          quantity: newQuantity,
          average_buy_price: newAverageBuyPrice,
          total_invested: newTotalInvested,
          current_value: newQuantity * price,
          last_updated: new Date(),
        }, { transaction });
      } else {
        // Create new position
        portfolio = await Portfolio.create({
          user_id: userId,
          asset_id: assetId,
          quantity,
          average_buy_price: price,
          total_invested: quantity * price,
          current_value: quantity * price,
          unrealized_gain: 0,
          unrealized_gain_percent: 0,
        }, { transaction });
      }
    } else if (side === 'sell') {
      if (portfolio) {
        const newQuantity = portfolio.quantity - quantity;

        // Calculate realized gain
        const soldValue = quantity * price;
        const costBasis = quantity * parseFloat(portfolio.average_buy_price);
        const realizedGain = soldValue - costBasis;

        if (newQuantity === 0) {
          // Sold entire position
          await portfolio.destroy({ transaction });
        } else {
          // Partial sell
          const newTotalInvested = parseFloat(portfolio.total_invested) - costBasis;

          await portfolio.update({
            quantity: newQuantity,
            total_invested: newTotalInvested,
            current_value: newQuantity * price,
            realized_gain: parseFloat(portfolio.realized_gain) + realizedGain,
            last_updated: new Date(),
          }, { transaction });
        }
      }
    }

    return portfolio;
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId, userId) {
    const transaction = await sequelize.transaction();

    try {
      const order = await Order.findOne({
        where: { id: orderId, user_id: userId },
        transaction
      });

      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status === 'filled' || order.status === 'cancelled') {
        throw new Error('Cannot cancel order');
      }

      // Refund locked funds for buy orders
      if (order.side === 'buy' && order.remaining_quantity > 0) {
        const refundAmount = parseFloat(order.remaining_quantity * order.price * 1.005);
        const wallet = await Wallet.findOne({
          where: { user_id: userId },
          transaction
        });

        await wallet.update({
          balance: parseFloat(wallet.balance) + refundAmount
        }, { transaction });
      }

      await order.update({
        status: 'cancelled',
        cancelled_at: new Date(),
      }, { transaction });

      await transaction.commit();
      return order;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Update market price based on recent trades
   */
  async updateMarketPrice(assetId) {
    const recentTrade = await Trade.findOne({
      where: { asset_id: assetId },
      order: [['executed_at', 'DESC']],
    });

    if (recentTrade) {
      const asset = await ExchangeAsset.findByPk(assetId);
      const previousPrice = parseFloat(asset.current_price);
      const newPrice = parseFloat(recentTrade.price);
      const priceChange = ((newPrice - previousPrice) / previousPrice) * 100;

      await asset.update({
        current_price: newPrice,
        price_change_24h: priceChange,
        last_price_update: new Date(),
      });
    }
  }

  /**
   * Get order book for an asset
   */
  async getOrderBook(assetId, depth = 10) {
    const [buyOrders, sellOrders] = await Promise.all([
      Order.findAll({
        where: {
          asset_id: assetId,
          side: 'buy',
          status: { [Op.in]: ['pending', 'partial'] },
        },
        attributes: ['price', [sequelize.fn('SUM', sequelize.col('remaining_quantity')), 'total_quantity']],
        group: ['price'],
        order: [['price', 'DESC']],
        limit: depth,
        raw: true,
      }),
      Order.findAll({
        where: {
          asset_id: assetId,
          side: 'sell',
          status: { [Op.in]: ['pending', 'partial'] },
        },
        attributes: ['price', [sequelize.fn('SUM', sequelize.col('remaining_quantity')), 'total_quantity']],
        group: ['price'],
        order: [['price', 'ASC']],
        limit: depth,
        raw: true,
      }),
    ]);

    return {
      bids: buyOrders,
      asks: sellOrders,
      spread: sellOrders[0] && buyOrders[0]
        ? parseFloat(sellOrders[0].price) - parseFloat(buyOrders[0].price)
        : 0,
    };
  }
}

export default new TradingEngine();
