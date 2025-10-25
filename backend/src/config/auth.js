import dotenv from 'dotenv';

dotenv.config();

export default {
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  bcryptRounds: 10,

  roles: {
    INVESTOR_RETAIL: 'investor_retail',
    INVESTOR_HNI: 'investor_hni',
    INVESTOR_INSTITUTIONAL: 'investor_institutional',
    ADMIN: 'admin',
    SPV_ADMIN: 'spv_admin',
    OPERATIONS: 'operations',
    PROPERTY_MANAGER: 'property_manager',
    FRANCHISE_MANAGER: 'franchise_manager',
    AGENT: 'agent',
    AUDITOR: 'auditor',
    GUEST: 'guest',
  },

  kycStatus: {
    PENDING: 'pending',
    SUBMITTED: 'submitted',
    UNDER_REVIEW: 'under_review',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  },
};
