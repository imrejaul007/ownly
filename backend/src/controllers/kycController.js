import { User, AuditLog } from '../models/index.js';
import { success, error } from '../utils/response.js';
import authConfig from '../config/auth.js';

export const uploadKYCDocument = async (req, res, next) => {
  try {
    const { documentType, documentData } = req.body;
    const userId = req.params.userId || req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return error(res, 'User not found', 404);
    }

    // Only user themselves or admin can upload
    if (userId !== req.user.id && req.user.role !== authConfig.roles.ADMIN) {
      return error(res, 'Not authorized', 403);
    }

    // In sandbox, we just store dummy document info
    const kycDocuments = user.kyc_documents || {};
    kycDocuments[documentType] = {
      fileName: documentData.fileName || `${documentType}.pdf`,
      uploadedAt: new Date(),
      status: 'pending',
      // In production, this would be S3 URL
      dummyUrl: `/dummy/kyc/${userId}/${documentType}.pdf`,
    };

    await user.update({
      kyc_documents: kycDocuments,
      kyc_status: authConfig.kycStatus.SUBMITTED,
    });

    // Create audit log
    await AuditLog.create({
      actor_id: req.user.id,
      action: 'upload_kyc_document',
      entity_type: 'user',
      entity_id: userId,
      delta: {
        documentType,
        fileName: documentData.fileName,
      },
    });

    return success(res, { user, kycDocuments }, 'KYC document uploaded successfully');
  } catch (err) {
    next(err);
  }
};

export const updateKYCStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { kycStatus, notes } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return error(res, 'User not found', 404);
    }

    const oldStatus = user.kyc_status;

    await user.update({
      kyc_status: kycStatus,
    });

    // Create audit log
    await AuditLog.create({
      actor_id: req.user.id,
      action: 'update_kyc_status',
      entity_type: 'user',
      entity_id: userId,
      delta: {
        before: oldStatus,
        after: kycStatus,
        notes,
      },
    });

    return success(res, { user }, 'KYC status updated successfully');
  } catch (err) {
    next(err);
  }
};

export const getKYCQueue = async (req, res, next) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status) {
      where.kyc_status = status;
    } else {
      // Default: show pending and submitted
      where.kyc_status = [authConfig.kycStatus.PENDING, authConfig.kycStatus.SUBMITTED, authConfig.kycStatus.UNDER_REVIEW];
    }

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'role', 'kyc_status', 'kyc_documents', 'created_at'],
      order: [['created_at', 'DESC']],
    });

    return success(res, { users, count: users.length });
  } catch (err) {
    next(err);
  }
};

export const getUserKYC = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'role', 'kyc_status', 'kyc_documents', 'created_at'],
    });

    if (!user) {
      return error(res, 'User not found', 404);
    }

    // Get KYC audit history
    const kycHistory = await AuditLog.findAll({
      where: {
        entity_type: 'user',
        entity_id: userId,
        action: ['upload_kyc_document', 'update_kyc_status'],
      },
      order: [['created_at', 'DESC']],
      limit: 20,
    });

    return success(res, { user, kycHistory });
  } catch (err) {
    next(err);
  }
};

export const bulkApproveKYC = async (req, res, next) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return error(res, 'User IDs required', 400);
    }

    // Update all users
    await User.update(
      { kyc_status: authConfig.kycStatus.APPROVED },
      { where: { id: userIds } }
    );

    // Create audit logs
    for (const userId of userIds) {
      await AuditLog.create({
        actor_id: req.user.id,
        action: 'update_kyc_status',
        entity_type: 'user',
        entity_id: userId,
        delta: {
          after: authConfig.kycStatus.APPROVED,
          bulkApproval: true,
        },
      });
    }

    return success(res, { approvedCount: userIds.length }, 'KYC bulk approval successful');
  } catch (err) {
    next(err);
  }
};
