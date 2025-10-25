'use client';

import { useState, useEffect } from 'react';
import { announcementAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'recent'>('recent');

  useEffect(() => {
    fetchAnnouncements();
  }, [filter]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response =
        filter === 'recent'
          ? await announcementAPI.getRecentAnnouncements({ limit: 20 })
          : await announcementAPI.getAnnouncements({ publishedOnly: 'true' });
      setAnnouncements(response.data.data.announcements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (announcementId: string) => {
    try {
      const response = await announcementAPI.getAnnouncementDetails(announcementId);
      setSelectedAnnouncement(response.data.data.announcement);
    } catch (error) {
      console.error('Error fetching announcement details:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      deal_update: '📊',
      financial_report: '💰',
      milestone: '🎯',
      payout_announcement: '💵',
      general: '📢',
      urgent: '🚨',
    };
    return icons[type] || '📢';
  };

  const getTypeBadgeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      deal_update: 'bg-blue-100 text-blue-800',
      financial_report: 'bg-green-100 text-green-800',
      milestone: 'bg-purple-100 text-purple-800',
      payout_announcement: 'bg-yellow-100 text-yellow-800',
      general: 'bg-gray-100 text-gray-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Announcements
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Stay updated with platform news and deal updates
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setFilter('recent')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              filter === 'recent'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              filter === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Announcements
          </button>
        </nav>
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List View */}
        <div className="lg:col-span-2 space-y-4">
          {announcements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No announcements available</p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                onClick={() => handleViewDetails(announcement.id)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-3xl">
                    {getTypeIcon(announcement.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {announcement.title}
                      </h3>
                      {announcement.priority === 'high' && (
                        <span className="badge badge-orange ml-2">High Priority</span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {announcement.summary || announcement.content.substring(0, 150) + '...'}
                    </p>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span className={`badge ${getTypeBadgeColor(announcement.type)}`}>
                        {announcement.type.replace('_', ' ')}
                      </span>
                      <span>{formatDate(announcement.published_at)}</span>
                      {announcement.deal && (
                        <span>Deal: {announcement.deal.title}</span>
                      )}
                      <span>{announcement.view_count} views</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Details View */}
        <div className="lg:col-span-1">
          {selectedAnnouncement ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedAnnouncement.title}
                </h2>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <span className={`badge ${getTypeBadgeColor(selectedAnnouncement.type)}`}>
                  {selectedAnnouncement.type.replace('_', ' ')}
                </span>
                {selectedAnnouncement.priority === 'high' && (
                  <span className="badge badge-orange">High Priority</span>
                )}
              </div>

              <div className="prose dark:prose-invert max-w-none mb-6">
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedAnnouncement.content}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Published:</span>{' '}
                  {formatDate(selectedAnnouncement.published_at)}
                </div>
                <div>
                  <span className="font-medium">By:</span>{' '}
                  {selectedAnnouncement.creator?.full_name}
                </div>
                {selectedAnnouncement.deal && (
                  <div>
                    <span className="font-medium">Deal:</span>{' '}
                    {selectedAnnouncement.deal.title}
                  </div>
                )}
                {selectedAnnouncement.spv && (
                  <div>
                    <span className="font-medium">SPV:</span>{' '}
                    {selectedAnnouncement.spv.name}
                  </div>
                )}
                <div>
                  <span className="font-medium">Views:</span> {selectedAnnouncement.view_count}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center text-gray-500 sticky top-8">
              <p>Select an announcement to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
