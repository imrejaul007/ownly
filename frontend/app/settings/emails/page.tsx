'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { emailAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface EmailTemplate {
  id: string;
  name: string;
  display_name: string;
  category: string;
  subject: string;
  html_body: string;
  text_body: string;
  variables: string[];
  sender_email?: string;
  sender_name?: string;
  is_system: boolean;
  send_count: number;
  last_used_at?: string;
  created_at: string;
}

interface EmailLog {
  id: string;
  email_template_id?: string;
  recipient_email: string;
  recipient_name?: string;
  subject: string;
  status: 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  provider: string;
  opened_count: number;
  clicked_count: number;
  sent_at?: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  created_at: string;
}

interface EmailStats {
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  total_bounced: number;
  total_failed: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
}

export default function EmailTemplatesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'templates' | 'logs' | 'stats'>('templates');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    category: 'transactional',
    subject: '',
    html_body: '',
    text_body: '',
    variables: [] as string[],
    sender_email: '',
    sender_name: '',
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'templates') {
        const response = await emailAPI.getTemplates();
        setTemplates(response.data.templates || []);
      } else if (activeTab === 'logs') {
        const response = await emailAPI.getLogs();
        setLogs(response.data.logs || []);
      } else if (activeTab === 'stats') {
        const response = await emailAPI.getStats();
        setStats(response.data.stats || null);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      showMessage('error', error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      if (selectedTemplate) {
        await emailAPI.updateTemplate(selectedTemplate.id, formData);
        showMessage('success', 'Template updated successfully');
      } else {
        await emailAPI.createTemplate(formData);
        showMessage('success', 'Template created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('Error saving template:', error);
      showMessage('error', error.response?.data?.message || 'Failed to save template');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    setProcessing(true);
    try {
      await emailAPI.deleteTemplate(templateId);
      showMessage('success', 'Template deleted successfully');
      fetchData();
    } catch (error: any) {
      console.error('Error deleting template:', error);
      showMessage('error', error.response?.data?.message || 'Failed to delete template');
    } finally {
      setProcessing(false);
    }
  };

  const handlePreviewTemplate = async (template: EmailTemplate) => {
    setProcessing(true);
    try {
      const response = await emailAPI.previewTemplate(template.id, {
        variables: {
          user: { name: 'John Doe', email: 'john@example.com' },
          deal: { title: 'Sample Deal' },
          amount: '10,000',
        },
      });
      setPreviewHtml(response.data.preview.html);
      setShowPreview(true);
    } catch (error: any) {
      console.error('Error previewing template:', error);
      showMessage('error', error.response?.data?.message || 'Failed to preview template');
    } finally {
      setProcessing(false);
    }
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      display_name: template.display_name,
      category: template.category,
      subject: template.subject,
      html_body: template.html_body,
      text_body: template.text_body,
      variables: template.variables,
      sender_email: template.sender_email || '',
      sender_name: template.sender_name || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setSelectedTemplate(null);
    setFormData({
      name: '',
      display_name: '',
      category: 'transactional',
      subject: '',
      html_body: '',
      text_body: '',
      variables: [],
      sender_email: '',
      sender_name: '',
    });
  };

  const addVariable = (varName: string) => {
    if (varName && !formData.variables.includes(varName)) {
      setFormData({ ...formData, variables: [...formData.variables, varName] });
    }
  };

  const removeVariable = (varName: string) => {
    setFormData({ ...formData, variables: formData.variables.filter((v) => v !== varName) });
  };

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      queued: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      opened: 'bg-purple-100 text-purple-800',
      clicked: 'bg-indigo-100 text-indigo-800',
      bounced: 'bg-orange-100 text-orange-800',
      failed: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/settings')}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
          >
            ← Back to Settings
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
              <p className="mt-2 text-gray-600">Create and manage email templates with variable substitution</p>
            </div>
            {activeTab === 'templates' && (
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                disabled={processing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                + Create Template
              </button>
            )}
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('templates')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'templates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Templates
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'logs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Email Logs
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'stats'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Statistics
              </button>
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : activeTab === 'templates' ? (
              <div>
                {templates.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-6xl mb-4">✉️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates yet</h3>
                    <p className="text-gray-600 mb-6">Create your first email template</p>
                    <button
                      onClick={() => {
                        resetForm();
                        setShowModal(true);
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Create Template
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{template.display_name}</h3>
                            <p className="text-sm text-gray-600">{template.category}</p>
                          </div>
                          {template.is_system && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                              System
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{template.subject}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {template.variables.slice(0, 3).map((variable) => (
                            <span key={variable} className="px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded">
                              {'{{'}{variable}{'}}'}
                            </span>
                          ))}
                          {template.variables.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              +{template.variables.length - 3}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>Sent: {template.send_count}</span>
                          <span>{formatDate(template.created_at)}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePreviewTemplate(template)}
                            disabled={processing}
                            className="flex-1 px-3 py-2 text-sm text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50"
                          >
                            Preview
                          </button>
                          {!template.is_system && (
                            <>
                              <button
                                onClick={() => handleEditTemplate(template)}
                                className="flex-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTemplate(template.id)}
                                disabled={processing}
                                className="px-3 py-2 text-sm text-red-700 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === 'logs' ? (
              <div>
                {logs.length === 0 ? (
                  <div className="text-center py-12 text-gray-600">No email logs yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opens</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map((log) => (
                          <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm">
                              <div className="font-medium text-gray-900">{log.recipient_name || 'N/A'}</div>
                              <div className="text-gray-500">{log.recipient_email}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{log.subject}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(log.status)}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{log.opened_count}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{log.clicked_count}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {formatDate(log.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {stats ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total_sent}</div>
                      <div className="text-sm text-blue-800">Total Sent</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-6">
                      <div className="text-3xl font-bold text-green-600 mb-2">{stats.total_delivered}</div>
                      <div className="text-sm text-green-800">Delivered</div>
                      <div className="text-xs text-green-600 mt-1">
                        {stats.total_sent > 0 ? ((stats.total_delivered / stats.total_sent) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-6">
                      <div className="text-3xl font-bold text-purple-600 mb-2">{stats.total_opened}</div>
                      <div className="text-sm text-purple-800">Opened</div>
                      <div className="text-xs text-purple-600 mt-1">{(stats.open_rate * 100).toFixed(1)}%</div>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-6">
                      <div className="text-3xl font-bold text-indigo-600 mb-2">{stats.total_clicked}</div>
                      <div className="text-sm text-indigo-800">Clicked</div>
                      <div className="text-xs text-indigo-600 mt-1">{(stats.click_rate * 100).toFixed(1)}%</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-6">
                      <div className="text-3xl font-bold text-orange-600 mb-2">{stats.total_bounced}</div>
                      <div className="text-sm text-orange-800">Bounced</div>
                      <div className="text-xs text-orange-600 mt-1">{(stats.bounce_rate * 100).toFixed(1)}%</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-6">
                      <div className="text-3xl font-bold text-red-600 mb-2">{stats.total_failed}</div>
                      <div className="text-sm text-red-800">Failed</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-600">No statistics available yet</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Template Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 my-8 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {selectedTemplate ? 'Edit Template' : 'Create Template'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTemplate}>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="welcome_email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.display_name}
                      onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Welcome Email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="transactional">Transactional</option>
                      <option value="marketing">Marketing</option>
                      <option value="notification">Notification</option>
                      <option value="alert">Alert</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Welcome to {{company_name}}, {{user.name}}!"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use {'{{'}{'}}'} for variables, e.g., {'{{'}user.name{'}}'}</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">HTML Body *</label>
                  <textarea
                    required
                    value={formData.html_body}
                    onChange={(e) => setFormData({ ...formData, html_body: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    placeholder="<h1>Hello {{user.name}}</h1><p>...</p>"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Body</label>
                  <textarea
                    value={formData.text_body}
                    onChange={(e) => setFormData({ ...formData, text_body: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Plain text version"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sender Email</label>
                    <input
                      type="email"
                      value={formData.sender_email}
                      onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="noreply@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sender Name</label>
                    <input
                      type="text"
                      value={formData.sender_name}
                      onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="OWNLY"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {processing ? 'Saving...' : selectedTemplate ? 'Update Template' : 'Create Template'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 my-8 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">Email Preview</h3>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    setPreviewHtml('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="border border-gray-300 rounded-lg p-6">
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
