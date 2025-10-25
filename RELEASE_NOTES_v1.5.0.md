# OWNLY Sandbox Platform - v1.5.0 Release Notes

**Release Date**: October 21, 2025
**Version**: 1.5.0
**Codename**: User Experience & Utilities

---

## 🎉 What's New in v1.5.0

Version 1.5.0 represents a significant enhancement to the OWNLY Sandbox Platform, focusing on user experience, platform utilities, and operational efficiency. This release introduces four major feature sets that empower users with greater control and insights.

---

## ✨ Major Features

### 1. User Settings & Preferences

**Complete user customization and preference management**

Users can now fully customize their platform experience through a comprehensive settings interface:

- **Notification Preferences**: Granular control over email, push, and SMS notifications with per-category toggles (deals, payouts, documents, marketing, system announcements)
- **Display Settings**: Theme selection (light/dark/auto), language, currency, date/time format customization
- **Privacy Controls**: Profile visibility options (public/investors only/private), activity sharing preferences, data sharing controls
- **Security Settings**: Two-factor authentication toggle, login alerts, session timeout configuration, multiple session management
- **Dashboard Customization**: Default view selection, widget enablement, quick actions toggle, compact mode

**New Pages**:
- `/settings` - Tabbed settings interface with 6 categories

**New API Endpoints**:
- `GET /api/user/preferences` - Get user preferences
- `GET /api/user/preferences/defaults` - Get default preferences
- `PATCH /api/user/preferences` - Update general preferences
- `PATCH /api/user/preferences/notifications` - Update notification preferences
- `PATCH /api/user/preferences/display` - Update display preferences
- `PATCH /api/user/preferences/privacy` - Update privacy preferences
- `PATCH /api/user/preferences/security` - Update security preferences
- `PATCH /api/user/preferences/dashboard` - Update dashboard preferences
- `POST /api/user/preferences/reset` - Reset all preferences to defaults

---

### 2. Activity Logs & Audit Trail

**Comprehensive platform activity tracking for transparency and security**

Complete audit trail system that tracks all platform activities:

- **Activity Timeline**: Visual timeline of all user activities with color-coded severity levels
- **Filtering & Search**: Filter by category, severity, date range with search functionality
- **Activity Statistics**: Dashboard showing activity trends, categories, and severity distribution
- **Detailed Logs**: Track user actions, IP addresses, user agents, before/after changes
- **Activity Categories**: Authentication, investment, deal, payout, document, KYC, notification, profile, and system activities
- **Severity Levels**: Info, warning, error, critical classifications
- **Admin Functions**: Cleanup old logs while preserving critical entries

**New Pages**:
- `/activity` - Activity logs viewer with timeline and statistics

**New API Endpoints**:
- `GET /api/activity-logs` - Get all activity logs (admin only)
- `GET /api/activity-logs/my-activity` - Get current user's activity
- `GET /api/activity-logs/stats` - Get activity statistics
- `GET /api/activity-logs/:logId` - Get specific log entry details
- `POST /api/activity-logs/cleanup` - Cleanup old logs (admin only)

**Developer Feature**:
- Exportable `logActivity()` helper function for cross-controller activity logging

---

### 3. Advanced Search & Filtering

**Global search across all platform entities with advanced filters**

Powerful search functionality to help users find what they need quickly:

- **Global Search**: Search across deals, investments, documents, and announcements simultaneously
- **Entity-Specific Search**: Dedicated search for each entity type with specialized filters
- **Advanced Filters**:
  - Deals: Filter by type, status, amount range, location
  - Investments: Filter by status, date range, amount
  - Documents: Filter by type, date, size
  - Announcements: Filter by priority, date
- **Search Suggestions**: Real-time autocomplete as you type
- **Result Grouping**: Results organized by entity type with counts
- **Highlight Matching**: Visual highlighting of search terms
- **Responsive Design**: Works seamlessly on all device sizes

**New Pages**:
- `/search` - Global search interface with filters and results

**New API Endpoints**:
- `GET /api/search` - Global search across all entities
- `GET /api/search/deals` - Search deals with advanced filters
- `GET /api/search/investments` - Search investments with filters
- `GET /api/search/documents` - Search documents with filters
- `GET /api/search/announcements` - Search announcements with filters
- `GET /api/search/suggestions` - Get search autocomplete suggestions

