import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FileText, Scale, Users, Shield, AlertTriangle, Ban, Mail } from 'lucide-react';
import PublicLayout from '@/components/layouts/PublicLayout';

export default function TermsOfService() {
  return (
    <PublicLayout>
      <Head>
        <title>Terms of Service | LifeCV by MNi</title>
        <meta
          name="description"
          content="LifeCV Terms of Service - Legal agreement for using our family-first digital ecosystem platform"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            </div>
            <p className="text-gray-600 mb-2">
              <strong>Effective Date:</strong> October 29, 2025
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Last Updated:</strong> October 29, 2025
            </p>
            <p className="text-gray-700 mt-4">
              Welcome to LifeCV, operated by MNi by Salatiso ("Company," "we," "our," or "us"). 
              By accessing or using our platform, you agree to be bound by these Terms of Service 
              ("Terms"). Please read them carefully.
            </p>
          </div>

          {/* Acceptance of Terms */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
            </div>

            <div className="text-gray-700 space-y-3">
              <p>
                By creating an account or using LifeCV, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms and our{' '}
                <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>.
              </p>
              <p>
                If you do not agree to these Terms, you must not access or use our services.
              </p>
            </div>
          </section>

          {/* Eligibility */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">2. Eligibility</h2>
            </div>

            <div className="text-gray-700 space-y-3">
              <p>To use LifeCV, you must:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Be at least 13 years of age (or the minimum age in your jurisdiction)</li>
                <li>Provide accurate and complete registration information</li>
                <li>Have parental consent if you are under 18</li>
                <li>Not be prohibited from using our services under applicable laws</li>
              </ul>
              <p className="mt-3">
                Family accounts allow parents/guardians to manage accounts for minor children.
              </p>
            </div>
          </section>

          {/* Account Registration */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">3. Account Registration and Security</h2>
            </div>

            <div className="text-gray-700 space-y-3">
              <p><strong>3.1 Account Creation</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>You must provide accurate, current information during registration</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>One person may not maintain multiple accounts</li>
                <li>Accounts are non-transferable</li>
              </ul>

              <p className="mt-4"><strong>3.2 Account Security</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>You are responsible for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>We are not liable for losses from unauthorized use of your account</li>
                <li>Use strong, unique passwords and enable two-factor authentication when available</li>
              </ul>
            </div>
          </section>

          {/* User Conduct */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">4. Acceptable Use and Conduct</h2>
            </div>

            <div className="text-gray-700 space-y-3">
              <p><strong>You agree NOT to:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Upload viruses, malware, or harmful code</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate another person or entity</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated tools (bots, scrapers) without permission</li>
                <li>Share your account credentials with others</li>
                <li>Use the platform for commercial purposes without authorization</li>
                <li>Post false, misleading, or defamatory content</li>
              </ul>
            </div>
          </section>

          {/* Services and Features */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">5. Services and Features</h2>
            </div>

            <div className="text-gray-700 space-y-3">
              <p><strong>5.1 Platform Services</strong></p>
              <p>LifeCV provides:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Contact and relationship management</li>
                <li>Personal and family calendars</li>
                <li>Document storage and organization</li>
                <li>Family dashboard and collaboration tools</li>
                <li>Integration with third-party services (Google, etc.)</li>
              </ul>

              <p className="mt-4"><strong>5.2 Service Modifications</strong></p>
              <p>
                We reserve the right to modify, suspend, or discontinue any feature or service at any 
                time with or without notice. We are not liable for any modifications or discontinuation.
              </p>

              <p className="mt-4"><strong>5.3 Beta Features</strong></p>
              <p>
                Some features may be labeled as "beta" or "experimental." These are provided "as-is" 
                and may contain bugs or errors.
              </p>
            </div>
          </section>

          {/* User Content */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">6. User Content and Data</h2>
            </div>

            <div className="text-gray-700 space-y-3">
              <p><strong>6.1 Your Content</strong></p>
              <p>
                You retain ownership of all content you upload, create, or share on LifeCV ("User Content"). 
                By submitting User Content, you grant us a limited license to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Store, display, and transmit your content as necessary to provide our services</li>
                <li>Create backups and ensure data integrity</li>
                <li>Share your content with family members you designate</li>
              </ul>

              <p className="mt-4"><strong>6.2 Content Standards</strong></p>
              <p>User Content must not:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Be illegal, harmful, or violate third-party rights</li>
                <li>Contain viruses or malicious code</li>
                <li>Include hate speech, violence, or adult content</li>
                <li>Violate privacy or publicity rights</li>
              </ul>

              <p className="mt-4"><strong>6.3 Content Removal</strong></p>
              <p>
                We reserve the right to remove or disable access to User Content that violates these 
                Terms or is otherwise objectionable.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">7. Intellectual Property Rights</h2>
            </div>

            <div className="text-gray-700 space-y-3">
              <p>
                All content, features, and functionality of LifeCV (including but not limited to text, 
                graphics, logos, icons, images, audio, video, software, and code) are owned by MNi by 
                Salatiso and protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You may not copy, modify, distribute, sell, or lease any part of our services without 
                our express written permission.
              </p>
            </div>
          </section>

          {/* Payment and Subscriptions */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">8. Payment and Subscriptions</h2>
            </div>

            <div className="text-gray-700 space-y-3">
              <p><strong>8.1 Free Services</strong></p>
              <p>
                LifeCV currently offers free access to authorized family members. We reserve the right 
                to introduce paid features or subscriptions in the future.
              </p>

              <p className="mt-4"><strong>8.2 Future Paid Services</strong></p>
              <p>
                If paid features are introduced:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Pricing will be clearly displayed</li>
                <li>You will be notified before any charges</li>
                <li>Subscriptions may be subject to automatic renewal</li>
                <li>Refund policies will be specified at time of purchase</li>
              </ul>
            </div>
          </section>

          {/* Privacy and Data Protection */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">9. Privacy and Data Protection</h2>
            </div>

            <div className="text-gray-700 space-y-3">
              <p>
                Your privacy is important to us. Our collection and use of personal information is 
                governed by our{' '}
                <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>, which is incorporated into these Terms by reference.
              </p>
              <p>
                By using LifeCV, you consent to the collection and use of information as described in 
                our Privacy Policy.
              </p>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">10. Disclaimers and Limitations</h2>
            </div>

            <div className="text-gray-700 space-y-3">
              <p className="uppercase font-semibold">10.1 "AS-IS" BASIS</p>
              <p>
                LIFECV IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER 
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS 
                FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>

              <p className="mt-4 uppercase font-semibold">10.2 NO GUARANTEE</p>
              <p>
                WE DO NOT GUARANTEE THAT:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>The service will be uninterrupted, secure, or error-free</li>
                <li>Results or data will be accurate or reliable</li>
                <li>Defects will be corrected</li>
              </ul>

              <p className="mt-4 uppercase font-semibold">10.3 LIMITATION OF LIABILITY</p>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, MNI BY SALATISO SHALL NOT BE LIABLE FOR ANY 
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR 
                RELATED TO YOUR USE OF LIFECV.
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">11. Indemnification</h2>
            </div>

            <div className="text-gray-700">
              <p>
                You agree to indemnify, defend, and hold harmless MNi by Salatiso, its officers, 
                directors, employees, and agents from any claims, damages, losses, liabilities, and 
                expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Your use of LifeCV</li>
                <li>Your violation of these Terms</li>
                <li>Your User Content</li>
                <li>Your violation of any third-party rights</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Ban className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">12. Termination</h2>
            </div>

            <div className="text-gray-700 space-y-3">
              <p><strong>12.1 By You</strong></p>
              <p>
                You may terminate your account at any time by contacting us or using the account 
                deletion feature in your settings.
              </p>

              <p className="mt-4"><strong>12.2 By Us</strong></p>
              <p>
                We reserve the right to suspend or terminate your account at any time, with or without 
                notice, for:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Violation of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Extended inactivity</li>
                <li>Any other reason we deem appropriate</li>
              </ul>

              <p className="mt-4"><strong>12.3 Effect of Termination</strong></p>
              <p>
                Upon termination:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your access to LifeCV will cease immediately</li>
                <li>Your User Content will be deleted according to our Privacy Policy</li>
                <li>Certain provisions of these Terms will survive termination</li>
              </ul>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">13. Dispute Resolution</h2>
            </div>

            <div className="text-gray-700 space-y-3">
              <p><strong>13.1 Governing Law</strong></p>
              <p>
                These Terms are governed by the laws of South Africa, without regard to conflict of 
                law principles.
              </p>

              <p className="mt-4"><strong>13.2 Informal Resolution</strong></p>
              <p>
                Before filing a claim, you agree to try to resolve the dispute informally by contacting 
                us at{' '}
                <a href="mailto:support@salatiso.com" className="text-blue-600 hover:underline">
                  support@salatiso.com
                </a>.
              </p>

              <p className="mt-4"><strong>13.3 Jurisdiction</strong></p>
              <p>
                Any legal action arising from these Terms must be brought in the courts of South Africa.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">14. Changes to Terms</h2>
            </div>

            <div className="text-gray-700">
              <p>
                We may modify these Terms at any time. We will notify you of material changes via 
                email or through the platform. Your continued use of LifeCV after changes take effect 
                constitutes acceptance of the new Terms.
              </p>
            </div>
          </section>

          {/* General Provisions */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">15. General Provisions</h2>
            </div>

            <div className="text-gray-700 space-y-2">
              <p><strong>15.1 Entire Agreement:</strong> These Terms and our Privacy Policy constitute the entire agreement between you and MNi by Salatiso.</p>
              <p><strong>15.2 Severability:</strong> If any provision is found unenforceable, the remaining provisions remain in effect.</p>
              <p><strong>15.3 Waiver:</strong> Our failure to enforce any right does not waive that right.</p>
              <p><strong>15.4 Assignment:</strong> You may not assign these Terms. We may assign them without restriction.</p>
              <p><strong>15.5 No Third-Party Beneficiaries:</strong> These Terms create no third-party beneficiary rights.</p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">16. Contact Us</h2>
            </div>

            <div className="text-gray-700 space-y-2">
              <p>Questions about these Terms? Contact us:</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-3">
                <p><strong>Email:</strong>{' '}
                  <a href="mailto:legal@salatiso.com" className="text-blue-600 hover:underline">
                    legal@salatiso.com
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

          {/* Acknowledgment */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-gray-800 font-medium">
              BY USING LIFECV, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND 
              BY THESE TERMS OF SERVICE.
            </p>
          </div>

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
