import User from './User.js';
import Wallet from './Wallet.js';
import Deal from './Deal.js';
import SPV from './SPV.js';
import Investment from './Investment.js';
import Payout from './Payout.js';
import Transaction from './Transaction.js';
import Agent from './Agent.js';
import Asset from './Asset.js';
import AuditLog from './AuditLog.js';
import Scenario from './Scenario.js';
import SecondaryMarketListing from './SecondaryMarketListing.js';
import PayoutSchedule from './PayoutSchedule.js';
import Notification from './Notification.js';
import Document from './Document.js';
import Announcement from './Announcement.js';
import UserPreference from './UserPreference.js';
import ActivityLog from './ActivityLog.js';
import Report from './Report.js';
import PaymentMethod from './PaymentMethod.js';
import Webhook from './Webhook.js';
import WebhookDelivery from './WebhookDelivery.js';
import EmailTemplate from './EmailTemplate.js';
import EmailLog from './EmailLog.js';
import Workflow from './Workflow.js';
import WorkflowExecution from './WorkflowExecution.js';
import ExchangeAsset from './ExchangeAsset.js';
import Order from './Order.js';
import Trade from './Trade.js';
import Portfolio from './Portfolio.js';
import MarketData from './MarketData.js';
import Bundle from './Bundle.js';
import BundleDeal from './BundleDeal.js';
import SIPPlan from './SIPPlan.js';
import SIPSubscription from './SIPSubscription.js';

// Define relationships

// User relationships
User.hasOne(Wallet, { foreignKey: 'user_id', as: 'wallet' });
Wallet.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(Agent, { foreignKey: 'user_id', as: 'agentProfile' });
Agent.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Investment, { foreignKey: 'user_id', as: 'investments' });
Investment.belongsTo(User, { foreignKey: 'user_id', as: 'investor' });

User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Deal, { foreignKey: 'created_by', as: 'createdDeals' });
Deal.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Deal relationships
Deal.hasOne(SPV, { foreignKey: 'deal_id', as: 'spv' });
SPV.belongsTo(Deal, { foreignKey: 'deal_id', as: 'deal' });

Deal.hasMany(Investment, { foreignKey: 'deal_id', as: 'investments' });
Investment.belongsTo(Deal, { foreignKey: 'deal_id', as: 'deal' });

// SPV relationships
SPV.hasMany(Investment, { foreignKey: 'spv_id', as: 'investments' });
Investment.belongsTo(SPV, { foreignKey: 'spv_id', as: 'spv' });

SPV.hasMany(Payout, { foreignKey: 'spv_id', as: 'payouts' });
Payout.belongsTo(SPV, { foreignKey: 'spv_id', as: 'spv' });

SPV.hasMany(Asset, { foreignKey: 'spv_id', as: 'assets' });
Asset.belongsTo(SPV, { foreignKey: 'spv_id', as: 'spv' });

SPV.hasMany(Scenario, { foreignKey: 'spv_id', as: 'scenarios' });
Scenario.belongsTo(SPV, { foreignKey: 'spv_id', as: 'spv' });

SPV.hasMany(PayoutSchedule, { foreignKey: 'spv_id', as: 'payoutSchedules' });
PayoutSchedule.belongsTo(SPV, { foreignKey: 'spv_id', as: 'spv' });

// Investment relationships
Investment.hasMany(SecondaryMarketListing, { foreignKey: 'investment_id', as: 'listings' });
SecondaryMarketListing.belongsTo(Investment, { foreignKey: 'investment_id', as: 'investment' });

// Secondary Market relationships
User.hasMany(SecondaryMarketListing, { foreignKey: 'seller_id', as: 'sellerListings' });
SecondaryMarketListing.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });

User.hasMany(SecondaryMarketListing, { foreignKey: 'buyer_id', as: 'buyerListings' });
SecondaryMarketListing.belongsTo(User, { foreignKey: 'buyer_id', as: 'buyer' });