---

### 4. Report Generation

**Generate custom reports for investors with multiple formats**

Professional report generation system for investors and administrators:

- **6 Report Types**:
  1. **Portfolio Summary**: Complete overview of all investments, current value, and returns
  2. **Investment Performance**: Detailed performance metrics by investment
  3. **Tax Summary**: Annual tax reporting data for compliance
  4. **Transaction History**: Complete transaction log for any period
  5. **Payout History**: All payouts received with details
  6. **Deal Performance**: Performance analytics for specific deals

- **Customizable Parameters**:
  - Date range selection
  - Custom report titles
  - Format selection (PDF, Excel, CSV)
  - Filter options

- **Async Generation**: Reports generate in the background with status tracking
- **Download & Management**: Download completed reports or delete old ones
- **Expiration Dates**: Automatic cleanup of expired reports

**New Pages**:
- `/reports` - Report generation and management interface

**New API Endpoints**:
- `GET /api/reports` - Get user's reports
- `GET /api/reports/:reportId` - Get specific report details
- `GET /api/reports/templates` - Get available report templates
- `POST /api/reports/generate` - Generate new report
- `GET /api/reports/:reportId/download` - Download report file
- `DELETE /api/reports/:reportId` - Delete report

---

## 🗄️ Database Changes

### New Models

1. **UserPreference Model**
   - 20+ preference fields across 5 categories
   - One-to-one relationship with User
   - Default values for new users

2. **ActivityLog Model**
   - Comprehensive activity tracking
   - JSONB fields for flexible metadata and change tracking
   - Severity levels and categorization
   - IP address and user agent tracking

3. **Report Model**
   - Multiple report type support
   - Status tracking (pending, generating, completed, failed)
   - JSONB data field for flexible report content
   - File storage and expiration management

**Total Models**: 16 → **19**

---

## 🔧 Technical Improvements

### Backend

- **New Controllers**: 4 new controllers with 26 total endpoints
- **Async Processing**: Report generation uses non-blocking async processing
- **Helper Functions**: Exportable `logActivity()` function for cross-controller use
- **Security**: All new endpoints properly secured with JWT authentication
- **Role-Based Access**: Admin-only endpoints for sensitive operations
- **Error Handling**: Comprehensive error handling with proper status codes
- **Response Utilities**: Consistent use of `successResponse` and `errorResponse`

### Frontend

- **4 New Pages**: Settings, Activity, Search, Reports
- **Responsive Design**: All pages optimized for mobile and desktop
- **Real-Time Updates**: Live filtering and search results
- **API Client**: Updated with 4 new API modules
- **User Experience**:
  - Toast notifications for success/error messages
  - Loading states for async operations
  - Intuitive tabbed interfaces
  - Visual icons and color coding
  - Smooth transitions and animations

### API

- **Total Endpoints**: ~104 → **~130** (26 new endpoints)
- **Version Bump**: API version updated to 1.5.0
- **Backward Compatible**: All existing endpoints remain unchanged

---

## 📊 Statistics

### Before v1.5.0
- Models: 16
- Endpoints: ~104
- Frontend Pages: 18

### After v1.5.0
- Models: **19** (+3)
- Endpoints: **~130** (+26)
- Frontend Pages: **22** (+4)

---

## 🚀 Getting Started

### For Investors

1. **Customize Your Experience**: Visit `/settings` to personalize your platform experience
2. **Track Your Activity**: Check `/activity` to see your platform interactions and statistics
3. **Search Efficiently**: Use `/search` to quickly find deals, investments, and documents
4. **Generate Reports**: Create custom reports at `/reports` for your records or tax purposes

### For Administrators

1. **Monitor Platform Activity**: Use activity logs to track user actions and system events
2. **Manage Settings**: Configure global defaults for new user preferences
3. **Cleanup Tools**: Use admin endpoints to manage old activity logs and expired reports
4. **Advanced Search**: Find and manage platform content efficiently

### For Developers

