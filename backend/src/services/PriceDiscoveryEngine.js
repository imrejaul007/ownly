import ExchangeAsset from '../models/ExchangeAsset.js';
import Trade from '../models/Trade.js';
import Order from '../models/Order.js';
import MarketData from '../models/MarketData.js';
import { Op } from 'sequelize';

/**
 * Price Discovery Algorithm
 *
 * Calculates asset prices based on:
 * - Demand/Supply (40%): Buy vs sell order volume
 * - ROI Performance (25%): Actual earnings vs expected
 * - News Sentiment (15%): AI-analyzed announcements
 * - Holding Period Liquidity (10%): Trading activity
 * - Market Index Trend (10%): Sector correlation
 */
class PriceDiscoveryEngine {
  constructor() {
    this.weights = {
      demandSupply: 0.40,
      roiPerformance: 0.25,
      newsSentiment: 0.15,
      holdingLiquidity: 0.10,
      marketIndex: 0.10,
    };
  }

  /**
   * Calculate new price for an asset based on all factors
   */
  async calculatePrice(asset) {
    const currentPrice = parseFloat(asset.current_price);

    // Calculate each factor score (-100 to +100)
    const demandSupplyScore = await this.calculateDemandSupplyScore(asset);
    const roiPerformanceScore = await this.calculateROIPerformanceScore(asset);
    const newsSentimentScore = parseFloat(asset.sentiment_score) - 50; // Convert 0-100 to -50 to +50
    const liquidityScore = await this.calculateLiquidityScore(asset);
    const marketIndexScore = await this.calculateMarketIndexScore(asset);

    // Weighted composite score
    const compositeScore = (
      demandSupplyScore * this.weights.demandSupply +
      roiPerformanceScore * this.weights.roiPerformance +
      newsSentimentScore * this.weights.newsSentiment +
      liquidityScore * this.weights.holdingLiquidity +
      marketIndexScore * this.weights.marketIndex
    );

    // Convert score to price change percentage
    // Score range: -100 to +100 → Price change: -5% to +5%
    const maxDailyChange = 0.05; // 5% max daily change
    const priceChangePercent = (compositeScore / 100) * maxDailyChange;

    // Calculate new price
    const newPrice = currentPrice * (1 + priceChangePercent);

    // Add realistic volatility (±0.5%)
    const volatility = (Math.random() - 0.5) * 0.01;
    const finalPrice = newPrice * (1 + volatility);

    return {
      price: parseFloat(finalPrice.toFixed(2)),
      priceChangePercent: parseFloat((priceChangePercent * 100).toFixed(4)),
      factors: {
        demandSupply: parseFloat(demandSupplyScore.toFixed(2)),
        roiPerformance: parseFloat(roiPerformanceScore.toFixed(2)),
        sentiment: parseFloat(newsSentimentScore.toFixed(2)),
        liquidity: parseFloat(liquidityScore.toFixed(2)),
        marketIndex: parseFloat(marketIndexScore.toFixed(2)),
        composite: parseFloat(compositeScore.toFixed(2)),
      }
    };
  }

  /**
   * Factor 1: Demand/Supply Score (40% weight)
   */
  async calculateDemandSupplyScore(asset) {
    const [buyOrderVolume, sellOrderVolume] = await Promise.all([
      Order.sum('total_amount', {
        where: {
          asset_id: asset.id,
          side: 'buy',
          status: { [Op.in]: ['pending', 'partial'] },
        }
      }),
      Order.sum('total_amount', {
        where: {
          asset_id: asset.id,
          side: 'sell',
          status: { [Op.in]: ['pending', 'partial'] },
        }
      }),
    ]);

    const buyVolume = buyOrderVolume || 0;
    const sellVolume = sellOrderVolume || 0;
    const totalVolume = buyVolume + sellVolume;

    if (totalVolume === 0) return 0;

    // Calculate demand ratio: -100 (all sell) to +100 (all buy)
    const demandRatio = ((buyVolume - sellVolume) / totalVolume) * 100;

    // Update demand index in asset
    await asset.update({
      demand_index: 50 + (demandRatio / 2), // Convert to 0-100 scale
    });

    return demandRatio;
  }

  /**
   * Factor 2: ROI Performance Score (25% weight)
   */
  async calculateROIPerformanceScore(asset) {
    // Compare actual ROI to expected ROI from deal
    const actualROI = parseFloat(asset.roi_to_date);
    const expectedROI = parseFloat(asset.rawData?.expected_roi || 0);

    if (expectedROI === 0) return 0;

    // Performance ratio: -100 (0% of expected) to +100 (200% of expected)
    const performanceRatio = ((actualROI / expectedROI) - 1) * 100;

    // Clamp to -100 to +100
    return Math.max(-100, Math.min(100, performanceRatio));
  }

