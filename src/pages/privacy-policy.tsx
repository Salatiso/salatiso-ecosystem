import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Shield, Lock, Database, Eye, Users, FileText, Globe, Mail } from 'lucide-react';
import PublicLayout from '@/components/layouts/PublicLayout';

export default function PrivacyPolicy() {
  return (
    <PublicLayout>
      <Head>
        <title>Privacy Policy | LifeCV by MNi</title>
        <meta
          name="description"
          content="LifeCV Privacy Policy - How we collect, use, and protect your personal information"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <p className="text-gray-600 mb-2">
              <strong>Effective Date:</strong> October 29, 2025
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Last Updated:</strong> October 29, 2025
            </p>
            <p className="text-gray-700 mt-4">
              MNi by Salatiso ("we," "our," or "us") operates LifeCV, a family-first digital ecosystem 
              platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you use our application and services.
            </p>
          </div>

          {/* Information We Collect */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">1. Information We Collect</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1.1 Personal Information</h3>
                <p className="text-gray-700 mb-2">When you register for LifeCV, we collect:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Name and email address (via Google Authentication)</li>
                  <li>Profile picture (optional, from your Google account)</li>
                  <li>Contact information you choose to add</li>
                  <li>Family relationship information</li>
                  <li>Calendar events and scheduling data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1.2 Automatically Collected Information</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and location data (for security purposes)</li>
                  <li>Usage data (pages visited, features used, time spent)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1.3 User-Generated Content</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Contacts you create and manage</li>
                  <li>Calendar events and appointments</li>
                  <li>Documents and files you upload</li>
                  <li>Messages and communications within the platform</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">2. How We Use Your Information</h2>
            </div>

            <div className="space-y-3 text-gray-700">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Provide Services:</strong> Create and manage your LifeCV account, contacts, calendar, and family dashboard</li>
                <li><strong>Improve Experience:</strong> Personalize content, features, and recommendations</li>
                <li><strong>Communication:</strong> Send service updates, security alerts, and support messages</li>
                <li><strong>Security:</strong> Detect fraud, prevent abuse, and protect user accounts</li>
                <li><strong>Analytics:</strong> Understand usage patterns to improve our platform</li>
                <li><strong>Compliance:</strong> Meet legal obligations and enforce our Terms of Service</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">3. Information Sharing and Disclosure</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.1 We DO NOT Sell Your Data</h3>
                <p className="text-gray-700">
                  We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.2 When We Share Information</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Family Members:</strong> Information you choose to share with family members within the LifeCV ecosystem</li>
                  <li><strong>Service Providers:</strong> Third-party services that help us operate (Firebase, Google Cloud, analytics)</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                  <li><strong>Safety:</strong> To protect the rights, property, or safety of our users or others</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.3 Third-Party Services</h3>
                <p className="text-gray-700 mb-2">LifeCV integrates with:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Google Authentication (for secure login)</li>
                  <li>Firebase/Google Cloud (for data storage and hosting)</li>
                  <li>Google Maps (for location services)</li>
                  <li>Google Analytics (for usage analytics)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Storage and Security */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">4. Data Storage and Security</h2>
            </div>

            <div className="space-y-3 text-gray-700">
              <p><strong>Storage Location:</strong> Your data is stored securely on Google Cloud Platform (Firebase) servers.</p>
              <p><strong>Encryption:</strong> Data is encrypted in transit (HTTPS/TLS) and at rest.</p>
              <p><strong>Access Controls:</strong> Strict authentication and authorization controls limit data access.</p>
              <p><strong>Security Measures:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Multi-factor authentication options</li>
                <li>Regular security audits and updates</li>
                <li>Firestore security rules to protect user data</li>
                <li>Monitoring for suspicious activity</li>
              </ul>
              <p className="mt-3 text-sm italic">
                While we implement industry-standard security measures, no system is 100% secure. 
                You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </div>
          </section>

          {/* Your Rights and Choices */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">5. Your Rights and Choices</h2>
            </div>

            <div className="space-y-3 text-gray-700">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data (subject to legal obligations)</li>
                <li><strong>Export:</strong> Download your data in a portable format</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Object:</strong> Object to certain data processing activities</li>
              </ul>

              <p className="mt-4">
                To exercise these rights, contact us at:{' '}
                <a href="mailto:privacy@salatiso.com" className="text-blue-600 hover:underline">
                  privacy@salatiso.com
                </a>
              </p>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">6. Cookies and Tracking Technologies</h2>
            </div>

            <div className="space-y-3 text-gray-700">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Keep you logged in</li>
                <li>Remember your preferences</li>
                <li>Analyze site usage</li>
                <li>Improve security</li>
              </ul>
              <p className="mt-3">
                You can control cookies through your browser settings. However, disabling cookies may 
                limit your ability to use certain features.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">7. Children's Privacy</h2>
            </div>

            <div className="text-gray-700">
              <p>
                LifeCV is a family platform. For users under 13 years of age, parental consent is required. 
                We comply with the Children's Online Privacy Protection Act (COPPA). Parents can review, 
                edit, or delete their child's information by contacting us.
              </p>
            </div>
          </section>

          {/* International Users */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">8. International Data Transfers</h2>
            </div>

            <div className="text-gray-700">
              <p>
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place to protect your data in accordance with 
                this Privacy Policy and applicable laws.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">9. Data Retention</h2>
            </div>

            <div className="text-gray-700">
              <p>
                We retain your personal information for as long as necessary to provide our services 
                and comply with legal obligations. When you delete your account:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Personal data is deleted within 30 days</li>
                <li>Backup copies are purged within 90 days</li>
                <li>Aggregated, anonymized data may be retained for analytics</li>
              </ul>
            </div>
          </section>

          {/* Changes to Policy */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">10. Changes to This Privacy Policy</h2>
            </div>

            <div className="text-gray-700">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of significant 
                changes by email or through a notice on the platform. The "Last Updated" date at the 
                top indicates when changes were made.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">11. Contact Us</h2>
            </div>

            <div className="text-gray-700 space-y-2">
              <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-3">
                <p><strong>Email:</strong>{' '}
                  <a href="mailto:privacy@salatiso.com" className="text-blue-600 hover:underline">
                    privacy@salatiso.com
                  </a>
                </p>
                <p><strong>Support Email:</strong>{' '}
                  <a href="mailto:spiceinc@gmail.com" className="text-blue-600 hover:underline">
                    spiceinc@gmail.com
                  </a>
                </p>
                <p><strong>Website:</strong>{' '}
                  <a href="https://salatiso-lifecv.web.app" className="text-blue-600 hover:underline">
                    https://salatiso-lifecv.web.app
                  </a>
                </p>
                <p className="mt-2"><strong>Mailing Address:</strong></p>
                <p className="text-sm">
                  MNi by Salatiso<br />
                  LifeCV Platform<br />
                  [Your Physical Address]<br />
                  South Africa
                </p>
              </div>
            </div>
          </section>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
