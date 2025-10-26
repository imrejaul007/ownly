import express from 'express';
import { authenticate } from '../middleware/auth.js';
import TradingEngine from '../services/TradingEngine.js';
import PriceDiscoveryEngine from '../services/PriceDiscoveryEngine.js';
import ExchangeAsset from '../models/ExchangeAsset.js';
import Order from '../models/Order.js';
import Trade from '../models/Trade.js';
import Portfolio from '../models/Portfolio.js';
import MarketData from '../models/MarketData.js';
import Deal from '../models/Deal.js';
import { Op } from 'sequelize';

const router = express.Router();

/**
 * ===========================
 * ASSETS ENDPOINTS
 * ===========================
 */

// GET /api/exchange/assets - List all tradable assets
router.get('/assets', async (req, res) => {
  try {
    const { market_category, trading_phase, sort, limit = 50 } = req.query;

    const where = {};
    if (market_category) where.market_category = market_category;
    if (trading_phase) where.trading_phase = trading_phase;

    const orderBy = [];
    if (sort === 'volume') orderBy.push(['daily_volume', 'DESC']);
    else if (sort === 'gainers') orderBy.push(['price_change_24h', 'DESC']);
    else if (sort === 'losers') orderBy.push(['price_change_24h', 'ASC']);
    else orderBy.push(['market_cap', 'DESC']);

    const assets = await ExchangeAsset.findAll({
      where,
      include: [{
        model: Deal,
        as: 'deal',
        attributes: ['title', 'type', 'location', 'images'],
      }],
      order: orderBy,
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: assets,
    });

  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assets',
      error: error.message,
    });
  }
});

// GET /api/exchange/assets/:id - Get asset details
router.get('/assets/:id', async (req, res) => {
  try {
    const asset = await ExchangeAsset.findByPk(req.params.id, {
      include: [{
        model: Deal,
        as: 'deal',
      }],
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found',
      });
    }

    // Get 24h statistics
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [tradeCount, recentTrades] = await Promise.all([
      Trade.count({
        where: {
          asset_id: asset.id,
          executed_at: { [Op.gte]: oneDayAgo },
        },
      }),
      Trade.findAll({
        where: { asset_id: asset.id },
        order: [['executed_at', 'DESC']],
        limit: 50,
      }),
    ]);

    res.json({
      success: true,
      data: {
        asset,
        statistics: {
          trade_count_24h: tradeCount,
          recent_trades: recentTrades,
        },
      },
    });

  } catch (error) {
    console.error('Error fetching asset:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch asset',
      error: error.message,
    });
  }
});

// GET /api/exchange/assets/:id/orderbook - Get order book
router.get('/assets/:id/orderbook', async (req, res) => {
  try {
    const { depth = 10 } = req.query;

    const orderBook = await TradingEngine.getOrderBook(
      req.params.id,
      parseInt(depth)
    );

    res.json({
      success: true,
      data: orderBook,
    });

  } catch (error) {
    console.error('Error fetching order book:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order book',
      error: error.message,
    });
  }
});

// GET /api/exchange/assets/:id/chart - Get chart data
router.get('/assets/:id/chart', async (req, res) => {
  try {
    const { interval = '1d', limit = 100 } = req.query;

    const chartData = await MarketData.findAll({
      where: {
        asset_id: req.params.id,
        interval,
      },
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: chartData.reverse(), // Oldest first for charts
    });

  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chart data',
      error: error.message,
    });
  }
});

/**
 * ===========================
 * ORDERS ENDPOINTS
 * ===========================
 */

