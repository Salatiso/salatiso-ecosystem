/**
 * Salatiso Chatbot Knowledge Base Articles
 * 
 * This file contains the knowledge base articles for the Salatiso chatbot system.
 * These articles will be populated into the Firestore `chatbot_knowledge_base` collection.
 * 
 * To import these articles:
 * 1. Run this script in Firebase Functions or a dedicated import utility
 * 2. Or manually add them via Firebase Console
 * 
 * Categories:
 * - onboarding: Getting started with Salatiso
 * - account: Account management and settings
 * - features: Feature-specific help
 * - kids: Content for children and young users
 * - admin: Administrator documentation
 * - security: Security and privacy information
 */

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  content: string;
  keywords: string[];
  relatedArticles?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lastUpdated: Date;
  views?: number;
  helpful?: number;
  notHelpful?: number;
}

export const KNOWLEDGE_BASE_ARTICLES: KnowledgeBaseArticle[] = [
  // Onboarding Articles
  {
    id: 'kb-001',
    title: 'Welcome to Salatiso - Getting Started',
    category: 'onboarding',
    content: `Welcome to Salatiso! This comprehensive platform is designed to help you manage your professional life with ease.

Getting Started:
1. Create your account using your email address
2. Set up your profile with your professional information
3. Import your existing contacts
4. Customize your settings and preferences
5. Start exploring the dashboard

Key Features:
- Contact Management: Organize and track all your professional contacts
- Activity Feed: Monitor all changes and activities in your account
- Training Hub: Access learning resources and courses
- Calendar Integration: Schedule and manage your meetings
- Professional Profiles: Build and maintain your professional network

Next Steps:
- Complete your profile setup
- Upload a profile picture
- Invite team members if applicable
- Explore the training hub

For more help, check out our FAQ or contact our support team.`,
    keywords: [
      'getting started',
      'welcome',
      'first steps',
      'setup',
      'onboarding',
      'account creation',
    ],
    difficulty: 'beginner',
    lastUpdated: new Date('2025-10-30'),
  },

  {
    id: 'kb-002',
    title: 'Creating Your Profile',
    category: 'onboarding',
    content: `Your Salatiso profile is your professional identity on the platform. Here's how to create and optimize it:

Step-by-Step:
1. Go to Profile Settings from the main menu
2. Click "Edit Profile"
3. Fill in your professional information:
   - Full name
   - Email address
   - Phone number
   - Professional title
   - Company/Organization
   - Bio (up to 500 characters)
   - Location

Adding a Profile Picture:
1. Click on the profile picture area
2. Select an image from your computer
3. Adjust and crop as needed
4. Click "Save"

Professional Information Tips:
- Use a clear, professional photo
- Write a compelling bio that highlights your expertise
- Include relevant contact information
- Keep information current and accurate
- Add links to your professional website or social profiles

Your profile helps other users identify and connect with you on the platform.`,
    keywords: ['profile', 'setup', 'picture', 'information', 'bio', 'professional'],
    difficulty: 'beginner',
    lastUpdated: new Date('2025-10-30'),
  },

  {
    id: 'kb-003',
    title: 'Importing Your First Contacts',
    category: 'onboarding',
    content: `Easily import your existing contacts into Salatiso. We support multiple import formats.

Supported Formats:
- CSV (Comma-Separated Values)
- Excel (.xlsx)
- vCard (.vcf)
- Google Contacts export

Steps to Import:
1. Navigate to Contacts > Import Contacts
2. Select "Choose File" and pick your contact file
3. Review the preview of your contacts
4. Map columns if needed:
   - First Name
   - Last Name
   - Email
   - Phone
   - Company
   - Job Title
   - Address
5. Click "Import"

Tips for Successful Import:
- Ensure your file has headers in the first row
- Use consistent date formats
- Remove duplicate entries before importing
- Test with a small batch first
- Check for special characters that might cause issues

After Import:
- Review imported contacts for accuracy
- Organize contacts into categories
- Update any missing information
- Set up custom fields as needed

Having issues? Check our contact import troubleshooting guide.`,
    keywords: [
      'import',
      'contacts',
      'csv',
      'excel',
      'bulk import',
      'upload',
      'first contacts',
    ],
    difficulty: 'beginner',
    lastUpdated: new Date('2025-10-30'),
  },

  // Account & Settings Articles
  {
    id: 'kb-004',
    title: 'Managing Your Account Settings',
    category: 'account',
    content: `Customize your Salatiso experience with comprehensive account settings.

Access Settings:
1. Click your profile icon in the top-right corner
2. Select "Settings"
3. Choose the setting category you want to modify

Available Settings:

Profile Settings:
- Edit personal information
- Change profile picture
- Update privacy settings
- Manage visibility

Security Settings:
- Change password
- Enable two-factor authentication
- View active sessions
- Manage connected devices
- Review login history

Email Preferences:
- Notification settings
- Digest frequency
- Activity alerts
- Marketing communications

Privacy Settings:
- Profile visibility (public/private)
- Contact visibility
- Activity visibility
- Data sharing preferences

Notifications:
- Email notifications
- In-app notifications
- Push notifications (mobile)
- Customize notification types

Language & Regional:
- Change language
- Set time zone
- Date format preferences
- Currency settings

Regularly review and update your settings to ensure they match your preferences.`,
    keywords: ['settings', 'account', 'preferences', 'configuration', 'security'],
    difficulty: 'beginner',
    lastUpdated: new Date('2025-10-30'),
  },

  {
    id: 'kb-005',
    title: 'Password Security and Recovery',
    category: 'account',
    content: `Protect your Salatiso account with a strong password and recovery options.

Creating a Strong Password:
- Use at least 12 characters
- Include uppercase letters (A-Z)
- Include lowercase letters (a-z)
- Include numbers (0-9)
- Include special characters (!@#$%^&*)
- Avoid common words or patterns
- Don't reuse passwords from other accounts
- Update password every 90 days

Changing Your Password:
1. Go to Settings > Security
2. Click "Change Password"
3. Enter your current password
4. Create your new password
5. Confirm the new password
6. Click "Update Password"

Two-Factor Authentication (2FA):
1. Go to Settings > Security
2. Enable "Two-Factor Authentication"
3. Choose your method (SMS or authenticator app)
4. Follow the verification steps
5. Save backup codes in a safe place

Password Recovery:
If you forget your password:
1. Click "Forgot Password?" on the login page
2. Enter your email address
3. Check your email for a reset link
4. Click the link and create a new password
5. Log in with your new password

Keep your recovery email updated in your account settings.`,
    keywords: ['password', 'security', 'recovery', '2fa', 'two-factor', 'authentication'],
    difficulty: 'beginner',
    lastUpdated: new Date('2025-10-30'),
  },

  // Feature Articles
  {
    id: 'kb-006',
    title: 'Contact Management: Organization and Categorization',
    category: 'features',
    subcategory: 'contacts',
    content: `Learn how to organize and categorize your contacts efficiently.

Creating Contact Categories:
1. Go to Contacts > Categories
2. Click "Create New Category"
3. Enter category name (e.g., "Clients", "Team", "Vendors")
4. Optional: Add description
5. Choose a color for easy identification
6. Click "Save"

Assigning Contacts to Categories:
Method 1 (Individual):
1. Open contact details
2. Click "Categories"
3. Select or create category
4. Click "Save"

Method 2 (Bulk):
1. Select multiple contacts
2. Right-click > "Assign Category"
3. Choose category
4. Click "Apply"

Organizing Contacts:
- Use meaningful category names
- One contact can belong to multiple categories
- Create sub-categories for complex organizations
- Use filters to view specific categories
- Archive old contacts regularly

Filtering and Searching:
- Filter by category
- Search by name, email, or phone
- Save custom filters for quick access
- Use advanced search for complex queries

Best Practices:
- Keep categories to a manageable number (5-10)
- Review and update categories quarterly
- Archive inactive contacts
- Use consistent naming conventions
- Regularly backup your contact list`,
    keywords: [
      'contacts',
      'categories',
      'organization',
      'filtering',
      'management',
      'bulk',
    ],
    difficulty: 'beginner',
    lastUpdated: new Date('2025-10-30'),
  },

  {
    id: 'kb-007',
    title: 'Activity Feed: Tracking Changes',
    category: 'features',
    subcategory: 'dashboard',
    content: `The Activity Feed keeps you informed about all changes in your Salatiso account.

Understanding the Activity Feed:
The Activity Feed displays:
- Profile updates
- Contact additions/modifications
- Group changes
- Permission updates
- Login activities
- File uploads
- Calendar events
- System notifications

Activity Types:
- User Actions: Changes you made
- Contact Updates: Modifications to contacts
- Group Activities: Team-related changes
- System Events: Automatic or admin actions
- Security Events: Login attempts, password changes

Filtering Activity:
1. Click "Filter" in the Activity Feed
2. Select activity types to display
3. Choose date range
4. Select specific categories
5. Click "Apply"

Searching Activity:
- Search by contact name
- Search by action type
- Search by date
- Search by user (if multi-user account)

Exporting Activity:
1. Click the export button
2. Choose format (CSV or PDF)
3. Select date range
4. Click "Export"

Activity Retention:
- Activities are kept for 90 days by default
- Premium users can access 1-year history
- Archive important activities manually

Using Activity for Compliance:
- Track all changes for audit purposes
- Monitor team activities
- Verify data modifications
- Keep records for compliance requirements`,
    keywords: [
      'activity',
      'feed',
      'tracking',
      'changes',
      'history',
      'logging',
      'audit',
    ],
    difficulty: 'beginner',
    lastUpdated: new Date('2025-10-30'),
  },

  {
    id: 'kb-008',
    title: 'Using the Training Hub',
    category: 'features',
    subcategory: 'learning',
    content: `Access learning resources and training materials to maximize your Salatiso skills.

Accessing Training Hub:
1. Click "Training Hub" in the main menu
2. Browse available courses and materials
3. Filter by topic or difficulty level
4. Click on a course to view details

Course Types:
- Beginner Courses: Introduction to Salatiso
- Advanced Courses: Deep-dive into features
- Video Tutorials: Step-by-step visual guides
- Documentation: Complete reference materials
- Webinars: Live training sessions (scheduled)
- Certification Programs: Formal training paths

Starting a Course:
1. Click "Enroll" or "Start"
2. Review course outline
3. Complete lessons in order
4. Take quizzes to assess understanding
5. Receive completion certificate

Tracking Progress:
- View completion percentage
- Bookmark important lessons
- Take notes during courses
- Download certificates
- Share achievements

Recommended Learning Paths:
- New User Path: 4 hours (beginner fundamentals)
- Advanced User Path: 8 hours (intermediate skills)
- Professional Path: 12 hours (advanced features)
- Administrator Path: 16 hours (management and security)

Getting Certified:
- Complete required courses
- Pass final assessment
- Receive digital certificate
- Add to professional profile
- Share on social media

All training materials are available on-demand for self-paced learning.`,
    keywords: [
      'training',
      'learning',
      'courses',
      'education',
      'certification',
      'tutorials',
      'webinar',
    ],
    difficulty: 'beginner',
    lastUpdated: new Date('2025-10-30'),
  },

  {
    id: 'kb-009',
    title: 'Calendar Integration and Scheduling',
    category: 'features',
    subcategory: 'calendar',
    content: `Manage your schedule and sync with your calendar system.

Accessing Calendar:
1. Click "Calendar" in the main navigation
2. Choose view: Day, Week, Month, or Agenda
3. Navigate using arrows or date picker

Creating Events:
1. Click on a date/time slot
2. Enter event title
3. Set start and end times
4. Add location (optional)
5. Add attendees
6. Add description
7. Set reminders
8. Click "Save"

Calendar Sync:
- Sync with Google Calendar
- Sync with Outlook Calendar
- Sync with iCal
- Two-way synchronization
- Automatic updates

Setting Reminders:
- Email reminder (before event)
- In-app notification
- Mobile push notification
- Customize reminder timing

Calendar Views:
- Day view: Detailed hourly view
- Week view: 7-day overview
- Month view: Full month overview
- Agenda view: List of upcoming events

Sharing Calendar:
1. Go to Calendar Settings
2. Click "Share Calendar"
3. Enter email addresses
4. Set permissions (view/edit)
5. Send invitation

Recurring Events:
1. Create event as normal
2. Click "Repeat"
3. Choose frequency (daily/weekly/monthly)
4. Set end date or occurrence count
5. Save

Best Practices:
- Use consistent naming conventions
- Color-code event types
- Set appropriate reminders
- Keep calendar up-to-date
- Review and plan weekly`,
    keywords: [
      'calendar',
      'scheduling',
      'events',
      'meetings',
      'reminders',
      'sync',
      'timezone',
    ],
    difficulty: 'beginner',
    lastUpdated: new Date('2025-10-30'),
  },

  // Kids & Age-Specific Articles
  {
    id: 'kb-010',
    title: 'Creating a Safe Salatiso Experience for Kids',
    category: 'kids',
    content: `Guide for parents: Setting up a safe and age-appropriate Salatiso experience for children.

Age-Appropriate Features:
- Kids (6-12): Simplified interface, limited access, parental controls
- Teens (13-17): More features, privacy controls, activity monitoring
- Adults (18+): Full feature access, independent control

Parental Controls:
1. Go to Account > Family Settings
2. Click "Add Child"
3. Create child account
4. Set age/grade level
5. Choose content restrictions
6. Approve contacts
7. Set usage limits
8. Enable monitoring

Content Filters:
- Age-appropriate content only
- Block adult materials automatically
- Parent approval for new features
- Restricted contact list
- Limited external links

Activity Monitoring:
- View child's activity feed
- Monitor contacts
- Track login times
- Review messages (privacy settings)
- Set daily usage limits

Safety Settings:
- No direct messaging with strangers
- Verified contacts only
- Restricted download capabilities
- No personal information sharing
- Profile set to private

Communication:
- Weekly activity summaries for parents
- Alerts for unusual activity
- Safe messaging between family members
- Parent-child chat feature
- Activity reports

Teaching Responsible Use:
- Explain privacy and security
- Create rules about screen time
- Monitor and discuss activities
- Praise good digital citizenship
- Set consequences for violations

Transitioning to Adult Account:
- At age 18, upgrade to adult account
- Transfer safe contacts
- Migrate data and preferences
- Enable full features
- Maintain privacy settings

For more information, visit our Family Safety Guide.`,
    keywords: [
      'kids',
      'children',
      'parental controls',
      'safety',
      'age-appropriate',
      'family',
    ],
    difficulty: 'beginner',
    lastUpdated: new Date('2025-10-30'),
  },

  {
    id: 'kb-011',
    title: 'Teens: Digital Literacy and Online Safety',
    category: 'kids',
    content: `Important information for teenagers using Salatiso safely.

Understanding Digital Footprint:
- Everything you post creates a record
- Be mindful of what you share
- Think before you click
- Privacy settings are your friend
- Review what others see about you

Smart Social Practices:
- Don't share personal information
- Be respectful online
- Don't respond to strangers
- Report suspicious behavior
- Tell a trusted adult about problems

Managing Your Privacy:
1. Go to Settings > Privacy
2. Review visibility settings
3. Control who sees your profile
4. Manage who can contact you
5. Set messaging preferences
6. Block inappropriate users

Recognizing Problems:
- Cyberbullying or harassment
- Scams or suspicious requests
- Inappropriate contact
- Pressure to share personal info
- Uncomfortable situations

What to Do If There's a Problem:
1. Don't respond or engage
2. Block the user
3. Report to Salatiso support
4. Tell a trusted adult
5. Keep evidence/screenshots

Safe Contact Management:
- Only add people you know
- Verify friend requests
- Review contact list regularly
- Remove suspicious accounts
- Use verified accounts

Resources:
- Digital Literacy Guide
- Cyber Safety Tips
- NetSmartz for Teens
- Common Sense Media Resources

Remember: You have the right to feel safe online.`,
    keywords: [
      'teens',
      'teenagers',
      'digital literacy',
      'safety',
      'cyberbullying',
      'online safety',
    ],
    difficulty: 'beginner',
    lastUpdated: new Date('2025-10-30'),
  },

  // Admin Articles
  {
    id: 'kb-012',
    title: 'Administrator Dashboard Overview',
    category: 'admin',
    content: `Complete guide to the administrator dashboard and management features.

Accessing Admin Dashboard:
1. Log in with admin account
2. Click "Admin Panel" in menu
3. Select "Dashboard"

Dashboard Widgets:
- User Statistics: Total users, active users, new signups
- System Health: Server status, database performance
- Recent Activities: Latest user activities and changes
- Security Alerts: Suspicious activities, login attempts
- Storage Usage: Data storage and limits
- Support Queue: Open tickets and issues

Managing Users:
1. Go to Admin > Users
2. Search or filter users
3. View user details
4. Edit user information
5. Reset user passwords
6. Manage user roles
7. Suspend or activate accounts
8. View user activity history

Role Management:
- Admin: Full system access
- Moderator: Content and user management
- Support Staff: User support access
- User: Standard access
- Viewer: Read-only access

System Settings:
- Email configuration
- Backup schedules
- Notification settings
- API keys
- Webhooks
- Rate limiting

Monitoring Performance:
- CPU and memory usage
- Database performance
- API response times
- Error rates
- User concurrent sessions

Security Management:
- User permissions
- API security
- Two-factor authentication
- Session management
- Audit logs

Regular Admin Tasks:
- Review user reports
- Monitor system health
- Backup data
- Update security settings
- Process support tickets
- Generate reports

For advanced configuration, see Administrator Technical Guide.`,
    keywords: ['admin', 'dashboard', 'administrator', 'management', 'users', 'system'],
    difficulty: 'advanced',
    lastUpdated: new Date('2025-10-30'),
  },

  {
    id: 'kb-013',
    title: 'Data Privacy and GDPR Compliance',
    category: 'security',
    content: `Understanding data privacy, GDPR compliance, and your rights.

Your Data Rights:
- Right to access your data
- Right to data portability
- Right to be forgotten
- Right to rectification
- Right to restrict processing
- Right to object

Salatiso Privacy Commitments:
- We collect only necessary data
- Your data is encrypted
- We don't sell your data
- Clear privacy policies
- Regular security audits
- Transparent data practices

GDPR Compliance:
- Legal basis for data processing
- Data retention policies
- Privacy by design
- Data protection impact assessments
- Breach notification procedures
- Data processor agreements

Managing Your Data:
1. Go to Settings > Privacy & Data
2. View your stored data
3. Request data export
4. Manage data sharing
5. Delete data

Data Retention:
- Active account: Data kept for account duration
- Deleted account: Data deleted within 30 days
- Archived contacts: Kept for 1 year
- Activity logs: Retained for 90 days
- Backups: Held for 30 days

Requesting Data Export:
1. Go to Settings > Privacy & Data
2. Click "Export My Data"
3. Choose format (JSON, CSV)
4. Receive download link via email
5. Complete download within 48 hours

Account Deletion:
1. Go to Settings > Account
2. Click "Delete Account"
3. Review consequences
4. Confirm deletion
5. Provide reason (optional)
6. Account permanently deleted

Third-Party Data Sharing:
- We share data only when necessary
- With your explicit consent
- Following data sharing agreements
- For specified purposes only
- With reputable vendors

For detailed privacy information, review our Privacy Policy.`,
    keywords: [
      'privacy',
      'GDPR',
      'data',
      'security',
      'compliance',
      'data protection',
    ],
    difficulty: 'intermediate',
    lastUpdated: new Date('2025-10-30'),
  },

  {
    id: 'kb-014',
    title: 'Troubleshooting Common Issues',
    category: 'features',
    content: `Quick solutions to common Salatiso problems.

Login Issues:
Problem: Can't log in
Solution:
1. Check internet connection
2. Verify email address
3. Click "Forgot Password"
4. Check email for reset link
5. Create new password
6. Try logging in again

Problem: Account locked
Solution:
1. Wait 30 minutes
2. Use password reset
3. Contact support if persists

Sync Issues:
Problem: Contacts not syncing
Solution:
1. Refresh browser (F5 or Ctrl+Shift+R)
2. Log out and log back in
3. Check internet connection
4. Clear browser cache
5. Try different browser
6. Contact support

Performance Issues:
Problem: Slow loading
Solution:
1. Check internet speed
2. Close unnecessary browser tabs
3. Clear cache and cookies
4. Update browser
5. Try incognito/private mode
6. Check for browser extensions

Problem: App crashes frequently
Solution:
1. Update the app
2. Restart your device
3. Reinstall the app
4. Contact support

Import Issues:
Problem: Import fails
Solution:
1. Check file format (CSV, Excel, vCard)
2. Verify column headers
3. Remove special characters
4. Test with smaller file
5. Check for duplicate entries
6. Contact support for assistance

Export Issues:
Problem: Can't export data
Solution:
1. Check storage space
2. Try different format
3. Try different browser
4. Clear browser cache
5. Contact support

Mobile App Issues:
Problem: Features not working on mobile
Solution:
1. Check app version (update if needed)
2. Restart app
3. Restart device
4. Check mobile internet
5. Reinstall app if needed

Getting Help:
- Check FAQ section
- Review knowledge base
- Contact support team
- Schedule support call
- Email support@salatiso.com

For persistent issues, always contact our support team with error messages and screenshots.`,
    keywords: [
      'troubleshooting',
      'problems',
      'issues',
      'help',
      'errors',
      'support',
      'fix',
    ],
    difficulty: 'beginner',
    lastUpdated: new Date('2025-10-30'),
  },

  {
    id: 'kb-015',
    title: 'Getting Help and Contacting Support',
    category: 'features',
    content: `How to get help and connect with our support team.

Self-Help Resources:
- Knowledge Base: Articles on all features
- FAQ Section: Common questions answered
- Video Tutorials: Step-by-step guides
- Community Forum: Connect with other users
- Blog: Tips and best practices
- Webinars: Live training sessions

Contacting Support:
Email: support@salatiso.com
Phone: +1-800-SALATISO (option for callback)
Chat: Available 9 AM - 5 PM (weekdays)
Social Media: @SalatisoCare on Twitter/Facebook

Creating a Support Ticket:
1. Go to Help > Contact Support
2. Click "Create Ticket"
3. Choose issue category
4. Describe problem in detail
5. Attach screenshots if applicable
6. Indicate urgency
7. Submit ticket

Information to Include:
- Clear problem description
- Steps to reproduce issue
- Screenshots or error messages
- Device and browser info
- Account information
- When issue started
- What you've already tried

Support Response Times:
- Critical: 1 hour
- High: 4 hours
- Medium: 24 hours
- Low: 48 hours

Support Levels:
- Free: Email and community support
- Premium: Priority support, phone access
- Enterprise: 24/7 dedicated support

Feedback and Suggestions:
- Share ideas on roadmap
- Vote on feature requests
- Participate in user surveys
- Join beta testing program
- Suggest improvements

Community Resources:
- User forums for peer support
- User group meetings
- Case studies and best practices
- Partner ecosystem
- Integration marketplace

Escalation Path:
1. Submit support ticket
2. Connect with support agent
3. Escalate to manager if needed
4. Reach executive team if necessary
5. Follow up on resolution

SLA (Service Level Agreement):
- 99.9% uptime guarantee
- Response time commitments
- Resolution prioritization
- Regular status updates
- Proactive monitoring

We're here to help! Don't hesitate to reach out.`,
    keywords: [
      'support',
      'help',
      'contact',
      'assistance',
      'ticket',
      'faq',
      'troubleshoot',
    ],
    difficulty: 'beginner',
    lastUpdated: new Date('2025-10-30'),
  },
];

