'use client';

import { useState, useEffect } from 'react';
import { announcementAPI, documentAPI, dealAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<'announcements' | 'documents'>('announcements');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchData();
    fetchDeals();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'announcements') {
        const response = await announcementAPI.getAnnouncements({ publishedOnly: 'false' });
        setAnnouncements(response.data.data.announcements);
      } else {
        const response = await documentAPI.getDocuments();
        setDocuments(response.data.data.documents);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeals = async () => {
    try {
      const response = await dealAPI.list({ status: 'funded' });
      const fundedDeals = response.data.data.filter((d: any) => d.spv);
      setDeals(fundedDeals);
    } catch (error) {
      console.error('Error fetching deals:', error);
    }
  };

  const handlePublishAnnouncement = async (announcementId: string) => {
    try {
      await announcementAPI.publishAnnouncement(announcementId);
      fetchData();
      alert('Announcement published successfully!');
    } catch (error: any) {
      console.error('Error publishing announcement:', error);
      alert(error.response?.data?.message || 'Failed to publish announcement');
    }
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (!confirm('Delete this announcement?')) return;

    try {
      await announcementAPI.deleteAnnouncement(announcementId);
      fetchData();
    } catch (error: any) {
      console.error('Error deleting announcement:', error);
      alert(error.response?.data?.message || 'Failed to delete announcement');
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Delete this document?')) return;

    try {
      await documentAPI.deleteDocument(documentId);
      fetchData();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      alert(error.response?.data?.message || 'Failed to delete document');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Communications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage announcements and documents
          </p>
        </div>
        <div className="flex space-x-3">
          {activeTab === 'announcements' ? (
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">
              + Create Announcement
            </button>
          ) : (
            <button onClick={() => setShowUploadModal(true)} className="btn-primary">
              + Upload Document
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'announcements'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'documents'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Documents
          </button>
        </nav>
      </div>

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Audience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {announcements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-600">
                      No announcements created yet
                    </td>
                  </tr>
                ) : (
                  announcements.map((announcement) => (
                    <tr key={announcement.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {announcement.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {announcement.published_at
                            ? formatDate(announcement.published_at)
                            : 'Draft'}
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize">{announcement.type.replace('_', ' ')}</td>
                      <td className="px-6 py-4 capitalize">{announcement.audience.replace('_', ' ')}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`badge ${announcement.published ? 'badge-green' : 'badge-yellow'}`}
                        >
                          {announcement.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">{announcement.view_count}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {!announcement.published && (
                            <button
                              onClick={() => handlePublishAnnouncement(announcement.id)}
                              className="text-sm text-green-600 hover:text-green-900 font-medium"
                            >
                              Publish
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                            className="text-sm text-red-600 hover:text-red-900 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Deal/SPV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-600">
                      No documents uploaded yet
                    </td>
                  </tr>
                ) : (
                  documents.map((document) => (
                    <tr key={document.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {document.file_name}
                        </div>
                        {document.description && (
                          <div className="text-sm text-gray-500">{document.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 capitalize">
                        {document.document_type.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4">
                        {document.deal?.title || document.spv?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        {(document.file_size / 1024).toFixed(0)} KB
                      </td>
                      <td className="px-6 py-4">{formatDate(document.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteDocument(document.id)}
                            className="text-sm text-red-600 hover:text-red-900 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <CreateAnnouncementModal
          deals={deals}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchData();
          }}
        />
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <UploadDocumentModal
          deals={deals}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

function CreateAnnouncementModal({
  deals,
  onClose,
  onSuccess,
}: {
  deals: any[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    summary: '',
    type: 'general',
    audience: 'all',
    priority: 'normal',
    dealId: '',
    spvId: '',
    publishNow: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await announcementAPI.createAnnouncement(form);
      alert('Announcement created successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Error creating announcement:', error);
      alert(error.response?.data?.message || 'Failed to create announcement');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Create Announcement</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Summary (optional)</label>
            <input
              type="text"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="input w-full"
              placeholder="Brief description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="input w-full"
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input w-full"
              >
                <option value="general">General</option>
                <option value="deal_update">Deal Update</option>
                <option value="financial_report">Financial Report</option>
                <option value="milestone">Milestone</option>
                <option value="payout_announcement">Payout Announcement</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="input w-full"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Audience</label>
            <select
              value={form.audience}
              onChange={(e) => setForm({ ...form, audience: e.target.value })}
              className="input w-full"
            >
              <option value="all">All Users</option>
              <option value="investors_only">Investors Only</option>
              <option value="specific_deal">Specific Deal</option>
              <option value="specific_spv">Specific SPV</option>
            </select>
          </div>

          {(form.audience === 'specific_deal' || form.audience === 'specific_spv') && (
            <div>
              <label className="block text-sm font-medium mb-2">Select Deal</label>
              <select
                value={form.dealId}
                onChange={(e) => {
                  const deal = deals.find((d) => d.id === e.target.value);
                  setForm({ ...form, dealId: e.target.value, spvId: deal?.spv?.id || '' });
                }}
                className="input w-full"
                required
              >
                <option value="">Select Deal</option>
                {deals.map((deal) => (
                  <option key={deal.id} value={deal.id}>
                    {deal.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="publishNow"
              checked={form.publishNow}
              onChange={(e) => setForm({ ...form, publishNow: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="publishNow" className="text-sm">
              Publish immediately
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Create Announcement
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UploadDocumentModal({
  deals,
  onClose,
  onSuccess,
}: {
  deals: any[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    dealId: '',
    spvId: '',
    documentType: 'pitch_deck',
    fileName: '',
    fileSize: 1024000,
    mimeType: 'application/pdf',
    description: '',
    visibility: 'investors_only',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await documentAPI.uploadDocument(form);
      alert('Document uploaded successfully! (Sandbox mode - simulated)');
      onSuccess();
    } catch (error: any) {
      console.error('Error uploading document:', error);
      alert(error.response?.data?.message || 'Failed to upload document');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Upload Document (Sandbox)</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Deal</label>
            <select
              value={form.dealId}
              onChange={(e) => {
                const deal = deals.find((d) => d.id === e.target.value);
                setForm({ ...form, dealId: e.target.value, spvId: deal?.spv?.id || '' });
              }}
              className="input w-full"
              required
            >
              <option value="">Select Deal</option>
              {deals.map((deal) => (
                <option key={deal.id} value={deal.id}>
                  {deal.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Document Type</label>
            <select
              value={form.documentType}
              onChange={(e) => setForm({ ...form, documentType: e.target.value })}
              className="input w-full"
            >
              <option value="pitch_deck">Pitch Deck</option>
              <option value="financial_statement">Financial Statement</option>
              <option value="legal_agreement">Legal Agreement</option>
              <option value="operating_agreement">Operating Agreement</option>
              <option value="ppm">PPM</option>
              <option value="tax_document">Tax Document</option>
              <option value="report">Report</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">File Name</label>
            <input
              type="text"
              value={form.fileName}
              onChange={(e) => setForm({ ...form, fileName: e.target.value })}
              className="input w-full"
              placeholder="document.pdf"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input w-full"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Visibility</label>
            <select
              value={form.visibility}
              onChange={(e) => setForm({ ...form, visibility: e.target.value })}
              className="input w-full"
            >
              <option value="public">Public</option>
              <option value="investors_only">Investors Only</option>
              <option value="admin_only">Admin Only</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Upload
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
