'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

interface Report {
  id: string;
  report_type: string;
  title: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  period_start: string | null;
  period_end: string | null;
  filters: any;
  data: any;
  file_path: string | null;
  file_size: number | null;
  generated_at: string | null;
  expires_at: string | null;
  created_at: string;
}

interface ReportTemplate {
  type: string;
  name: string;
  description: string;
  icon: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    reportType: '',
    title: '',
    periodStart: '',
    periodEnd: '',
    format: 'pdf',
  });

  useEffect(() => {
    fetchReports();
    fetchTemplates();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      setReports(data.reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/templates`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      setTemplates(data.templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const generateReport = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType: generateForm.reportType,
          title: generateForm.title,
          periodStart: generateForm.periodStart || null,
          periodEnd: generateForm.periodEnd || null,
          format: generateForm.format,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate report');
      const data = await response.json();

      setShowGenerateModal(false);
      setGenerateForm({
        reportType: '',
        title: '',
        periodStart: '',
        periodEnd: '',
        format: 'pdf',
      });

      // Poll for report completion
      pollReportStatus(data.report.id);

      // Refresh reports list
      fetchReports();
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const pollReportStatus = async (reportId: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const checkStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/reports/${reportId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error('Failed to check report status');
        const data = await response.json();

        if (data.report.status === 'completed' || data.report.status === 'failed') {
          fetchReports();
          return;
        }

        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkStatus, 2000);
        }
      } catch (error) {
        console.error('Error checking report status:', error);
      }
    };

    checkStatus();
  };

  const downloadReport = async (reportId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reports/${reportId}/download`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to download report');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report');
    }
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete report');
      fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete report');
    }
  };

  const openGenerateModal = (templateType: string) => {
    const template = templates.find((t) => t.type === templateType);
    setGenerateForm({
      ...generateForm,
      reportType: templateType,
      title: template?.name || '',
    });
    setSelectedTemplate(templateType);
    setShowGenerateModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'portfolio_summary':
        return '📊';
      case 'investment_performance':
        return '📈';
      case 'tax_summary':
        return '🧾';
      case 'transaction_history':
        return '💳';
      case 'payout_history':
        return '💰';
      case 'deal_performance':
        return '🎯';
      default:
        return '📄';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading reports...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">Generate and manage your investment reports</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <button
                key={template.type}
                onClick={() => openGenerateModal(template.type)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{getTemplateIcon(template.type)}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Reports</h2>
          {reports.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
              <p className="text-gray-600">Generate your first report using one of the templates above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-3xl">{getTemplateIcon(report.report_type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📅 Created: {new Date(report.created_at).toLocaleDateString()}</span>
                          {report.generated_at && (
                            <span>✅ Generated: {new Date(report.generated_at).toLocaleDateString()}</span>
                          )}
                          {report.file_size && (
                            <span>📦 {(report.file_size / 1024).toFixed(0)} KB</span>
                          )}
                          {report.period_start && report.period_end && (
                            <span>
                              📊 Period: {new Date(report.period_start).toLocaleDateString()} -{' '}
                              {new Date(report.period_end).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {report.expires_at && (
                          <div className="text-xs text-gray-500 mt-2">
                            Expires: {new Date(report.expires_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {report.status === 'completed' && (
                        <button
                          onClick={() => downloadReport(report.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                        >
                          Download
                        </button>
                      )}
                      {report.status === 'generating' && (
                        <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                          Generating...
                        </div>
                      )}
                      {report.status === 'failed' && (
                        <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium">
                          Failed
                        </div>
                      )}
                      <button
                        onClick={() => deleteReport(report.id)}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showGenerateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Generate Report</h2>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Title</label>
                  <input
                    type="text"
                    value={generateForm.title}
                    onChange={(e) => setGenerateForm({ ...generateForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Q1 2024 Portfolio Summary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Period Start</label>
                    <input
                      type="date"
                      value={generateForm.periodStart}
                      onChange={(e) => setGenerateForm({ ...generateForm, periodStart: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Period End</label>
                    <input
                      type="date"
                      value={generateForm.periodEnd}
                      onChange={(e) => setGenerateForm({ ...generateForm, periodEnd: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                  <select
                    value={generateForm.format}
                    onChange={(e) => setGenerateForm({ ...generateForm, format: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowGenerateModal(false)}
                  disabled={generating}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={generateReport}
                  disabled={generating || !generateForm.title}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {generating ? 'Generating...' : 'Generate Report'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
