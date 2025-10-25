'use client';

import { useState, useEffect } from 'react';
import { kycAPI } from '@/lib/api';

export default function KYCPage() {
  const [kycData, setKycData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('passport');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchKYCStatus(parsedUser.id);
    }
  }, []);

  const fetchKYCStatus = async (userId: string) => {
    try {
      setLoading(true);
      const response = await kycAPI.getUser(userId);
      setKycData(response.data.data);
    } catch (error) {
      console.error('Error fetching KYC status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      alert('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);

      // Create FormData
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('documentType', documentType);

      // Upload
      await kycAPI.upload(user.id, formData);

      alert('✅ Document uploaded successfully! Our team will review it within 24-48 hours.');

      // Refresh KYC data
      fetchKYCStatus(user.id);

      // Reset form
      setSelectedFile(null);
      setDocumentType('passport');
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      under_review: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: any = {
      pending: '⏳',
      approved: '✅',
      rejected: '❌',
      under_review: '🔍',
    };
    return icons[status] || '📄';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          KYC Verification
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Complete your identity verification to start investing
        </p>
      </div>

      {/* Current Status Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Verification Status</h2>

        {kycData && kycData.kyc_status ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">{getStatusIcon(kycData.kyc_status)}</span>
                <div>
                  <div className="font-semibold text-lg">Current Status</div>
                  <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(kycData.kyc_status)}`}>
                    {kycData.kyc_status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {kycData.kyc_status === 'approved' && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-200">
                  ✅ Your account is fully verified! You can now invest in all opportunities on OWNLY.
                </p>
              </div>
            )}

            {kycData.kyc_status === 'pending' && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <p className="text-yellow-800 dark:text-yellow-200">
                  ⏳ Your documents are pending review. We'll notify you once verified (typically 24-48 hours).
                </p>
              </div>
            )}

            {kycData.kyc_status === 'under_review' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200">
                  🔍 Our team is currently reviewing your documents. You'll be notified soon.
                </p>
              </div>
            )}

            {kycData.kyc_status === 'rejected' && kycData.kyc_notes && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                  ❌ Verification Rejected
                </p>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Reason: {kycData.kyc_notes}
                </p>
                <p className="text-red-700 dark:text-red-300 text-sm mt-2">
                  Please upload corrected documents below.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <p className="text-yellow-800 dark:text-yellow-200">
              ⚠️ KYC verification is required to start investing. Please upload your documents below.
            </p>
          </div>
        )}
      </div>

      {/* Upload Section */}
      {(!kycData || kycData.kyc_status !== 'approved') && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Upload Documents</h2>

          <div className="space-y-4">
            {/* Document Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Document Type *</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="passport">Passport</option>
                <option value="emirates_id">Emirates ID</option>
                <option value="national_id">National ID</option>
                <option value="driving_license">Driving License</option>
                <option value="proof_of_address">Proof of Address</option>
                <option value="bank_statement">Bank Statement</option>
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Upload File *</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-block"
                >
                  <div className="text-5xl mb-3">📄</div>
                  <div className="text-primary-600 font-semibold mb-1">
                    Click to upload
                  </div>
                  <div className="text-sm text-gray-500">
                    or drag and drop
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    PNG, JPG, PDF (max. 10MB)
                  </div>
                </label>
              </div>

              {selectedFile && (
                <div className="mt-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span>📎</span>
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Upload Document</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Requirements Checklist */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">KYC Requirements</h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <span className="text-green-600">✓</span>
            <div>
              <div className="font-semibold">Government-issued ID</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Passport, Emirates ID, National ID, or Driver's License
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-green-600">✓</span>
            <div>
              <div className="font-semibold">Proof of Address</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Utility bill, bank statement, or rental agreement (within 3 months)
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-green-600">✓</span>
            <div>
              <div className="font-semibold">Clear & Valid</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Documents must be clear, unobstructed, and not expired
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-green-600">✓</span>
            <div>
              <div className="font-semibold">Accepted Formats</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                JPG, PNG, or PDF (max 10MB per file)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="font-bold mb-2">💡 Need Help?</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          Our support team is here to assist you with the verification process.
        </p>
        <a
          href="mailto:support@ownly.ae"
          className="text-primary-600 font-semibold hover:underline"
        >
          Contact Support →
        </a>
      </div>
    </div>
  );
}