1. **Activity Logging**: Import and use `logActivity()` helper function in your controllers
2. **API Client**: Use the new API modules (`userPreferenceAPI`, `activityLogAPI`, `searchAPI`, `reportAPI`)
3. **Preference System**: Leverage user preferences for feature toggles and customization
4. **Search Integration**: Utilize global search for enhanced user experience

---

## 🔐 Security Enhancements

- All new endpoints require JWT authentication
- Admin-only routes properly secured with role-based authorization
- Activity logging includes IP address and user agent tracking
- Session timeout configuration for enhanced security
- Two-factor authentication support in preferences
- Login alerts for unusual activity

---

## 📝 API Documentation

### Authentication Required

All new endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Preference Endpoints

```
GET    /api/user/preferences              # Get user preferences
GET    /api/user/preferences/defaults     # Get default preferences
PATCH  /api/user/preferences              # Update general preferences
PATCH  /api/user/preferences/notifications # Update notification settings
PATCH  /api/user/preferences/display      # Update display settings
PATCH  /api/user/preferences/privacy      # Update privacy settings
PATCH  /api/user/preferences/security     # Update security settings
PATCH  /api/user/preferences/dashboard    # Update dashboard settings
POST   /api/user/preferences/reset        # Reset to defaults
```

### Activity Log Endpoints

```
GET    /api/activity-logs                 # Get all logs (admin only)
GET    /api/activity-logs/my-activity     # Get user's activity
GET    /api/activity-logs/stats           # Get activity statistics
GET    /api/activity-logs/:logId          # Get specific log entry
POST   /api/activity-logs/cleanup         # Cleanup old logs (admin only)
```

### Search Endpoints

```
GET    /api/search                        # Global search
GET    /api/search/deals                  # Search deals
GET    /api/search/investments            # Search investments
GET    /api/search/documents              # Search documents
GET    /api/search/announcements          # Search announcements
GET    /api/search/suggestions            # Get search suggestions
```

### Report Endpoints

```
GET    /api/reports                       # Get user's reports
GET    /api/reports/:reportId             # Get report details
GET    /api/reports/templates             # Get report templates
POST   /api/reports/generate              # Generate new report
GET    /api/reports/:reportId/download    # Download report
DELETE /api/reports/:reportId             # Delete report
```

---

## 🐛 Bug Fixes

- Fixed potential memory leaks in async operations
- Improved error handling for malformed search queries
- Enhanced validation for preference updates
- Optimized database queries for large result sets

---

## 🔮 Future Enhancements

Planned for upcoming releases:

- Email notifications when reports are ready
- Saved search functionality
- Advanced report scheduling
- Export activity logs to CSV
- Real-time activity notifications
- Preference templates for common use cases
- Enhanced search with fuzzy matching
- Machine learning-based search suggestions

---

## 📚 Migration Guide

### For Existing Users

No migration required! v1.5.0 is fully backward compatible. New features are additive:

1. User preferences will be automatically created with defaults on first access
2. Activity logging starts tracking from this version forward
3. All existing functionality remains unchanged

### For Developers

Update your frontend API client imports:

```typescript
import {
  userPreferenceAPI,
  activityLogAPI,
  searchAPI,
  reportAPI
} from '@/lib/api';
```

---

## 🙏 Acknowledgments

This release represents a major milestone in the OWNLY Sandbox Platform evolution. Special thanks to all contributors and testers who helped make this release possible.

---

## 📞 Support

For questions, issues, or feedback:

- **Documentation**: See V1.5.0_SUMMARY.md for technical details
- **Platform Summary**: See PLATFORM_SUMMARY.md for complete platform overview
- **Issues**: Report bugs or request features through the appropriate channels

---

## 📅 Version History

- **v1.0.0** - Initial Release: Core Platform (Deals, Investments, SPVs)
- **v1.1.0** - Scenario Modeling & Waterfall Analysis
- **v1.2.0** - Payout System & Distribution
- **v1.3.0** - Operations & Asset Management
- **v1.4.0** - Platform Expansion & Features
- **v1.5.0** - User Experience & Utilities ← **CURRENT**

---

**OWNLY Sandbox Platform v1.5.0**
*Empowering Investors with Control and Insights*

Released: October 21, 2025
