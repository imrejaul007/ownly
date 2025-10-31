import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data: any) => api.post('/auth/signup', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.patch('/auth/profile', data),
};

// Deal APIs
export const dealAPI = {
  list: (params?: any) => api.get('/deals', { params }),
  get: (id: string) => api.get(`/deals/${id}`),
  create: (data: any) => api.post('/deals', data),
  update: (id: string, data: any) => api.patch(`/deals/${id}`, data),
  publish: (id: string) => api.post(`/deals/${id}/publish`),
  close: (id: string) => api.post(`/deals/${id}/close`),
};

// Investment APIs
export const investmentAPI = {
  invest: (data: any) => api.post('/investments', data),
  myInvestments: () => api.get('/investments/my-investments'),
  get: (id: string) => api.get(`/investments/${id}`),
  requestExit: (id: string) => api.post(`/investments/${id}/exit`),
};

// SPV APIs
export const spvAPI = {
  get: (id: string) => api.get(`/spvs/${id}`),
  getCapTable: (id: string) => api.get(`/spvs/${id}/cap-table`),
  create: (dealId: string) => api.post(`/spvs/deal/${dealId}`),
  update: (id: string, data: any) => api.patch(`/spvs/${id}`, data),
};

// Scenario APIs
export const scenarioAPI = {
  list: (params?: any) => api.get('/scenarios', { params }),
  getTemplates: () => api.get('/scenarios/templates'),
  create: (data: any) => api.post('/scenarios', data),
  run: (id: string) => api.post(`/scenarios/${id}/run`),
  getResults: (id: string) => api.get(`/scenarios/${id}/results`),
  delete: (id: string) => api.delete(`/scenarios/${id}`),
};

// Payout APIs
export const payoutAPI = {
  list: (params?: any) => api.get('/payouts', { params }),
  get: (id: string) => api.get(`/payouts/${id}`),
  generate: (data: any) => api.post('/payouts/generate', data),
  distribute: (id: string) => api.post(`/payouts/${id}/distribute`),
  simulate: (spvId: string) => api.get(`/payouts/spv/${spvId}/simulate`),
};

// Operations APIs
export const operationsAPI = {
  updateAsset: (assetId: string, data: any) => api.patch(`/operations/assets/${assetId}`, data),
  recordRevenue: (spvId: string, data: any) => api.post(`/operations/spv/${spvId}/revenue`, data),
  recordExpense: (spvId: string, data: any) => api.post(`/operations/spv/${spvId}/expense`, data),
  getFinancials: (spvId: string) => api.get(`/operations/spv/${spvId}/financials`),
};

// Analytics APIs
export const analyticsAPI = {
  getPlatform: (params?: any) => api.get('/analytics/platform', { params }),
  getDeal: (id: string) => api.get(`/analytics/deals/${id}`),
  getUser: (id: string) => api.get(`/analytics/users/${id}`),
};

// Export APIs
export const exportAPI = {
  portfolio: (userId?: string) => {
    const url = userId ? `/export/portfolio/${userId}` : '/export/portfolio';
    window.open(`${API_BASE_URL}${url}`, '_blank');
  },
  transactions: (userId?: string, params?: any) => {
    const url = userId ? `/export/transactions/${userId}` : '/export/transactions';
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    window.open(`${API_BASE_URL}${url}${queryString}`, '_blank');
  },
  deals: (params?: any) => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    window.open(`${API_BASE_URL}/export/deals${queryString}`, '_blank');
  },
  investors: () => {
    window.open(`${API_BASE_URL}/export/investors`, '_blank');
  },
};

// KYC APIs
export const kycAPI = {
  upload: (userId: string, data: any) => api.post(`/kyc/upload/${userId}`, data),
  updateStatus: (userId: string, data: any) => api.patch(`/kyc/${userId}/status`, data),
  getQueue: (params?: any) => api.get('/kyc/queue', { params }),
  getUser: (userId: string) => api.get(`/kyc/user/${userId}`),
  bulkApprove: (userIds: string[]) => api.post('/kyc/bulk-approve', { userIds }),
};