/**
 * Function to insert knowledge base articles into Firestore
 * 
 * Usage:
 * ```
 * import { db } from '@/lib/firebase';
 * import { collection, addDoc } from 'firebase/firestore';
 * import { KNOWLEDGE_BASE_ARTICLES } from '@/data/knowledgeBase';
 * 
 * async function populateKnowledgeBase() {
 *   const kbCollection = collection(db, 'chatbot_knowledge_base');
 *   
 *   for (const article of KNOWLEDGE_BASE_ARTICLES) {
 *     await addDoc(kbCollection, {
 *       ...article,
 *       lastUpdated: new Date(article.lastUpdated),
 *     });
 *   }
 *   
 *   console.log('Knowledge base populated successfully');
 * }
 * ```
 */
export async function populateKnowledgeBase() {
  try {
    const { db } = await import('@/lib/firebase');
    const { collection, addDoc } = await import('firebase/firestore');

    const kbCollection = collection(db, 'chatbot_knowledge_base');

    for (const article of KNOWLEDGE_BASE_ARTICLES) {
      await addDoc(kbCollection, {
        ...article,
        lastUpdated: new Date(article.lastUpdated),
        views: 0,
        helpful: 0,
        notHelpful: 0,
      });
    }

    console.log('✅ Knowledge base populated with', KNOWLEDGE_BASE_ARTICLES.length, 'articles');
    return true;
  } catch (error) {
    console.error('❌ Error populating knowledge base:', error);
    return false;
  }
}

/**
 * Search knowledge base articles
 */
export function searchKnowledgeBase(query: string): KnowledgeBaseArticle[] {
  const lowerQuery = query.toLowerCase();

  return KNOWLEDGE_BASE_ARTICLES.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery) ||
      article.keywords.some((keyword) => keyword.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string): KnowledgeBaseArticle[] {
  return KNOWLEDGE_BASE_ARTICLES.filter((article) => article.category === category);
}

/**
 * Get related articles
 */
export function getRelatedArticles(articleId: string): KnowledgeBaseArticle[] {
  const article = KNOWLEDGE_BASE_ARTICLES.find((a) => a.id === articleId);
  if (!article || !article.relatedArticles) return [];

  return KNOWLEDGE_BASE_ARTICLES.filter((a) =>
    article.relatedArticles?.includes(a.id)
  );
}
