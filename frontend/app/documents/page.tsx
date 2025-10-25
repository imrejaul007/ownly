'use client';

import { useState, useEffect } from 'react';
import { documentAPI } from '@/lib/api';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    name: '',
    category: 'legal',
    description: '',
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterCategory !== 'all') params.category = filterCategory;
      if (searchQuery) params.search = searchQuery;

      const response = await documentAPI.getDocuments(params);
      setDocuments(response.data.data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: any = {
      legal: '⚖️',
      financial: '💰',
      property: '🏢',
      identity: '🆔',
      contract: '📝',
      report: '📊',
      other: '📄',
    };
    return icons[category] || '📄';
  };

  const getCategoryColor = (category: string) => {
    const colors: any = {
      legal: 'bg-purple-100 text-purple-800',
      financial: 'bg-green-100 text-green-800',
      property: 'bg-blue-100 text-blue-800',
      identity: 'bg-orange-100 text-orange-800',
      contract: 'bg-yellow-100 text-yellow-800',
      report: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      if (!uploadData.name) {
        setUploadData((prev) => ({ ...prev, name: e.target.files![0].name }));
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('name', uploadData.name);
      formData.append('category', uploadData.category);
      formData.append('description', uploadData.description);

      await documentAPI.uploadDocument(formData);
      alert('✅ Document uploaded successfully!');

      // Reset and refresh
      setUploadModalOpen(false);
      setSelectedFile(null);
      setUploadData({ name: '', category: 'legal', description: '' });
      fetchDocuments();
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || 'Upload failed');
    }
  };

  const handleDownload = async (documentId: string) => {
    try {
      window.open(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/download`, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed');
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await documentAPI.deleteDocument(documentId);
      alert('✅ Document deleted successfully');
      fetchDocuments();
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    const matchesSearch = !searchQuery || doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Document Library
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and access all your investment documents
            </p>
          </div>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <span>📤</span>
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="all">All Categories</option>
              <option value="legal">⚖️ Legal</option>
              <option value="financial">💰 Financial</option>
              <option value="property">🏢 Property</option>
              <option value="identity">🆔 Identity</option>
              <option value="contract">📝 Contract</option>
              <option value="report">📊 Report</option>
              <option value="other">📄 Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl mb-1">⚖️</div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">Legal</div>
          <div className="text-lg font-bold">{documents.filter((d) => d.category === 'legal').length}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl mb-1">💰</div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">Financial</div>
          <div className="text-lg font-bold">{documents.filter((d) => d.category === 'financial').length}</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl mb-1">🏢</div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">Property</div>
          <div className="text-lg font-bold">{documents.filter((d) => d.category === 'property').length}</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl mb-1">🆔</div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">Identity</div>
          <div className="text-lg font-bold">{documents.filter((d) => d.category === 'identity').length}</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl mb-1">📝</div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">Contract</div>
          <div className="text-lg font-bold">{documents.filter((d) => d.category === 'contract').length}</div>
        </div>
        <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">Report</div>
          <div className="text-lg font-bold">{documents.filter((d) => d.category === 'report').length}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl mb-1">📄</div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">Other</div>
          <div className="text-lg font-bold">{documents.filter((d) => d.category === 'other').length}</div>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📂</div>
          <h3 className="text-xl font-bold mb-2">No documents found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery || filterCategory !== 'all'
              ? 'Try adjusting your filters'
              : 'Upload your first document to get started'}
          </p>
          <button onClick={() => setUploadModalOpen(true)} className="btn-primary">
            Upload Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition p-6"
            >
              {/* Icon and Category */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{getCategoryIcon(doc.category)}</div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(doc.category)}`}>
                  {doc.category}
                </span>
              </div>

              {/* Document Name */}
              <h3 className="text-lg font-bold mb-2 line-clamp-2">{doc.name}</h3>

              {/* Description */}
              {doc.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {doc.description}
                </p>
              )}

              {/* Metadata */}
              <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Size:</span>
                  <span className="font-semibold">{formatFileSize(doc.file_size || 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Uploaded:</span>
                  <span className="font-semibold">{new Date(doc.created_at).toLocaleDateString()}</span>
                </div>
                {doc.related_entity && (
                  <div className="flex items-center justify-between">
                    <span>Related to:</span>
                    <span className="font-semibold">{doc.related_entity}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(doc.id)}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Upload Document</h2>

            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Select File *</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              {/* Document Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Document Name *</label>
                <input
                  type="text"
                  value={uploadData.name}
                  onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                  placeholder="e.g., Investment Agreement - Deal 01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={uploadData.category}
                  onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
                >
                  <option value="legal">⚖️ Legal</option>
                  <option value="financial">💰 Financial</option>
                  <option value="property">🏢 Property</option>
                  <option value="identity">🆔 Identity</option>
                  <option value="contract">📝 Contract</option>
                  <option value="report">📊 Report</option>
                  <option value="other">📄 Other</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  placeholder="Brief description of the document..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button onClick={handleUpload} className="flex-1 btn-primary">
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
