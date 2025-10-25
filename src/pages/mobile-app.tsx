import React, { useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/layouts/PublicLayout';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Download, 
  Shield, 
  Zap, 
  Wifi, 
  Star,
  CheckCircle,
  AlertCircle,
  Mail,
  Send,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const MobileAppPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      // TODO: Integrate with email service (EmailJS, Firebase Functions, etc.)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          to: ['hub@salatiso.com', 'lifecvhub@gmail.com'],
          from: 'eKhaya Mobile App Contact Form'
        })
      });

      if (response.ok) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      toast.error('Failed to send message. Please email us directly at hub@salatiso.com');
      console.error('Contact form error:', error);
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <PublicLayout 
      title="Download eKhaya Mobile App"
      description="Experience eKhaya on your Android device - Full feature-rich mobile application"
    >
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-block p-4 bg-primary-100 rounded-full mb-6">
                <Smartphone className="h-16 w-16 text-primary-600" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Get the eKhaya Mobile App
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience eKhaya on the go with our feature-rich mobile application. Mirror all web app functionality with offline capabilities.
              </p>
            </motion.div>

            {/* Beta Testing Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                  <h2 className="text-2xl font-bold text-yellow-900">
                    Currently in Beta Testing Phase
                  </h2>
                </div>
                <p className="text-yellow-800 mb-4">
                  Help us improve! Visit our testing hub to provide feedback.
                </p>
                <p className="text-sm text-yellow-700">
                  📱 Mobile app also available for testing at the same link.
                </p>
              </div>
            </motion.div>

            {/* Download Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white">
                  <h2 className="text-3xl font-bold mb-2">eKhaya Mobile App</h2>
                  <p className="text-primary-100">Experience eKhaya on your Android device</p>
                </div>

                <div className="p-8">
                  {/* App Info Grid */}
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">App Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Version</span>
                          <span className="font-semibold">1.0.0</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Size</span>
                          <span className="font-semibold">~50MB</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Latest Update</span>
                          <span className="font-semibold">10/12/2025</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-primary-600" />
                          <span className="text-gray-700">Lightning Fast</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary-600" />
                          <span className="text-gray-700">Secure & Private</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wifi className="h-5 w-5 text-primary-600" />
                          <span className="text-gray-700">Offline Ready</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Download Buttons */}
                  <div className="space-y-4">
                    <a
                      href="https://ekhaya-lifecv.web.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-lg"
                    >
                      <Download className="h-6 w-6" />
                      <span>Direct APK Download</span>
                      <span className="text-xs bg-primary-700 px-2 py-1 rounded">Latest version</span>
                    </a>

                    <a
                      href="https://play.google.com/store"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
                    >
                      <ExternalLink className="h-6 w-6" />
                      <span>Get it on Google Play Store</span>
                      <span className="text-xs bg-gray-800 px-2 py-1 rounded">Coming Soon</span>
                    </a>
                  </div>

                  {/* Installation Instructions */}
                  <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      Installation Instructions
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Download the APK file from the link above</li>
                      <li>Open the downloaded file on your Android device</li>
                      <li>If prompted, enable &ldquo;Install from Unknown Sources&rdquo; in settings</li>
                      <li>Follow the on-screen installation prompts</li>
                      <li>Launch eKhaya and sign in with your Google account</li>
                    </ol>
                    <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>Recommended:</strong> For the best experience and automatic updates,
                        we recommend downloading from Google Play Store once available.{' '}
                        <a href="https://ekhaya-lifecv.web.app/" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
                          https://ekhaya-lifecv.web.app/
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Visit eKhaya Web */}
        <section className="py-12 px-6 bg-gray-50">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Try the Web Version
            </h2>
            <p className="text-gray-600 mb-6">
              Access eKhaya directly from your browser at{' '}
              <a 
                href="https://ekhaya-lifecv.web.app/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                https://ekhaya-lifecv.web.app/
              </a>
            </p>
            <a
              href="https://ekhaya-lifecv.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-lg border-2 border-gray-200 transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
              Open Web App
            </a>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Mail className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600">
                Have questions about the mobile app? Contact us below.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="Download Issue">Download Issue</option>
                    <option value="Installation Help">Installation Help</option>
                    <option value="Beta Testing Feedback">Beta Testing Feedback</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Direct Email:</strong> You can also reach us at{' '}
                    <a href="mailto:hub@salatiso.com" className="text-primary-600 hover:text-primary-700">
                      hub@salatiso.com
                    </a>
                    {' '}or{' '}
                    <a href="mailto:lifecvhub@gmail.com" className="text-primary-600 hover:text-primary-700">
                      lifecvhub@gmail.com
                    </a>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-12 px-6 bg-gray-900 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="text-gray-300 mb-6">
              Visit our testing hub for FAQs, guides, and feedback portal
            </p>
            <Link
              href="/testing"
              className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <Star className="h-5 w-5" />
              Visit Testing Hub
            </Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default MobileAppPage;
