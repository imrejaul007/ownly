'use client';

import { useState } from 'react';
import {
  FolderOpen,
  Search,
  Download,
  Eye,
  FileText,
  FileCheck,
  Receipt,
  FileSpreadsheet,
  Upload,
  FileQuestion,
  Printer,
  Archive,
  Calendar,
  HardDrive,
  ArrowUpDown,
  Filter
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'deed' | 'agreement' | 'tax' | 'receipt';
  category: string;
  property: string;
  date: string;
  size: string;
  sizeBytes: number;
}

const allDocuments: Document[] = [
  // Property Deeds (3)
  { id: '1', name: 'Marina Heights - Title Deed.pdf', type: 'deed', category: 'Property Deeds', property: 'Dubai Marina', date: '15 Jan 2024', size: '2.4 MB', sizeBytes: 2400000 },
  { id: '2', name: 'Business Bay Tower - Title Deed.pdf', type: 'deed', category: 'Property Deeds', property: 'Business Bay', date: '20 Dec 2023', size: '2.1 MB', sizeBytes: 2100000 },
  { id: '3', name: 'Reem Island - Title Deed.pdf', type: 'deed', category: 'Property Deeds', property: 'Abu Dhabi', date: '10 Nov 2023', size: '2.3 MB', sizeBytes: 2300000 },

  // SPV Agreements (8)
  { id: '4', name: 'SPV Agreement - Marina Heights.pdf', type: 'agreement', category: 'Agreements', property: 'Dubai Marina', date: '15 Jan 2024', size: '850 KB', sizeBytes: 850000 },
  { id: '5', name: 'Shareholder Certificate - MH001.pdf', type: 'agreement', category: 'Agreements', property: 'Dubai Marina', date: '15 Jan 2024', size: '420 KB', sizeBytes: 420000 },
  { id: '6', name: 'SPV Agreement - Business Bay.pdf', type: 'agreement', category: 'Agreements', property: 'Business Bay', date: '20 Dec 2023', size: '780 KB', sizeBytes: 780000 },
  { id: '7', name: 'Shareholder Certificate - BB002.pdf', type: 'agreement', category: 'Agreements', property: 'Business Bay', date: '20 Dec 2023', size: '390 KB', sizeBytes: 390000 },
  { id: '8', name: 'SPV Agreement - Reem Island.pdf', type: 'agreement', category: 'Agreements', property: 'Abu Dhabi', date: '10 Nov 2023', size: '820 KB', sizeBytes: 820000 },
  { id: '9', name: 'Shareholder Certificate - RI003.pdf', type: 'agreement', category: 'Agreements', property: 'Abu Dhabi', date: '10 Nov 2023', size: '410 KB', sizeBytes: 410000 },
  { id: '10', name: 'Investment Terms - Marina Heights.pdf', type: 'agreement', category: 'Agreements', property: 'Dubai Marina', date: '15 Jan 2024', size: '650 KB', sizeBytes: 650000 },
  { id: '11', name: 'Investment Terms - Business Bay.pdf', type: 'agreement', category: 'Agreements', property: 'Business Bay', date: '20 Dec 2023', size: '620 KB', sizeBytes: 620000 },

  // Tax Documents (6)
  { id: '12', name: 'Tax Certificate 2024 - Q1.pdf', type: 'tax', category: 'Tax Documents', property: 'All Investments', date: '01 Apr 2024', size: '320 KB', sizeBytes: 320000 },
  { id: '13', name: 'Tax Certificate 2023 - Q4.pdf', type: 'tax', category: 'Tax Documents', property: 'All Investments', date: '01 Jan 2024', size: '310 KB', sizeBytes: 310000 },
  { id: '14', name: 'Tax Certificate 2023 - Q3.pdf', type: 'tax', category: 'Tax Documents', property: 'All Investments', date: '01 Oct 2023', size: '305 KB', sizeBytes: 305000 },
  { id: '15', name: 'Annual Tax Summary 2023.pdf', type: 'tax', category: 'Tax Documents', property: 'All Investments', date: '31 Dec 2023', size: '540 KB', sizeBytes: 540000 },
  { id: '16', name: 'Investment Income Statement 2023.pdf', type: 'tax', category: 'Tax Documents', property: 'All Investments', date: '31 Dec 2023', size: '450 KB', sizeBytes: 450000 },
  { id: '17', name: 'TDS Certificate 2023.pdf', type: 'tax', category: 'Tax Documents', property: 'All Investments', date: '31 Dec 2023', size: '280 KB', sizeBytes: 280000 },

  // Payout Receipts (7)
  { id: '18', name: 'Payout Receipt - March 2024.pdf', type: 'receipt', category: 'Payout Receipts', property: 'Marina Heights', date: '05 Mar 2024', size: '180 KB', sizeBytes: 180000 },
  { id: '19', name: 'Payout Receipt - February 2024.pdf', type: 'receipt', category: 'Payout Receipts', property: 'Marina Heights', date: '05 Feb 2024', size: '175 KB', sizeBytes: 175000 },
  { id: '20', name: 'Payout Receipt - January 2024.pdf', type: 'receipt', category: 'Payout Receipts', property: 'Marina Heights', date: '05 Jan 2024', size: '170 KB', sizeBytes: 170000 },
  { id: '21', name: 'Payout Receipt - March 2024.pdf', type: 'receipt', category: 'Payout Receipts', property: 'Business Bay', date: '08 Mar 2024', size: '185 KB', sizeBytes: 185000 },
  { id: '22', name: 'Payout Receipt - February 2024.pdf', type: 'receipt', category: 'Payout Receipts', property: 'Business Bay', date: '08 Feb 2024', size: '180 KB', sizeBytes: 180000 },
  { id: '23', name: 'Payout Receipt - March 2024.pdf', type: 'receipt', category: 'Payout Receipts', property: 'Reem Island', date: '10 Mar 2024', size: '190 KB', sizeBytes: 190000 },
  { id: '24', name: 'Payout Receipt - February 2024.pdf', type: 'receipt', category: 'Payout Receipts', property: 'Reem Island', date: '10 Feb 2024', size: '185 KB', sizeBytes: 185000 },
];

