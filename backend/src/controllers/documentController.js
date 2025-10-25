import sequelize from '../config/database.js';
import { Document, Deal, SPV, User } from '../models/index.js';
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Get documents for a deal or SPV
 */
export const getDocuments = async (req, res, next) => {
  try {
    const { dealId, spvId, documentType, visibility } = req.query;

    const where = {};

    if (dealId) where.deal_id = dealId;
    if (spvId) where.spv_id = spvId;
    if (documentType) where.document_type = documentType;
    if (visibility) where.visibility = visibility;

    const documents = await Document.findAll({
      where,
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'full_name', 'email'],
        },
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title'],
        },
        {
          model: SPV,
          as: 'spv',
          attributes: ['id', 'name'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    successResponse(res, { documents, count: documents.length });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single document details
 */
export const getDocumentDetails = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findByPk(documentId, {
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'full_name', 'email'],
        },
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title'],
        },
        {
          model: SPV,
          as: 'spv',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!document) {
      return errorResponse(res, 'Document not found', 404);
    }

    successResponse(res, { document });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload document (simulated for sandbox)
 */
export const uploadDocument = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      dealId,
      spvId,
      documentType,
      fileName,
      fileSize,
      mimeType,
      description,
      visibility,
      version,
    } = req.body;

    // Validate that at least one of dealId or spvId is provided
    if (!dealId && !spvId) {
      return errorResponse(res, 'Either dealId or spvId must be provided', 400);
    }

    // In sandbox mode, we simulate file storage
    const storagePath = `/sandbox/documents/${userId}/${Date.now()}_${fileName}`;

    const document = await Document.create({
      deal_id: dealId || null,
      spv_id: spvId || null,
      uploaded_by: userId,
      document_type: documentType,
      file_name: fileName,
      file_size: fileSize,
      mime_type: mimeType,
      storage_path: storagePath,
      description: description || null,
      version: version || '1.0',
      visibility: visibility || 'investors_only',
      metadata: {
        uploaded_at: new Date(),
        sandbox_mode: true,
      },
    });

    const fullDocument = await Document.findByPk(document.id, {
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'full_name', 'email'],
        },
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title'],
        },
        {
          model: SPV,
          as: 'spv',
          attributes: ['id', 'name'],
        },
      ],
    });

    successResponse(res, { document: fullDocument }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Download document (simulated for sandbox)
 */
export const downloadDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findByPk(documentId);

    if (!document) {
      return errorResponse(res, 'Document not found', 404);
    }

    // Increment download count
    await document.update({
      download_count: document.download_count + 1,
    });

    // In sandbox mode, return download URL instead of actual file
    successResponse(res, {
      message: 'Document download prepared (sandbox mode)',
      downloadUrl: document.storage_path,
      fileName: document.file_name,
      mimeType: document.mime_type,
      fileSize: document.file_size,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update document
 */
export const updateDocument = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { documentId } = req.params;
    const updates = req.body;

    const document = await Document.findByPk(documentId);

    if (!document) {
      return errorResponse(res, 'Document not found', 404);
    }

    // Check if user is the uploader or admin
    if (document.uploaded_by !== userId && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to update this document', 403);
    }

    await document.update(updates);

    const updatedDocument = await Document.findByPk(documentId, {
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'full_name', 'email'],
        },
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title'],
        },
        {
          model: SPV,
          as: 'spv',
          attributes: ['id', 'name'],
        },
      ],
    });

    successResponse(res, { document: updatedDocument });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete document
 */
export const deleteDocument = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { documentId } = req.params;

    const document = await Document.findByPk(documentId);

    if (!document) {
      return errorResponse(res, 'Document not found', 404);
    }

    // Check if user is the uploader or admin
    if (document.uploaded_by !== userId && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to delete this document', 403);
    }

    await document.destroy();

    successResponse(res, { message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get document statistics
 */
export const getDocumentStats = async (req, res, next) => {
  try {
    const { dealId, spvId } = req.query;

    const where = {};
    if (dealId) where.deal_id = dealId;
    if (spvId) where.spv_id = spvId;

    const stats = {
      total: await Document.count({ where }),
      byType: {},
      totalDownloads: 0,
      totalSize: 0,
    };

    const documents = await Document.findAll({ where });

    // Calculate statistics
    documents.forEach((doc) => {
      if (!stats.byType[doc.document_type]) {
        stats.byType[doc.document_type] = 0;
      }
      stats.byType[doc.document_type]++;
      stats.totalDownloads += doc.download_count;
      stats.totalSize += doc.file_size;
    });

    // Format file size
    stats.totalSizeMB = (stats.totalSize / (1024 * 1024)).toFixed(2);

    successResponse(res, { stats });
  } catch (error) {
    next(error);
  }
};

export default {
  getDocuments,
  getDocumentDetails,
  uploadDocument,
  downloadDocument,
  updateDocument,
  deleteDocument,
  getDocumentStats,
};