// Secondary Market APIs
export const secondaryMarketAPI = {
  getActiveListings: (params?: any) => api.get('/secondary-market/listings', { params }),
  getMyListings: () => api.get('/secondary-market/my-listings'),
  createListing: (data: any) => api.post('/secondary-market/listings', data),
  getListingDetails: (listingId: string) => api.get(`/secondary-market/listings/${listingId}`),
  makeOffer: (listingId: string, data: any) => api.post(`/secondary-market/listings/${listingId}/offer`, data),
  respondToOffer: (listingId: string, data: any) => api.post(`/secondary-market/listings/${listingId}/respond`, data),
  cancelListing: (listingId: string) => api.post(`/secondary-market/listings/${listingId}/cancel`),
};

// Payout Schedule APIs
export const payoutScheduleAPI = {
  getSchedules: (params?: any) => api.get('/payout-schedules', { params }),
  getScheduleDetails: (scheduleId: string) => api.get(`/payout-schedules/${scheduleId}`),
  createSchedule: (data: any) => api.post('/payout-schedules', data),
  updateSchedule: (scheduleId: string, data: any) => api.patch(`/payout-schedules/${scheduleId}`, data),
  toggleStatus: (scheduleId: string, data: any) => api.post(`/payout-schedules/${scheduleId}/toggle`, data),
  deleteSchedule: (scheduleId: string) => api.delete(`/payout-schedules/${scheduleId}`),
  processDuePayouts: () => api.post('/payout-schedules/process/due'),
  getUpcomingPayouts: (params?: any) => api.get('/payout-schedules/upcoming', { params }),
};

// Agent APIs
export const agentAPI = {
  getDashboard: () => api.get('/agents/dashboard'),
  getLeaderboard: (params?: any) => api.get('/agents/leaderboard', { params }),
  getReferralDetails: (referralId: string) => api.get(`/agents/referrals/${referralId}`),
  getCommissionHistory: () => api.get('/agents/commissions'),
};

