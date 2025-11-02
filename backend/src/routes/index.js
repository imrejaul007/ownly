import express from 'express';
import authRoutes from './auth.js';
import dealRoutes from './deals.js';
import investmentRoutes from './investments.js';
import spvRoutes from './spvs.js';
import scenarioRoutes from './scenarios.js';
import payoutRoutes from './payouts.js';
import operationsRoutes from './operations.js';
import analyticsRoutes from './analytics.js';
import exportRoutes from './export.js';
import kycRoutes from './kyc.js';
import secondaryMarketRoutes from './secondaryMarket.js';
import payoutScheduleRoutes from './payoutSchedule.js';
import agentRoutes from './agent.js';
import notificationRoutes from './notifications.js';
import documentRoutes from './documents.js';
import announcementRoutes from './announcements.js';
import userPreferencesRoutes from './userPreferences.js';
import activityLogsRoutes from './activityLogs.js';
import searchRoutes from './search.js';
import reportsRoutes from './reports.js';
import paymentRoutes from './payments.js';
import webhookRoutes from './webhooks.js';
import emailRoutes from './emails.js';
import workflowRoutes from './workflows.js';
import walletRoutes from './wallet.js';
import propertyManagementRoutes from './propertyManagement.js';
import referralRoutes from './referrals.js';
import exchangeRoutes from './exchange.js';
import bundleRoutes from './bundles.js';
import sipRoutes from './sip.js';
import adminRoutes from './admin.js';
import categoriesRoutes from './categories.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'OWNLY Sandbox API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.6.0',
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/deals', dealRoutes);
router.use('/investments', investmentRoutes);
router.use('/spvs', spvRoutes);
router.use('/scenarios', scenarioRoutes);
router.use('/payouts', payoutRoutes);
router.use('/operations', operationsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/export', exportRoutes);
router.use('/kyc', kycRoutes);
router.use('/secondary-market', secondaryMarketRoutes);
router.use('/payout-schedules', payoutScheduleRoutes);
router.use('/agents', agentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/documents', documentRoutes);
router.use('/announcements', announcementRoutes);
router.use('/user/preferences', userPreferencesRoutes);
router.use('/activity-logs', activityLogsRoutes);
router.use('/search', searchRoutes);
router.use('/reports', reportsRoutes);
router.use('/payments', paymentRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/emails', emailRoutes);
router.use('/workflows', workflowRoutes);
router.use('/wallet', walletRoutes);
router.use('/property-management', propertyManagementRoutes);
router.use('/referrals', referralRoutes);
router.use('/exchange', exchangeRoutes);
router.use('/bundles', bundleRoutes);
router.use('/sip', sipRoutes);
router.use('/admin', adminRoutes);
router.use('/categories', categoriesRoutes);

export default router;
