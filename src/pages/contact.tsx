import React, { useState } from 'react';
import Link from 'next/link';
import PublicLayout from '../components/layouts/PublicLayout';
import { Mail, Phone, MapPin, MessageSquare, Send, Briefcase, Clock } from 'lucide-react';
import { AccessibleInput, AccessibleTextarea, AccessibleSelect } from '@/components/accessibility';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const contactRecipients = ['hub@salatiso.com', 'lifecvhub@gmail.com'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real implementation, you would send the form data to your backend
    console.log('Contact form submitted to recipients:', {
      formData,
      recipients: contactRecipients,
    });
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    }, 3000);
  };

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'business', label: 'Business Partnership' },
    { value: 'investment', label: 'Investment Opportunity' },
    { value: 'family', label: 'Family Ecosystem Access' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'media', label: 'Media & Press' }
  ];

  type ContactInfoItem = {
    icon: React.ElementType;
    title: string;
    description: string;
    value: string;
    action: string;
    external?: boolean;
    additionalValues?: Array<{ label: string; href: string }>;
  };

  const contactInfo: ContactInfoItem[] = [
    {
      icon: Mail,
      title: 'Email Hub',
      description: 'General inquiries and ecosystem communications',
      value: 'hub@salatiso.com',
      action: 'mailto:hub@salatiso.com',
      additionalValues: [
        { label: 'lifecvhub@gmail.com', href: 'mailto:lifecvhub@gmail.com' }
      ]
    },
    {
      icon: Briefcase,
  title: 'Business Partnerships',
  description: 'Strategic opportunities are coordinated through BizHelp.',
  value: 'https://bizhelp-lifecv.web.app/marketplace',
      action: 'https://bizhelp-lifecv.web.app/marketplace',
      external: true
    }
  ];

  const officeHours = [
    { day: 'Monday - Friday', hours: '8:00 AM - 5:00 PM SAST' },
    { day: 'Saturday', hours: '9:00 AM - 2:00 PM SAST' },
    { day: 'Sunday', hours: 'Closed' }
  ];

  return (
    <PublicLayout title="Contact Us - Mlandeli Notemba Investments">
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Get in Touch
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                We’d love to hear from you. Whether you’re interested in our ecosystem, 
                exploring partnership opportunities, or just want to learn more about 
                our Ubuntu-driven approach to family enterprise.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="w-6 h-6 mr-3 text-primary-600" />
                    Send Us a Message
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below and we’ll get back to you as soon as possible.
                  </p>
                </div>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">
                      Thank you for contacting us. We’ll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <AccessibleInput
                        label="Full Name"
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                      />

                      <AccessibleInput
                        label="Email Address"
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <AccessibleSelect
                      label="Inquiry Type"
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      options={inquiryTypes.map((type) => ({ value: type.value, label: type.label }))}
                    />

                    <AccessibleInput
                      label="Subject"
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Brief subject of your inquiry"
                    />

                    <AccessibleTextarea
                      label="Message"
                      id="message"
                      name="message"
                      rows={6}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please provide details about your inquiry..."
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>

                    <p className="text-sm text-gray-500 text-center">
                      * Required fields. We respect your privacy and will never share your information.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Methods */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((contact, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <contact.icon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {contact.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {contact.description}
                          </p>
                          <a
                            href={contact.action}
                            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                            target={contact.external ? '_blank' : undefined}
                            rel={contact.external ? 'noopener noreferrer' : undefined}
                          >
                            {contact.value}
                          </a>
                          {contact.additionalValues?.map((extra, extraIndex) => (
                            <a
                              key={extraIndex}
                              href={extra.href}
                              className="block text-primary-500 hover:text-primary-600 text-sm transition-colors"
                            >
                              {extra.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-600" />
                  Office Hours
                </h3>
                <div className="space-y-3">
                  {officeHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{schedule.day}</span>
                      <span className="font-medium text-gray-900">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Emergency Support:</strong> Critical issues can be reported 24/7 
                      via email and will be addressed within 4 hours.
                    </p>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                  Our Location
                </h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">Mlandeli Notemba Investments</p>
                  <p className="text-gray-600">
                    Johannesburg, South Africa<br />
                    Serving Africa and beyond
                  </p>
                </div>
                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-800">
                    We operate in a distributed model across South Africa, 
                    with team members in major cities and rural areas.
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Links
                </h3>
                <div className="space-y-2">
                  <Link href="/ecosystem" className="block text-primary-600 hover:text-primary-700 transition-colors">
                    → Explore Our Ecosystem
                  </Link>
                  <Link href="/journey" className="block text-primary-600 hover:text-primary-700 transition-colors">
                    → Our Family Journey
                  </Link>
                  <Link href="/library" className="block text-primary-600 hover:text-primary-700 transition-colors">
                    → Document Library
                  </Link>
                  <Link href="/intranet" className="block text-primary-600 hover:text-primary-700 transition-colors">
                    → Family Member Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Quick answers to common inquiries about our ecosystem
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What is the Salatiso ecosystem?
                  </h3>
                  <p className="text-gray-600">
                    The Salatiso ecosystem is a comprehensive family enterprise platform 
                    built on Ubuntu principles, featuring interconnected applications for 
                    business, education, and family management.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How can I access family features?
                  </h3>
                  <p className="text-gray-600">
                    Family features are restricted to authorized family members with 
                    verified email addresses. Contact us at family@mdeni.family for 
                    access requests.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Do you offer business partnerships?
                  </h3>
                  <p className="text-gray-600">
                    Yes! We’re open to strategic partnerships that align with our Ubuntu 
                    values. Contact partnerships@salatiso.com to discuss opportunities.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What makes your approach unique?
                  </h3>
                  <p className="text-gray-600">
                    We integrate traditional Ubuntu philosophy with modern technology, 
                    creating systems that prioritize collective prosperity and 
                    multi-generational wealth building.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How long does it take to get a response?
                  </h3>
                  <p className="text-gray-600">
                    We typically respond to inquiries within 24 hours during business days. 
                    Critical issues are addressed within 4 hours.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can I invest in your ecosystem?
                  </h3>
                  <p className="text-gray-600">
                    Investment opportunities are considered on a case-by-case basis. 
                    Please contact us with your investment interest and we’ll provide 
                    relevant information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Contact;