  /**
   * Factor 3: Liquidity Score (10% weight)
   */
  async calculateLiquidityScore(asset) {
    // Get 24h trade volume
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const tradeVolume = await Trade.sum('total_amount', {
      where: {
        asset_id: asset.id,
        executed_at: { [Op.gte]: oneDayAgo },
      }
    });

    const volume = tradeVolume || 0;
    const marketCap = parseFloat(asset.market_cap);

    if (marketCap === 0) return 0;

    // Volume to market cap ratio
    // 1% daily volume = neutral (0)
    // >5% = very liquid (+50)
    // <0.1% = illiquid (-50)
    const volumeRatio = (volume / marketCap) * 100;

    if (volumeRatio >= 5) return 50;
    if (volumeRatio >= 1) return (volumeRatio - 1) * 12.5; // Scale 1-5% to 0-50
    if (volumeRatio >= 0.1) return (volumeRatio - 0.5) * -55.5; // Scale 0.1-1% to -50 to 0
    return -50;
  }

  /**
   * Factor 4: Market Index Score (10% weight)
   */
  async calculateMarketIndexScore(asset) {
    // Calculate category index (average performance of all assets in same category)
    const categoryAssets = await ExchangeAsset.findAll({
      where: {
        market_category: asset.market_category,
        id: { [Op.ne]: asset.id },
      },
      attributes: ['price_change_24h'],
    });

    if (categoryAssets.length === 0) return 0;

    const avgCategoryChange = categoryAssets.reduce((sum, a) =>
      sum + parseFloat(a.price_change_24h), 0
    ) / categoryAssets.length;

    // Convert category performance to score
    // -5% to +5% → -100 to +100
    return (avgCategoryChange / 5) * 100;
  }

  /**
   * Simulate daily market movements for all assets
   */
  async simulateDailyMarket() {
    const assets = await ExchangeAsset.findAll({
      where: {
        trading_phase: 'secondary',
      },
    });

    console.log(`\n🔄 Simulating daily market for ${assets.length} assets...`);

    for (const asset of assets) {
      try {
        const priceData = await this.calculatePrice(asset);

        // Update asset price
        await asset.update({
          current_price: priceData.price,
          price_change_24h: priceData.priceChangePercent,
          last_price_update: new Date(),
        });

        // Record market data (daily candle)
        await MarketData.create({
          asset_id: asset.id,
          timestamp: new Date(),
          open_price: parseFloat(asset.current_price),
          high_price: priceData.price * 1.02,
          low_price: priceData.price * 0.98,
          close_price: priceData.price,
          volume: parseFloat(asset.daily_volume),
          interval: '1d',
        });

        // Reset daily volume
        await asset.update({ daily_volume: 0 });

        console.log(`✅ ${asset.symbol}: ${priceData.priceChangePercent >= 0 ? '+' : ''}${priceData.priceChangePercent.toFixed(2)}% → AED ${priceData.price}`);

      } catch (error) {
        console.error(`❌ Error simulating ${asset.symbol}:`, error.message);
      }
    }

    console.log('✨ Daily market simulation complete\n');
  }

  /**
   * Update sentiment scores based on news/announcements
   */
  async updateSentimentScores() {
    const assets = await ExchangeAsset.findAll({
      where: { trading_phase: 'secondary' },
    });

    for (const asset of assets) {
      // Simple sentiment algorithm based on metadata
      const metadata = asset.metadata || {};
      const news = metadata.news || [];

      let sentimentScore = 50; // Neutral

      // Analyze recent news (last 7 days)
      const recentNews = news.filter(n => {
        const newsDate = new Date(n.date);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return newsDate >= weekAgo;
      });

      // Positive keywords boost sentiment
      const positiveKeywords = ['growth', 'profit', 'expansion', 'success', 'milestone', 'achievement'];
      const negativeKeywords = ['loss', 'decline', 'issue', 'problem', 'delay', 'closed'];

      recentNews.forEach(item => {
        const text = (item.title + ' ' + item.content).toLowerCase();

        positiveKeywords.forEach(keyword => {
          if (text.includes(keyword)) sentimentScore += 5;
        });

        negativeKeywords.forEach(keyword => {
          if (text.includes(keyword)) sentimentScore -= 5;
        });
      });

      // Clamp between 0-100
      sentimentScore = Math.max(0, Math.min(100, sentimentScore));

      await asset.update({ sentiment_score: sentimentScore });
    }
  }
}

export default new PriceDiscoveryEngine();