// Notification APIs
export const notificationAPI = {
  getNotifications: (params?: any) => api.get('/notifications', { params }),
  getStats: () => api.get('/notifications/stats'),
  markAsRead: (notificationId: string) => api.patch(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.post('/notifications/mark-all-read'),
  deleteNotification: (notificationId: string) => api.delete(`/notifications/${notificationId}`),
};

// Document APIs
export const documentAPI = {
  getDocuments: (params?: any) => api.get('/documents', { params }),
  getDocumentDetails: (documentId: string) => api.get(`/documents/${documentId}`),
  uploadDocument: (data: any) => api.post('/documents', data),
  downloadDocument: (documentId: string) => api.get(`/documents/${documentId}/download`),
  updateDocument: (documentId: string, data: any) => api.patch(`/documents/${documentId}`, data),
  deleteDocument: (documentId: string) => api.delete(`/documents/${documentId}`),
  getStats: (params?: any) => api.get('/documents/stats', { params }),
};

// Announcement APIs
export const announcementAPI = {
  getAnnouncements: (params?: any) => api.get('/announcements', { params }),
  getRecentAnnouncements: (params?: any) => api.get('/announcements/recent', { params }),
  getAnnouncementDetails: (announcementId: string) => api.get(`/announcements/${announcementId}`),
  createAnnouncement: (data: any) => api.post('/announcements', data),
  updateAnnouncement: (announcementId: string, data: any) => api.patch(`/announcements/${announcementId}`, data),
  publishAnnouncement: (announcementId: string) => api.post(`/announcements/${announcementId}/publish`),
  deleteAnnouncement: (announcementId: string) => api.delete(`/announcements/${announcementId}`),
};

// User Preferences APIs
export const userPreferenceAPI = {
  getPreferences: () => api.get('/user/preferences'),
  getDefaults: () => api.get('/user/preferences/defaults'),
  updatePreferences: (data: any) => api.patch('/user/preferences', data),
  updateNotifications: (data: any) => api.patch('/user/preferences/notifications', data),
  updateDisplay: (data: any) => api.patch('/user/preferences/display', data),
  updatePrivacy: (data: any) => api.patch('/user/preferences/privacy', data),
  updateSecurity: (data: any) => api.patch('/user/preferences/security', data),
  updateDashboard: (data: any) => api.patch('/user/preferences/dashboard', data),
  resetToDefaults: () => api.post('/user/preferences/reset'),
};

// Activity Log APIs
export const activityLogAPI = {
  getActivityLogs: (params?: any) => api.get('/activity-logs', { params }),
  getMyActivity: (params?: any) => api.get('/activity-logs/my-activity', { params }),
  getActivityStats: () => api.get('/activity-logs/stats'),
  getActivityLogDetails: (logId: string) => api.get(`/activity-logs/${logId}`),
  cleanupOldLogs: (data?: any) => api.post('/activity-logs/cleanup', data),
};

// Search APIs
export const searchAPI = {
  globalSearch: (query: string, params?: any) => api.get('/search', { params: { q: query, ...params } }),
  searchDeals: (query: string, params?: any) => api.get('/search/deals', { params: { q: query, ...params } }),
  searchInvestments: (query: string, params?: any) => api.get('/search/investments', { params: { q: query, ...params } }),
  searchDocuments: (query: string, params?: any) => api.get('/search/documents', { params: { q: query, ...params } }),
  searchAnnouncements: (query: string, params?: any) => api.get('/search/announcements', { params: { q: query, ...params } }),
  getSuggestions: (query: string) => api.get('/search/suggestions', { params: { q: query } }),
};

// Report APIs
export const reportAPI = {
  getReports: (params?: any) => api.get('/reports', { params }),
  getReportDetails: (reportId: string) => api.get(`/reports/${reportId}`),
  getTemplates: () => api.get('/reports/templates'),
  generateReport: (data: any) => api.post('/reports/generate', data),
  downloadReport: (reportId: string) => api.get(`/reports/${reportId}/download`, { responseType: 'blob' }),
  deleteReport: (reportId: string) => api.delete(`/reports/${reportId}`),
};

// Payment APIs (v1.6.0)
export const paymentAPI = {
  getMethods: (params?: any) => api.get('/payments/methods', { params }),
  addMethod: (data: any) => api.post('/payments/methods', data),
  setDefaultMethod: (methodId: string) => api.post(`/payments/methods/${methodId}/set-default`),
  removeMethod: (methodId: string) => api.delete(`/payments/methods/${methodId}`),
  createSetupIntent: () => api.post('/payments/stripe/setup-intent'),
  getTransactions: (params?: any) => api.get('/payments/transactions', { params }),
  createCharge: (data: any) => api.post('/payments/charge', data),
  refund: (transactionId: string, data: any) => api.post(`/payments/refund/${transactionId}`, data),
};

// Webhook APIs (v1.6.0)
export const webhookAPI = {
  getWebhooks: (params?: any) => api.get('/webhooks', { params }),
  getWebhook: (webhookId: string) => api.get(`/webhooks/${webhookId}`),
  createWebhook: (data: any) => api.post('/webhooks', data),
  updateWebhook: (webhookId: string, data: any) => api.patch(`/webhooks/${webhookId}`, data),
  deleteWebhook: (webhookId: string) => api.delete(`/webhooks/${webhookId}`),
  testWebhook: (webhookId: string) => api.post(`/webhooks/${webhookId}/test`),
  getDeliveries: (webhookId: string, params?: any) => api.get(`/webhooks/${webhookId}/deliveries`, { params }),
  getDelivery: (webhookId: string, deliveryId: string) => api.get(`/webhooks/${webhookId}/deliveries/${deliveryId}`),
  retryDelivery: (webhookId: string, deliveryId: string) => api.post(`/webhooks/${webhookId}/deliveries/${deliveryId}/retry`),
  getAvailableEvents: () => api.get('/webhooks/events'),
};

// Email APIs (v1.6.0)
export const emailAPI = {
  getTemplates: (params?: any) => api.get('/emails/templates', { params }),
  getTemplate: (templateId: string) => api.get(`/emails/templates/${templateId}`),
  createTemplate: (data: any) => api.post('/emails/templates', data),
  updateTemplate: (templateId: string, data: any) => api.patch(`/emails/templates/${templateId}`, data),
  deleteTemplate: (templateId: string) => api.delete(`/emails/templates/${templateId}`),
  previewTemplate: (templateId: string, data: any) => api.post(`/emails/templates/${templateId}/preview`, data),
  sendEmail: (data: any) => api.post('/emails/send', data),
  sendTemplatedEmail: (data: any) => api.post('/emails/send-template', data),
  getLogs: (params?: any) => api.get('/emails/logs', { params }),
  getLog: (logId: string) => api.get(`/emails/logs/${logId}`),
  getStats: (params?: any) => api.get('/emails/stats', { params }),
};

// Workflow APIs (v1.6.0)
export const workflowAPI = {
  getWorkflows: (params?: any) => api.get('/workflows', { params }),
  getWorkflow: (workflowId: string) => api.get(`/workflows/${workflowId}`),
  createWorkflow: (data: any) => api.post('/workflows', data),
  updateWorkflow: (workflowId: string, data: any) => api.patch(`/workflows/${workflowId}`, data),
  deleteWorkflow: (workflowId: string) => api.delete(`/workflows/${workflowId}`),
  triggerWorkflow: (workflowId: string, data?: any) => api.post(`/workflows/${workflowId}/trigger`, data),
  getExecutions: (workflowId: string, params?: any) => api.get(`/workflows/${workflowId}/executions`, { params }),
  getExecution: (workflowId: string, executionId: string) => api.get(`/workflows/${workflowId}/executions/${executionId}`),
  retryExecution: (workflowId: string, executionId: string) => api.post(`/workflows/${workflowId}/executions/${executionId}/retry`),
  cancelExecution: (workflowId: string, executionId: string) => api.post(`/workflows/${workflowId}/executions/${executionId}/cancel`),
  getAvailableTriggers: () => api.get('/workflows/triggers'),
  getAvailableActions: () => api.get('/workflows/actions'),
};

// Wallet APIs
export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  getTransactions: (params?: any) => api.get('/wallet/transactions', { params }),
  getStats: () => api.get('/wallet/stats'),
  addFunds: (data: any) => api.post('/wallet/add-funds', data),
  withdraw: (data: any) => api.post('/wallet/withdraw', data),
};