// Notification relationships
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Document relationships
Deal.hasMany(Document, { foreignKey: 'deal_id', as: 'dealDocuments' });
Document.belongsTo(Deal, { foreignKey: 'deal_id', as: 'deal' });

SPV.hasMany(Document, { foreignKey: 'spv_id', as: 'spvDocuments' });
Document.belongsTo(SPV, { foreignKey: 'spv_id', as: 'spv' });

User.hasMany(Document, { foreignKey: 'uploaded_by', as: 'uploadedDocuments' });
Document.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' });

// Announcement relationships
Deal.hasMany(Announcement, { foreignKey: 'deal_id', as: 'announcements' });
Announcement.belongsTo(Deal, { foreignKey: 'deal_id', as: 'deal' });

SPV.hasMany(Announcement, { foreignKey: 'spv_id', as: 'announcements' });
Announcement.belongsTo(SPV, { foreignKey: 'spv_id', as: 'spv' });

User.hasMany(Announcement, { foreignKey: 'created_by', as: 'createdAnnouncements' });
Announcement.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// User Preference relationships
User.hasOne(UserPreference, { foreignKey: 'user_id', as: 'userPreferences' });
UserPreference.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Activity Log relationships
User.hasMany(ActivityLog, { foreignKey: 'user_id', as: 'activityLogs' });
ActivityLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Report relationships
User.hasMany(Report, { foreignKey: 'user_id', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Payment Method relationships
User.hasMany(PaymentMethod, { foreignKey: 'user_id', as: 'paymentMethods' });
PaymentMethod.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Transaction relationships with Payment Method
PaymentMethod.hasMany(Transaction, { foreignKey: 'payment_method_id', as: 'transactions' });
Transaction.belongsTo(PaymentMethod, { foreignKey: 'payment_method_id', as: 'paymentMethod' });

// Webhook relationships
User.hasMany(Webhook, { foreignKey: 'user_id', as: 'webhooks' });
Webhook.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Webhook.hasMany(WebhookDelivery, { foreignKey: 'webhook_id', as: 'deliveries' });
WebhookDelivery.belongsTo(Webhook, { foreignKey: 'webhook_id', as: 'webhook' });

// Email Template relationships
EmailTemplate.hasMany(EmailLog, { foreignKey: 'email_template_id', as: 'logs' });
EmailLog.belongsTo(EmailTemplate, { foreignKey: 'email_template_id', as: 'template' });

// Email Log relationships
User.hasMany(EmailLog, { foreignKey: 'user_id', as: 'emailLogs' });
EmailLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Workflow relationships
Workflow.hasMany(WorkflowExecution, { foreignKey: 'workflow_id', as: 'executions' });
WorkflowExecution.belongsTo(Workflow, { foreignKey: 'workflow_id', as: 'workflow' });

User.hasMany(WorkflowExecution, { foreignKey: 'trigger_user_id', as: 'triggeredWorkflows' });
WorkflowExecution.belongsTo(User, { foreignKey: 'trigger_user_id', as: 'triggerUser' });

// Exchange relationships
Deal.hasOne(ExchangeAsset, { foreignKey: 'deal_id', as: 'exchangeAsset' });
ExchangeAsset.belongsTo(Deal, { foreignKey: 'deal_id', as: 'deal' });

User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

ExchangeAsset.hasMany(Order, { foreignKey: 'asset_id', as: 'orders' });
Order.belongsTo(ExchangeAsset, { foreignKey: 'asset_id', as: 'asset' });

ExchangeAsset.hasMany(Trade, { foreignKey: 'asset_id', as: 'trades' });
Trade.belongsTo(ExchangeAsset, { foreignKey: 'asset_id', as: 'asset' });

User.hasMany(Trade, { foreignKey: 'buyer_id', as: 'buyTrades' });
Trade.belongsTo(User, { foreignKey: 'buyer_id', as: 'buyer' });

User.hasMany(Trade, { foreignKey: 'seller_id', as: 'sellTrades' });
Trade.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });

User.hasMany(Portfolio, { foreignKey: 'user_id', as: 'portfolioHoldings' });
Portfolio.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

