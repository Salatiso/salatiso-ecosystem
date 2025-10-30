# PHASE 3: ADMIN GUIDE & SYSTEM CONFIGURATION

**Status**: Administrator Operations Guide  
**Audience**: System Administrators (Salatiso & Authorized Admins)  
**Version**: 1.0  
**Last Updated**: October 30, 2025

---

## 📋 TABLE OF CONTENTS

1. [Admin Panel Overview](#admin-panel-overview)
2. [User Management](#user-management)
3. [Permission Configuration](#permission-configuration)
4. [Content Management](#content-management)
5. [License Management](#license-management)
6. [Age-Based Routing](#age-based-routing)
7. [Audit & Monitoring](#audit--monitoring)
8. [System Settings](#system-settings)

---

## 🎛️ ADMIN PANEL OVERVIEW

### Accessing the Admin Panel

1. **Login to Dashboard** with administrator credentials
2. **Navigate**: Dashboard → Settings → Administration
3. **Access Level**: Only users with "administrator" role can access

### Admin Panel Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  SALATISO ADMIN PANEL                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  NAVIGATION SIDEBAR                    MAIN CONTENT AREA        │
│  ┌─────────────────────────┐         ┌─────────────────────┐  │
│  │ 📊 Dashboard            │         │                     │  │
│  │ 👥 User Management      │ ────→   │ DASHBOARD           │  │
│  │ 🔐 Permissions          │         │ System Overview     │  │
│  │ 📚 Content Management   │         │ Quick Stats         │  │
│  │ 🎫 License Management   │         │ Recent Activities   │  │
│  │ 🎯 Age-Based Routing    │         │                     │  │
│  │ 📋 Audit Logs           │         └─────────────────────┘  │
│  │ ⚙️  Settings            │                                    │
│  │ 📞 Support              │                                    │
│  │                         │                                    │
│  └─────────────────────────┘                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Dashboard Quick Stats

**Default Dashboard View**:
- Total Active Users: Live count
- User Distribution: By role (Family: %, Child: %, License: %)
- Content Accessed: Top 10 most viewed items
- System Health: API response times, storage usage
- Recent Audits: Last 10 admin actions
- Alerts: Permission misconfigurations, expired licenses

---

## 👥 USER MANAGEMENT

### User List View

Navigate to: **Administration → User Management**

#### Features:
- Search by name, email, phone
- Filter by role (Family, Child, License, Administrator)
- Filter by status (Active, Inactive, Suspended, Pending)
- Sort by: Name, Date Created, Last Active
- Bulk actions: Enable/Disable, Change Role, Export

#### User Card Components:

```
┌──────────────────────────────────────────────┐
│ User: John Doe                    [Active]   │
├──────────────────────────────────────────────┤
│ Email: john@example.com                      │
│ Phone: +27 12 345 6789                       │
│ Role: Family Member                          │
│ Status: Active                               │
│ Created: 2025-10-15                          │
│ Last Active: 2 hours ago                     │
│ Children Associated: 2                       │
│                                              │
│ [View] [Edit] [Suspend] [Delete] [More]     │
└──────────────────────────────────────────────┘
```

### User Detail Editor

#### Basic Information
```typescript
interface UserDetails {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  profilePhoto?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
}
```

**Edit Steps**:

1. **Click "Edit" on user card**
2. **Modify Fields**:
   - Name (required)
   - Email (required, must be unique)
   - Phone (optional)
   - Date of Birth (auto-calculates age)
   - Profile photo (optional)
   - Status (dropdown)

3. **Save Changes**
   - Confirmation dialog displayed
   - Changes logged in audit trail
   - User notified of changes (if email changed)

### Role Assignment

#### Process:

1. **Open User Detail**
2. **Scroll to "Role Management"**
3. **Select Role**:

```
┌─ Role Assignment ──────────────────────────┐
│                                            │
│ Current Role: Family Member                │
│                                            │
│ ○ Family Member (Full access)              │
│ ○ Child (Age-gated content)                │
│ ○ License User (Licensed features)         │
│ ○ Administrator (Full system access)       │
│                                            │
│ [View Details] [Preview Access]            │
│                                            │
│ Effective Date: [2025-10-30] ▼             │
│ Expiration Date: [Never] ▼                 │
│                                            │
│ [Cancel] [Update]                          │
└────────────────────────────────────────────┘
```

4. **Set Effective Dates**
   - When role becomes active
   - When role expires (optional)

5. **Preview Access**
   - See what content/features user will access
   - Review permissions before confirming

6. **Confirm & Save**
   - Logged in audit trail
   - User receives email notification

### Family Relationships

**For Family Accounts**:

```
┌─ Family Management ────────────────────────┐
│                                            │
│ Account Owner: John Doe                    │
│ Relationship: Family Head                  │
│                                            │
│ Associated Children:                       │
│ ┌─────────────────────────────────────────┤
│ │ 1. Jane Doe (Age 12)                    │
│ │    Status: Active                       │
│ │    Age Gate: Kids Content               │
│ │    [View] [Edit] [Remove]               │
│ │                                         │
│ │ 2. Bob Doe (Age 8)                      │
│ │    Status: Active                       │
│ │    Age Gate: Kids Content               │
│ │    [View] [Edit] [Remove]               │
│ │                                         │
│ └─────────────────────────────────────────┤
│                                            │
│ [+ Add Child] [Manage Access] [View All]   │
│                                            │
└────────────────────────────────────────────┘
```

#### Add Child to Family:

1. **Click "[+ Add Child]"**
2. **Enter Child Information**:
   - First Name (required)
   - Last Name (required)
   - Date of Birth (required - for age calculation)
   - Email (optional, for future login)
   - Photo (optional)

3. **Configure Access**:
   - Auto-routed based on age
   - Override age gate if needed
   - Select content categories

4. **Save**
   - Child account created
   - Automatic age-based routing activated

---

## 🔐 PERMISSION CONFIGURATION

Navigate to: **Administration → Permissions**

### Permission Matrix View

```
Permissions Overview:
┌────────────────────────────────────────────────────────┐
│ Module | View | Create | Edit | Delete | Approve      │
├────────────────────────────────────────────────────────┤
│ Gov    │ All  │ Admin  │ Self │ Admin  │ Admin        │
│ HR     │ Own  │ Admin  │ Self │ Admin  │ HR Manager   │
│ Ops    │ Own  │ Self   │ Self │ Self   │ Lead         │
│ Fin    │ Own  │ No     │ No   │ No     │ No           │
│ Mkting │ All  │ Own    │ Own  │ No     │ Lead         │
└────────────────────────────────────────────────────────┘
```

### Default Permissions by Role

#### Family Member
```json
{
  "role": "family",
  "permissions": [
    "view:all_family_content",
    "view:family_dashboard",
    "view:children_profiles",
    "edit:own_profile",
    "edit:family_settings",
    "manage:children_access",
    "approve:children_requests"
  ]
}
```

#### Child
```json
{
  "role": "child",
  "permissions": [
    "view:kids_content",
    "view:age_appropriate_features",
    "edit:own_profile",
    "request:parental_approval"
  ]
}
```

#### License User
```json
{
  "role": "license",
  "permissions": [
    "view:licensed_features",
    "view:license_scope_content",
    "edit:own_profile",
    "request:feature_access"
  ]
}
```

#### Administrator
```json
{
  "role": "administrator",
  "permissions": [
    "manage:all_users",
    "manage:roles",
    "manage:permissions",
    "manage:content",
    "manage:licenses",
    "view:audit_logs",
    "configure:system_settings"
  ]
}
```

### Customize Role Permissions

#### Process:

1. **Navigate to**: **Administration → Permissions**
2. **Select Role**: Click on role name
3. **View Current Permissions**: List of all permissions granted
4. **Modify Permissions**:

```
┌─ Edit Family Member Permissions ──────────┐
│                                            │
│ General Access:                            │
│ ☑ view:all_family_content                 │
│ ☑ view:family_dashboard                   │
│ ☑ view:children_profiles                  │
│ ☑ edit:own_profile                        │
│ ☐ view:financial_reports (disabled)       │
│                                            │
│ Children Management:                       │
│ ☑ manage:children_access                  │
│ ☑ approve:children_requests               │
│ ☐ suspend:children_account                │
│ ☐ delete:children_account                 │
│                                            │
│ Content Restrictions:                      │
│ ☐ Create: ○ Disabled ● Enabled            │
│ ☐ Edit:   ○ Disabled ● Enabled            │
│ ☐ Delete: ○ Disabled ● Enabled            │
│                                            │
│ [Preview Changes] [Reset] [Save]           │
│                                            │
└────────────────────────────────────────────┘
```

5. **Preview Changes**: See what users will be able to do
6. **Save**: Confirm and apply changes
7. **Audit Log Entry**: Change recorded automatically

#### Permission Categories:

**Module Access**:
- Governance (view, create, edit, delete, approve)
- Human Capital (view, create, edit, delete, approve)
- Operations (view, create, edit, delete, approve)
- Finance (view, export, view_reports)
- Marketing (view, create, edit, publish)
- Reporting (view, export, schedule)

**Data Scope**:
- `all`: All data in system
- `own`: Only user's own data
- `own_family`: Own family's data
- `own_organization`: Own organization's data

**Field-Level Restrictions**:
- Budget fields: Only admin/finance
- Personal data: Only authorized users
- System configuration: Only super-admin

---

## 📚 CONTENT MANAGEMENT

Navigate to: **Administration → Content Management**

### Content Categories

#### View All Categories:

```
┌─ Content Categories ─────────────────────────┐
│                                              │
│ Adult Content (Age: 18+)                     │
│ ├─ Business Books                           │
│ ├─ Advanced Finance                         │
│ └─ [View Items] [Edit] [Delete]             │
│                                              │
│ Teen Content (Age: 13-17)                    │
│ ├─ Educational Videos                       │
│ ├─ Teen News                                │
│ └─ [View Items] [Edit] [Delete]             │
│                                              │
│ Kids Content (Age: 6-12)                     │
│ ├─ Learning Games                           │
│ ├─ Fairy Tales                              │
│ └─ [View Items] [Edit] [Delete]             │
│                                              │
│ [+ New Category]                             │
│                                              │
└──────────────────────────────────────────────┘
```

#### Create New Category:

1. **Click "[+ New Category]"**
2. **Fill in Details**:

```
Category Name: [_______________]
Description: [________________]
Minimum Age: [18] ▼
Maximum Age: [99] ▼
Visibility: 
  ○ Public (All users)
  ○ Family (Family members only)
  ○ License (Licensed users only)
  ○ Admin (Admin only)

Required User Types:
  ☑ Family
  ☑ Child
  ☐ License
  ☐ Admin

Content Items: [Import from file] [+ Add Item]

[Cancel] [Create]
```

3. **Save**: Category created and available for content assignment

### Age Gate Configuration

#### Set Age Gating Rules:

```
┌─ Age Gate Configuration ─────────────────────┐
│                                              │
│ Category: Kids Content                       │
│                                              │
│ Age Restrictions:                            │
│ Minimum Age: [6] years                       │
│ Maximum Age: [12] years                      │
│                                              │
│ Behavior:                                    │
│ ☑ Automatically redirect if outside range   │
│ ☑ Request parental override                 │
│ ☑ Show age verification dialog              │
│                                              │
│ Fallback Content:                            │
│ Redirect to: [Kids Home] ▼                   │
│ Show Message: [Custom message field]         │
│                                              │
│ [Test Configuration] [Save]                  │
│                                              │
└──────────────────────────────────────────────┘
```

#### Configuration Options:

**Auto-Redirect**: If enabled, automatically redirects users outside age range
**Parental Override**: Allow family head to override age gate
**Messaging**: Custom message when redirecting
**Logging**: Track age gate denials for analytics

### Content Visibility Settings

#### For Each Content Item:

```
Content: "Advanced Financial Planning"

Visibility Rules:
┌─────────────────────────────────────────┐
│ Visible to:                             │
│ ☑ Family Members (Age: Any)             │
│ ☐ Children (Age: 18+ override req.)     │
│ ☑ License Users (License: Premium+)     │
│ ☑ Administrators (Any)                  │
│                                         │
│ Restrictions:                           │
│ ○ No restrictions                       │
│ ○ Require parental consent              │
│ ○ Require license subscription          │
│ ○ Custom: ________________              │
│                                         │
│ Schedule (Optional):                    │
│ Start Date: [2025-11-01]                │
│ End Date: [2025-12-31]                  │
│ Always Available: ☐                     │
│                                         │
│ [Preview] [Save]                        │
└─────────────────────────────────────────┘
```

---

## 🎫 LICENSE MANAGEMENT

Navigate to: **Administration → License Management**

### License Types

```
┌─ License Configuration ────────────────────┐
│                                            │
│ Basic License                              │
│ ├─ Price: R50/month                       │
│ ├─ Features: [Limit: 5 items]             │
│ ├─ Users: Unlimited                       │
│ ├─ Active: 150 users                      │
│ └─ [Manage] [View Features] [Analytics]   │
│                                            │
│ Professional License                       │
│ ├─ Price: R150/month                      │
│ ├─ Features: [Limit: 50 items]            │
│ ├─ Users: Unlimited                       │
│ ├─ Active: 450 users                      │
│ └─ [Manage] [View Features] [Analytics]   │
│                                            │
│ Enterprise License                         │
│ ├─ Price: Custom                          │
│ ├─ Features: [Unlimited]                  │
│ ├─ Users: Unlimited                       │
│ ├─ Active: 50 organizations               │
│ └─ [Manage] [View Features] [Analytics]   │
│                                            │
│ [+ New License Type]                       │
│                                            │
└────────────────────────────────────────────┘
```

### Assign License to User

#### Process:

1. **Go to User Profile**
2. **Scroll to "License Assignment"**
3. **Click "[+ Assign License]"**

```
┌─ Assign License ──────────────────────────┐
│                                            │
│ User: John Doe                             │
│ Current License: None                      │
│                                            │
│ Select License Type:                       │
│ ○ Basic (R50/month) - Limited features    │
│ ○ Professional (R150/month) - Most use    │
│ ○ Enterprise (Custom) - Full access       │
│                                            │
│ License Details:                           │
│ Start Date: [2025-10-30]                   │
│ End Date: [2026-10-30] ▼ (Auto-renew)    │
│ Quantity: [1] (seats)                     │
│ Auto-Renew: ☑                             │
│ Payment Status: [Pending] ▼                │
│                                            │
│ [Assign] [Cancel]                          │
│                                            │
└────────────────────────────────────────────┘
```

4. **Confirm Assignment**: License becomes active immediately

### Monitor License Expiry

#### Expiry Dashboard:

```
┌─ License Expiry Monitor ─────────────────┐
│                                          │
│ Expiring in 30 days:                     │
│ ├─ John Doe - Professional - 25 days   │
│ ├─ Jane Smith - Basic - 18 days        │
│ └─ [Send Renewal Reminder] [Extend]    │
│                                          │
│ Expired (Action Required):               │
│ ├─ Bob Johnson - Enterprise - 15 days  │
│ ├─ Mary Wilson - Professional - 30 days│
│ └─ [Send Reminder] [Auto-Renew]        │
│                                          │
│ [Export List] [Configure Alerts]         │
│                                          │
└──────────────────────────────────────────┘
```

#### Auto-Renewal Configuration:

1. **Enable Auto-Renewal**: 
   - On assignment (when creating license)
   - Or edit existing license

2. **Set Renewal Rules**:
   - Send reminder: 30 days before expiry
   - Auto-charge on expiry date
   - Cancel license if payment fails
   - Notify user before cancellation

3. **Payment Processing**:
   - Use stored payment method
   - Log all transactions
   - Generate invoices

---

## 🎯 AGE-BASED ROUTING

Navigate to: **Administration → Age-Based Routing**

### Age Band Configuration

```
┌─ Age Band Settings ────────────────────────┐
│                                            │
│ Age Band 1: 0-5 Years (Toddlers)          │
│ ├─ Route to: Kids Home                    │
│ ├─ Content Categories: [Kids Content]     │
│ ├─ Features Available: 5/50                │
│ └─ [Edit] [Preview] [Test]                │
│                                            │
│ Age Band 2: 6-12 Years (Children)         │
│ ├─ Route to: Kids Dashboard               │
│ ├─ Content Categories: [Kids Content]     │
│ ├─ Features Available: 15/50               │
│ └─ [Edit] [Preview] [Test]                │
│                                            │
│ Age Band 3: 13-17 Years (Teens)           │
│ ├─ Route to: Teen Portal                  │
│ ├─ Content Categories: [Teen Content]     │
│ ├─ Features Available: 35/50               │
│ └─ [Edit] [Preview] [Test]                │
│                                            │
│ Age Band 4: 18+ Years (Adults)            │
│ ├─ Route to: Main Dashboard               │
│ ├─ Content Categories: [All]              │
│ ├─ Features Available: 50/50               │
│ └─ [Edit] [Preview] [Test]                │
│                                            │
│ [+ Add Custom Band] [Reset to Defaults]   │
│                                            │
└────────────────────────────────────────────┘
```

### Edit Age Band

```
┌─ Edit Age Band: Children (6-12) ──────────┐
│                                            │
│ Band Name: [Children]                     │
│ Minimum Age: [6]                          │
│ Maximum Age: [12]                         │
│                                            │
│ Routing Configuration:                    │
│ Landing Page: [Kids Dashboard] ▼          │
│                                            │
│ Available Content Categories:              │
│ ☑ Kids Content (Safe, age-appropriate)   │
│ ☐ Teen Content (Restricted)              │
│ ☐ Adult Content (Blocked)                │
│                                            │
│ Feature Restrictions:                     │
│ Browsing: ☑ Limited to 2 hours/day       │
│ Messaging: ☑ Enabled (parents filter)    │
│ Download: ☐ Disabled                     │
│ Export: ☐ Disabled                       │
│                                            │
│ Parental Override:                        │
│ ☑ Allow parent to bypass age gate        │
│ ☑ Require explicit approval              │
│ ☑ Log all overrides                      │
│                                            │
│ [Test Configuration] [Cancel] [Save]     │
│                                            │
└────────────────────────────────────────────┘
```

### Test Age-Based Routing

**Preview As Different Ages**:

1. **Click "[Test Configuration]"**
2. **Select Test Age**: 
   - Exact age: [8]
   - Or select band: [Children (6-12)]

3. **Preview Experience**:
   - See what content displays
   - Check feature availability
   - Verify routing destination
   - Test redirects

---

## 📋 AUDIT & MONITORING

Navigate to: **Administration → Audit Logs**

### View Audit Logs

```
┌─ Audit Log Viewer ────────────────────────┐
│                                            │
│ Filter & Search:                           │
│ User: [________] Date: [From-To] Search   │
│ Action Type: [All] Admin: [All]           │
│                                            │
│ Recent Audit Trail:                        │
│ ├─ Oct 30, 14:23 | Salatiso              │
│ │  Action: User Role Changed              │
│ │  Target: John Doe                       │
│ │  Old: Child → New: Family               │
│ │  [View Details]                         │
│ │                                         │
│ ├─ Oct 30, 13:45 | Salatiso              │
│ │  Action: License Assigned               │
│ │  Target: Jane Smith                     │
│ │  Details: Professional, 12-month       │
│ │  [View Details]                         │
│ │                                         │
│ ├─ Oct 30, 12:10 | Admin User            │
│ │  Action: Content Category Created       │
│ │  Name: Teen Educational                 │
│ │  [View Details]                         │
│ │                                         │
│ [Export as CSV] [Print] [Archive]         │
│                                            │
└────────────────────────────────────────────┘
```

#### Audit Entry Details:

```
Action: User Role Changed
Timestamp: 2025-10-30 14:23:45 UTC
Performed By: Salatiso (salatiso@mni.co.za)
IP Address: 102.140.50.123
User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)

Target: John Doe (ID: user_12345)
Action Type: role_update
Status: Success

Changes:
- Field: role
  Old Value: child
  New Value: family
  
- Field: effective_date
  Old Value: None
  New Value: 2025-10-30

Reason: User age verification completed

Notes: User can now manage family content
```

### Monitor Admin Actions

**Track**: All admin actions are logged
- User management changes
- Permission modifications
- License assignments
- Content updates
- System configuration changes

**Retention**: 2 years of audit logs maintained

**Alert**: Unusual patterns flagged (e.g., mass user deletions)

---

## ⚙️ SYSTEM SETTINGS

Navigate to: **Administration → Settings**

### General Settings

```
┌─ System Settings ─────────────────────────┐
│                                            │
│ System Name: [Salatiso MNI]               │
│ Organization: [Salatiso Ltd.]             │
│ Support Email: [admin@mni.co.za]          │
│ Support Phone: [+27 12 345 6789]          │
│                                            │
│ Timezone: [Africa/Johannesburg] ▼         │
│ Default Language: [English] ▼              │
│ Currency: [ZAR] ▼                         │
│                                            │
│ [Save Changes]                             │
│                                            │
└────────────────────────────────────────────┘
```

### Security Settings

```
┌─ Security Configuration ──────────────────┐
│                                            │
│ Password Policy:                           │
│ Minimum Length: [12] characters           │
│ Require Uppercase: ☑                      │
│ Require Numbers: ☑                        │
│ Require Special Characters: ☑             │
│ Expiry: [90] days                         │
│                                            │
│ 2-Factor Authentication:                  │
│ Require for Admins: ☑                     │
│ Require for Users: ☐                      │
│                                            │
│ Session Timeout:                          │
│ Duration: [30] minutes                    │
│ Warn Before Logout: ☑                     │
│                                            │
│ [Save Changes]                             │
│                                            │
└────────────────────────────────────────────┘
```

### Notification Settings

```
┌─ Notification Configuration ──────────────┐
│                                            │
│ Email Notifications:                       │
│ ☑ User Registration                       │
│ ☑ License Expiry (30 days before)        │
│ ☑ System Alerts                           │
│ ☑ Admin Actions (to admins)              │
│                                            │
│ Frequency:                                 │
│ Digest Frequency: [Daily] ▼               │
│ Best Time to Send: [09:00 AM] ▼           │
│                                            │
│ SMS Notifications (Optional):              │
│ ☐ Enable SMS                              │
│ ☐ Critical Alerts Only                   │
│                                            │
│ [Save Changes]                             │
│                                            │
└────────────────────────────────────────────┘
```

### Backup & Recovery

```
┌─ Backup Settings ─────────────────────────┐
│                                            │
│ Last Backup: 2025-10-30 02:00 UTC        │
│ Backup Frequency: Daily at 2:00 AM       │
│ Retention: [30] days                     │
│                                            │
│ [Backup Now] [View Backups] [Restore]    │
│                                            │
│ Automated Backup Status: ✓ Enabled       │
│                                            │
└────────────────────────────────────────────┘
```

---

## 📞 COMMON ADMIN TASKS

### Task 1: Onboard New User as Administrator

**Steps**:
1. Navigate to User Management
2. Click "[+ Add User]"
3. Enter: Name, Email, Phone
4. Select Role: Administrator
5. Set Permissions: "All" (recommended)
6. Click "Send Invitation"
7. New admin receives email with setup link

### Task 2: Configure Age-Based Content for New Category

**Steps**:
1. Navigate to Content Management
2. Click "[+ New Category]"
3. Enter: Name, Age Range (e.g., 13-17)
4. Set Visibility: "Family" or "Public"
5. Click "Create"
6. Add content items to category
7. Test with "[Preview]" button

### Task 3: Extend User's License Before Expiry

**Steps**:
1. Navigate to License Management
2. Find user with expiring license
3. Click "[Extend]"
4. Select new end date
5. Confirm payment method
6. Click "Extend License"
7. Confirmation email sent to user

### Task 4: Investigate Failed Login Attempts

**Steps**:
1. Navigate to Audit Logs
2. Filter by: Action Type = "Login", Status = "Failed"
3. View details of failed attempts
4. Check IP addresses and timestamps
5. Look for patterns (brute force)
6. If suspicious: Suspend account temporarily
7. Contact user to verify

### Task 5: Generate Monthly Report

**Steps**:
1. Navigate to Reports section
2. Select Report Type: "Monthly Summary"
3. Select Month: [October 2025]
4. Choose Format: PDF or Excel
5. Click "Generate"
6. Download file
7. Share with stakeholders

---

## ⚠️ TROUBLESHOOTING

### Issue: User Can't Access Content After Role Change

**Diagnosis**:
1. Check user's current role in User Management
2. View user's assigned permissions
3. Verify content category age gating
4. Check license validity (if applicable)

**Resolution**:
1. Clear user's browser cache
2. Have user log out and log back in
3. Verify permissions match role
4. Check age gate configuration

### Issue: License Not Activating

**Diagnosis**:
1. Check license status in License Management
2. Verify payment was processed
3. Check start date (shouldn't be in future)
4. Verify license type covers requested feature

**Resolution**:
1. In License Management, click "[Activate]"
2. Or create new license with immediate start
3. Verify payment method
4. Contact support if persists

### Issue: Audit Log Entry Missing

**Diagnosis**:
1. Check date range in filter
2. Try broader search terms
3. Check if action was in different admin panel

**Resolution**:
1. Expand date range
2. Try searching by user email
3. Check backup logs (if deleted)
4. Contact system administrator

---

## 📊 ADMIN DASHBOARD METRICS

**Key Metrics to Monitor**:

1. **User Metrics**:
   - Total active users
   - New users this month
   - Churn rate
   - User distribution by role

2. **License Metrics**:
   - Active licenses
   - Expiring soon (< 30 days)
   - Revenue (if applicable)
   - License utilization

3. **Content Metrics**:
   - Total content items
   - Most accessed content
   - Age gate triggers/day
   - Content by category

4. **System Health**:
   - API response time
   - Database size
   - Storage utilization
   - Failed authentication attempts

---

**Last Updated**: October 30, 2025  
**Next Review**: November 30, 2025  
**Version**: 1.0