// Property Management APIs
export const propertyManagementAPI = {
  getProperties: (params?: any) => api.get('/property-management', { params }),
  getPropertyDetails: (propertyId: string) => api.get(`/property-management/${propertyId}`),
  recordRent: (propertyId: string, data: any) => api.post(`/property-management/${propertyId}/rent`, data),
  recordExpense: (propertyId: string, data: any) => api.post(`/property-management/${propertyId}/expense`, data),
  updateOccupancy: (propertyId: string, data: any) => api.patch(`/property-management/${propertyId}/occupancy`, data),
  updateValuation: (propertyId: string, data: any) => api.patch(`/property-management/${propertyId}/valuation`, data),
  getPropertyReport: (propertyId: string, params?: any) => api.get(`/property-management/${propertyId}/report`, { params }),
  deleteRecord: (propertyId: string, recordId: string, recordType: string) => api.delete(`/property-management/${propertyId}/records/${recordId}?recordType=${recordType}`),
};

// Referral APIs
export const referralAPI = {
  getDashboard: () => api.get('/referrals/dashboard'),
  getLeaderboard: (params?: any) => api.get('/referrals/leaderboard', { params }),
  applyReferralCode: (data: any) => api.post('/referrals/apply', data),
  getRewards: () => api.get('/referrals/rewards'),
  getActivity: () => api.get('/referrals/activity'),
};

// Bundle APIs
export const bundleAPI = {
  list: (params?: any) => api.get('/bundles', { params }),
  get: (id: string) => api.get(`/bundles/${id}`),
  create: (data: any) => api.post('/bundles', data),
  update: (id: string, data: any) => api.patch(`/bundles/${id}`, data),
  publish: (id: string) => api.post(`/bundles/${id}/publish`),
  close: (id: string) => api.post(`/bundles/${id}/close`),
  invest: (id: string, data: any) => api.post(`/bundles/${id}/invest`, data),
};

// SIP Plan APIs
export const sipAPI = {
  list: (params?: any) => api.get('/sip/plans', { params }),
  get: (id: string) => api.get(`/sip/plans/${id}`),
  create: (data: any) => api.post('/sip/plans', data),
  subscribe: (planId: string, data: any) => api.post(`/sip/plans/${planId}/subscribe`, data),
  getMySubscriptions: () => api.get('/sip/subscriptions'),
  getSubscription: (id: string) => api.get(`/sip/subscriptions/${id}`),
  updateSubscription: (id: string, data: any) => api.patch(`/sip/subscriptions/${id}`, data),
  pauseSubscription: (id: string) => api.post(`/sip/subscriptions/${id}/pause`),
  resumeSubscription: (id: string) => api.post(`/sip/subscriptions/${id}/resume`),
  cancelSubscription: (id: string, data?: any) => api.post(`/sip/subscriptions/${id}/cancel`, data),
};

export default api;