ExchangeAsset.hasMany(Portfolio, { foreignKey: 'asset_id', as: 'portfolioHoldings' });
Portfolio.belongsTo(ExchangeAsset, { foreignKey: 'asset_id', as: 'asset' });

ExchangeAsset.hasMany(MarketData, { foreignKey: 'asset_id', as: 'marketData' });
MarketData.belongsTo(ExchangeAsset, { foreignKey: 'asset_id', as: 'asset' });

// Bundle relationships
User.hasMany(Bundle, { foreignKey: 'created_by', as: 'createdBundles' });
Bundle.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

Bundle.belongsToMany(Deal, {
  through: BundleDeal,
  foreignKey: 'bundle_id',
  otherKey: 'deal_id',
  as: 'deals',
});

Deal.belongsToMany(Bundle, {
  through: BundleDeal,
  foreignKey: 'deal_id',
  otherKey: 'bundle_id',
  as: 'bundles',
});

Bundle.hasMany(BundleDeal, { foreignKey: 'bundle_id', as: 'bundleDeals' });
BundleDeal.belongsTo(Bundle, { foreignKey: 'bundle_id', as: 'bundle' });

Deal.hasMany(BundleDeal, { foreignKey: 'deal_id', as: 'bundleDeals' });
BundleDeal.belongsTo(Deal, { foreignKey: 'deal_id', as: 'deal' });

Bundle.hasMany(Investment, { foreignKey: 'bundle_id', as: 'investments' });
Investment.belongsTo(Bundle, { foreignKey: 'bundle_id', as: 'bundle' });

// SIP Plan relationships
Bundle.hasMany(SIPPlan, { foreignKey: 'bundle_id', as: 'sipPlans' });
SIPPlan.belongsTo(Bundle, { foreignKey: 'bundle_id', as: 'bundle' });

User.hasMany(SIPSubscription, { foreignKey: 'user_id', as: 'sipSubscriptions' });
SIPSubscription.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

SIPPlan.hasMany(SIPSubscription, { foreignKey: 'plan_id', as: 'subscriptions' });
SIPSubscription.belongsTo(SIPPlan, { foreignKey: 'plan_id', as: 'plan' });

PaymentMethod.hasMany(SIPSubscription, { foreignKey: 'payment_method_id', as: 'sipSubscriptions' });
SIPSubscription.belongsTo(PaymentMethod, { foreignKey: 'payment_method_id', as: 'paymentMethod' });

SIPSubscription.hasMany(Investment, { foreignKey: 'sip_subscription_id', as: 'investments' });
Investment.belongsTo(SIPSubscription, { foreignKey: 'sip_subscription_id', as: 'sipSubscription' });

// Export all models
export {
  User,
  Wallet,
  Deal,
  SPV,
  Investment,
  Payout,
  Transaction,
  Agent,
  Asset,
  AuditLog,
  Scenario,
  SecondaryMarketListing,
  PayoutSchedule,
  Notification,
  Document,
  Announcement,
  UserPreference,
  ActivityLog,
  Report,
  PaymentMethod,
  Webhook,
  WebhookDelivery,
  EmailTemplate,
  EmailLog,
  Workflow,
  WorkflowExecution,
  ExchangeAsset,
  Order,
  Trade,
  Portfolio,
  MarketData,
  Bundle,
  BundleDeal,
  SIPPlan,
  SIPSubscription,
};

export default {
  User,
  Wallet,
  Deal,
  SPV,
  Investment,
  Payout,
  Transaction,
  Agent,
  Asset,
  AuditLog,
  Scenario,
  SecondaryMarketListing,
  PayoutSchedule,
  Notification,
  Document,
  Announcement,
  UserPreference,
  ActivityLog,
  Report,
  PaymentMethod,
  Webhook,
  WebhookDelivery,
  EmailTemplate,
  EmailLog,
  Workflow,
  WorkflowExecution,
  ExchangeAsset,
  Order,
  Trade,
  Portfolio,
  MarketData,
  Bundle,
  BundleDeal,
  SIPPlan,
  SIPSubscription,
};