// POST /api/exchange/orders - Place new order
router.post('/orders', authenticate, async (req, res) => {
  try {
    const { asset_id, order_type, side, quantity, price, time_in_force } = req.body;

    // Validation
    if (!asset_id || !order_type || !side || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    if (order_type !== 'market' && !price) {
      return res.status(400).json({
        success: false,
        message: 'Price required for non-market orders',
      });
    }

    const order = await TradingEngine.placeOrder({
      user_id: req.user.id,
      asset_id,
      order_type,
      side,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      time_in_force,
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to place order',
    });
  }
});

// GET /api/exchange/orders - Get user's orders
router.get('/orders', authenticate, async (req, res) => {
  try {
    const { status, asset_id, limit = 50 } = req.query;

    const where = { user_id: req.user.id };
    if (status) where.status = status;
    if (asset_id) where.asset_id = asset_id;

    const orders = await Order.findAll({
      where,
      include: [{
        model: ExchangeAsset,
        as: 'asset',
        attributes: ['symbol', 'current_price'],
      }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: orders,
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
});

// DELETE /api/exchange/orders/:id - Cancel order
router.delete('/orders/:id', authenticate, async (req, res) => {
  try {
    const order = await TradingEngine.cancelOrder(req.params.id, req.user.id);

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to cancel order',
    });
  }
});

/**
 * ===========================
 * PORTFOLIO ENDPOINTS
 * ===========================
 */

// GET /api/exchange/portfolio - Get user's portfolio
router.get('/portfolio', authenticate, async (req, res) => {
  try {
    const portfolio = await Portfolio.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: ExchangeAsset,
        as: 'asset',
        include: [{
          model: Deal,
          as: 'deal',
          attributes: ['title', 'images'],
        }],
      }],
    });

    // Calculate totals
    let totalInvested = 0;
    let totalCurrentValue = 0;
    let totalUnrealizedGain = 0;
    let totalRealizedGain = 0;
    let totalROIReceived = 0;

    portfolio.forEach(holding => {
      // Update current value based on latest price
      const currentValue = holding.quantity * parseFloat(holding.asset.current_price);
      const unrealizedGain = currentValue - parseFloat(holding.total_invested);
      const unrealizedGainPercent = (unrealizedGain / parseFloat(holding.total_invested)) * 100;

      holding.current_value = currentValue;
      holding.unrealized_gain = unrealizedGain;
      holding.unrealized_gain_percent = unrealizedGainPercent;

      totalInvested += parseFloat(holding.total_invested);
      totalCurrentValue += currentValue;
      totalUnrealizedGain += unrealizedGain;
      totalRealizedGain += parseFloat(holding.realized_gain);
      totalROIReceived += parseFloat(holding.roi_received);
    });

    const totalGain = totalUnrealizedGain + totalRealizedGain + totalROIReceived;
    const totalReturn = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

    res.json({
      success: true,
      data: {
        holdings: portfolio,
        summary: {
          total_invested: totalInvested,
          total_current_value: totalCurrentValue,
          total_unrealized_gain: totalUnrealizedGain,
          total_realized_gain: totalRealizedGain,
          total_roi_received: totalROIReceived,
          total_gain: totalGain,
          total_return_percent: totalReturn,
        },
      },
    });

  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio',
      error: error.message,
    });
  }
});

/**
 * ===========================
 * TRADES ENDPOINTS
 * ===========================
 */

// GET /api/exchange/trades - Get user's trade history
router.get('/trades', authenticate, async (req, res) => {
  try {
    const { asset_id, limit = 50 } = req.query;

    const where = {
      [Op.or]: [
        { buyer_id: req.user.id },
        { seller_id: req.user.id },
      ],
    };

    if (asset_id) where.asset_id = asset_id;

    const trades = await Trade.findAll({
      where,
      include: [{
        model: ExchangeAsset,
        as: 'asset',
        attributes: ['symbol', 'current_price'],
      }],
      order: [['executed_at', 'DESC']],
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: trades,
    });

  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trades',
      error: error.message,
    });
  }
});

/**
 * ===========================
 * MARKETS ENDPOINTS
 * ===========================
 */

// GET /api/exchange/markets - Get market overview
router.get('/markets', async (req, res) => {
  try {
    const markets = await Promise.all([
      'franchise',
      'property',
      'luxury',
      'inventory',
      'equity',
    ].map(async (category) => {
      const assets = await ExchangeAsset.findAll({
        where: { market_category: category },
      });

      const stats = assets.reduce((acc, asset) => ({
        count: acc.count + 1,
        totalMarketCap: acc.totalMarketCap + parseFloat(asset.market_cap),
        totalVolume: acc.totalVolume + parseFloat(asset.daily_volume),
        avgChange: acc.avgChange + parseFloat(asset.price_change_24h),
      }), { count: 0, totalMarketCap: 0, totalVolume: 0, avgChange: 0 });

      return {
        category,
        asset_count: stats.count,
        total_market_cap: stats.totalMarketCap,
        total_volume_24h: stats.totalVolume,
        avg_change_24h: stats.count > 0 ? stats.avgChange / stats.count : 0,
      };
    }));

    res.json({
      success: true,
      data: markets,
    });

  } catch (error) {
    console.error('Error fetching markets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch markets',
      error: error.message,
    });
  }
});

// GET /api/exchange/markets/:category - Get category-specific data
router.get('/markets/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { sort = 'volume' } = req.query;

    const orderBy = [];
    if (sort === 'gainers') orderBy.push(['price_change_24h', 'DESC']);
    else if (sort === 'losers') orderBy.push(['price_change_24h', 'ASC']);
    else if (sort === 'volume') orderBy.push(['daily_volume', 'DESC']);
    else orderBy.push(['market_cap', 'DESC']);

    const assets = await ExchangeAsset.findAll({
      where: { market_category: category },
      include: [{
        model: Deal,
        as: 'deal',
        attributes: ['title', 'images'],
      }],
      order: orderBy,
    });

    res.json({
      success: true,
      data: assets,
    });

  } catch (error) {
    console.error('Error fetching market category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market category',
      error: error.message,
    });
  }
});

/**
 * ===========================
 * ADMIN ENDPOINTS
 * ===========================
 */

// POST /api/exchange/admin/simulate-market - Trigger daily simulation (Admin only)
router.post('/admin/simulate-market', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    await PriceDiscoveryEngine.simulateDailyMarket();

    res.json({
      success: true,
      message: 'Market simulation completed',
    });

  } catch (error) {
    console.error('Error simulating market:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to simulate market',
      error: error.message,
    });
  }
});

export default router;