export default function DocumentVaultPage() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'deed' | 'agreement' | 'tax' | 'receipt'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'name' | 'date' | 'size'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

  // Filter documents based on tab and search
  const filteredDocuments = allDocuments.filter(doc => {
    const matchesTab = selectedTab === 'all' || doc.type === selectedTab;
    const matchesSearch = !searchQuery ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.property.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortField === 'size') {
      comparison = a.sizeBytes - b.sizeBytes;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Toggle sort
  const toggleSort = (field: 'name' | 'date' | 'size') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get document counts
  const counts = {
    all: allDocuments.length,
    deed: allDocuments.filter(d => d.type === 'deed').length,
    agreement: allDocuments.filter(d => d.type === 'agreement').length,
    tax: allDocuments.filter(d => d.type === 'tax').length,
    receipt: allDocuments.filter(d => d.type === 'receipt').length,
  };

  // Get file type icon
  const getFileIcon = (type: Document['type']) => {
    switch (type) {
      case 'deed':
        return FileCheck;
      case 'agreement':
        return FileText;
      case 'tax':
        return FileSpreadsheet;
      case 'receipt':
        return Receipt;
      default:
        return FileText;
    }
  };

  // Handle select/deselect document
  const toggleSelectDoc = (id: string) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDocs(newSelected);
  };

  // Handle select all
  const toggleSelectAll = () => {
    if (selectedDocs.size === sortedDocuments.length) {
      setSelectedDocs(new Set());
    } else {
      setSelectedDocs(new Set(sortedDocuments.map(d => d.id)));
    }
  };

  const handleView = (doc: Document) => {
    console.log('View document:', doc.name);
    // In real app, open document viewer
  };

  const handleDownload = (doc: Document) => {
    console.log('Download document:', doc.name);
    // In real app, trigger download
  };

  const handleDownloadAll = () => {
    console.log('Download all documents as ZIP');
    // In real app, trigger ZIP download
  };

  const handlePrintSelected = () => {
    console.log('Print selected documents:', Array.from(selectedDocs));
    // In real app, trigger print
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
                  <FolderOpen className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Document Vault
                </h1>
              </div>
              <p className="text-gray-400 text-lg ml-1">
                Access all your investment documents in one secure place
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 font-medium transition-all flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </button>
              <button className="px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-300 font-medium transition-all flex items-center gap-2">
                <FileQuestion className="w-4 h-4" />
                <span>Request</span>
              </button>
              <button
                onClick={handleDownloadAll}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-white font-medium transition-all flex items-center gap-2"
              >
                <Archive className="w-4 h-4" />
                <span>Download All</span>
              </button>
              {selectedDocs.size > 0 && (
                <button
                  onClick={handlePrintSelected}
                  className="px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-white font-medium transition-all flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print ({selectedDocs.size})</span>
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-8 relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents by name or property..."
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Document Category Tabs */}
        <div className="mb-8 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-2">
          <div className="flex flex-wrap gap-2">
            <TabButton
              active={selectedTab === 'all'}
              onClick={() => setSelectedTab('all')}
              count={counts.all}
              label="All Documents"
            />
            <TabButton
              active={selectedTab === 'deed'}
              onClick={() => setSelectedTab('deed')}
              count={counts.deed}
              label="Property Deeds"
            />
            <TabButton
              active={selectedTab === 'agreement'}
              onClick={() => setSelectedTab('agreement')}
              count={counts.agreement}
              label="Agreements"
            />
            <TabButton
              active={selectedTab === 'tax'}
              onClick={() => setSelectedTab('tax')}
              count={counts.tax}
              label="Tax Documents"
            />
            <TabButton
              active={selectedTab === 'receipt'}
              onClick={() => setSelectedTab('receipt')}
              count={counts.receipt}
              label="Payout Receipts"
            />
          </div>
        </div>

        {/* Document List */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="px-4 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedDocs.size === sortedDocuments.length && sortedDocuments.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-purple-500 focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => toggleSort('name')}
                      className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors uppercase tracking-wider"
                    >
                      Document Name
                      {sortField === 'name' && <ArrowUpDown className="w-4 h-4" />}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Deal/Property
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => toggleSort('date')}
                      className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors uppercase tracking-wider"
                    >
                      Date
                      {sortField === 'date' && <ArrowUpDown className="w-4 h-4" />}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => toggleSort('size')}
                      className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors uppercase tracking-wider"
                    >
                      Size
                      {sortField === 'size' && <ArrowUpDown className="w-4 h-4" />}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {sortedDocuments.map((doc) => {
                  const Icon = getFileIcon(doc.type);
                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-700/30 transition-colors group"
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedDocs.has(doc.id)}
                          onChange={() => toggleSelectDoc(doc.id)}
                          className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-purple-500 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg">
                            <Icon className="w-5 h-5 text-purple-400" />
                          </div>
                          <span className="font-medium text-white">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-xs font-medium text-gray-300">
                          {doc.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {doc.property}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {doc.date}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4" />
                          {doc.size}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(doc)}
                            className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors group/btn"
                            title="View"
                          >
                            <Eye className="w-5 h-5 text-gray-400 group-hover/btn:text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors group/btn"
                            title="Download"
                          >
                            <Download className="w-5 h-5 text-gray-400 group-hover/btn:text-purple-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-slate-700/50">
            {sortedDocuments.map((doc) => {
              const Icon = getFileIcon(doc.type);
              return (
                <div key={doc.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedDocs.has(doc.id)}
                      onChange={() => toggleSelectDoc(doc.id)}
                      className="mt-1 w-4 h-4 rounded bg-slate-700 border-slate-600 text-purple-500 focus:ring-purple-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg">
                          <Icon className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white mb-1 break-words">{doc.name}</h3>
                          <span className="inline-block px-2 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-xs font-medium text-gray-300">
                            {doc.category}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3 text-sm">
                        <div className="flex items-center justify-between text-gray-400">
                          <span>Property:</span>
                          <span className="text-gray-300">{doc.property}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-400">
                          <span>Date:</span>
                          <span className="text-gray-300">{doc.date}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-400">
                          <span>Size:</span>
                          <span className="text-gray-300">{doc.size}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(doc)}
                          className="flex-1 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-300 font-medium transition-all flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="flex-1 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 font-medium transition-all flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {sortedDocuments.length === 0 && (
            <div className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700/50 rounded-full mb-4">
                <FolderOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No documents found</h3>
              <p className="text-gray-400">
                {searchQuery ? 'Try adjusting your search query' : 'No documents in this category'}
              </p>
            </div>
          )}
        </div>

        {/* Storage Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">Documents Stored</span>
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">{allDocuments.length} files</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">Total Size</span>
              <HardDrive className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">15.2 MB</p>
          </div>

          <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">Last Updated</span>
              <Calendar className="w-5 h-5 text-pink-400" />
            </div>
            <p className="text-2xl font-bold text-white">5 Mar 2024</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">Storage</span>
              <Archive className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-lg font-bold text-white">Unlimited</p>
            <p className="text-xs text-gray-400 mt-1">For all investors</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  count,
  label
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2
        ${active
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
          : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
        }
      `}
    >
      <span>{label}</span>
      <span className={`
        px-2 py-0.5 rounded-full text-xs font-bold
        ${active
          ? 'bg-white/20 text-white'
          : 'bg-slate-700 text-gray-300'
        }
      `}>
        {count}
      </span>
    </button>
  );
}
