import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
  FileText
} from 'lucide-react';
import { AccessibleModal, AccessibleTextarea, AccessibleSelect } from '@/components/accessibility';
import { Contact } from '@/services/ContactsService';
import contactsService from '@/services/ContactsService';

interface EmailInviteModalProps {
  contact: Contact;
  onClose: () => void;
  onSendSuccess?: () => void;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'sonny' | 'business' | 'general';
}

const EmailInviteModal: React.FC<EmailInviteModalProps> = ({
  contact,
  onClose,
  onSendSuccess
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('sonny-invite');
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const emailTemplates: EmailTemplate[] = [
    {
      id: 'sonny-invite',
      name: 'Sonny Network Invitation',
      subject: 'Join the Sonny Network - Family Connection',
      body: `Hi ${contact.firstName},

I would like to invite you to join the Sonny Network, our family's digital ecosystem for staying connected and collaborating together.

The Sonny Network helps us:
• Stay connected with family members
• Share important updates and documents
• Collaborate on family projects
• Access family resources and templates

To get started, please visit: https://salatiso-lifecv.web.app/

Looking forward to connecting with you!

Best regards`,
      category: 'sonny'
    },
    {
      id: 'household-invite',
      name: 'Household Member Invitation',
      subject: 'Welcome to Our Household Network',
      body: `Hi ${contact.firstName},

I'm inviting you to join our household network on the MNI platform. This will help us coordinate household activities, share calendars, and stay organized.

Benefits:
• Shared family calendar
• Household task management
• Document sharing
• Emergency contacts

Join us at: https://salatiso-lifecv.web.app/

Warm regards`,
      category: 'sonny'
    },
    {
      id: 'business-collab',
      name: 'Business Collaboration Invitation',
      subject: 'Collaborate on MNI Business Platform',
      body: `Hi ${contact.firstName},

I'd like to invite you to collaborate on the MNI Business Platform. This platform helps us manage projects, share documents, and work together more effectively.

Key Features:
• Project management tools
• Document collaboration
• Business templates
• Professional networking

Get started: https://salatiso-lifecv.web.app/

Looking forward to working together!

Best regards`,
      category: 'business'
    },
    {
      id: 'community-invite',
      name: 'Community Engagement Invitation',
      subject: 'Join Our Community Platform',
      body: `Hi ${contact.firstName},

You're invited to join our community platform where we share resources, collaborate on initiatives, and support each other's growth.

What's Available:
• Community resources
• Educational content
• Networking opportunities
• Event coordination

Join the community: https://salatiso-lifecv.web.app/

See you there!

Best regards`,
      category: 'general'
    },
    {
      id: 'custom',
      name: 'Custom Message',
      subject: '',
      body: '',
      category: 'general'
    }
  ];

  const selectedTemplateData = emailTemplates.find(t => t.id === selectedTemplate);

  const handleSendEmail = async () => {
    if (!contact.emails || contact.emails.length === 0) {
      setError('This contact has no email addresses.');
      return;
    }

    const recipientEmail = contact.emails[0];
    let subject = selectedTemplate === 'custom' ? customSubject : selectedTemplateData?.subject || '';
    let body = selectedTemplate === 'custom' ? customMessage : selectedTemplateData?.body || '';

    // Add personalization
    subject = subject.replace(/\{firstName\}/g, contact.firstName);
    body = body.replace(/\{firstName\}/g, contact.firstName);
    body = body.replace(/\{lastName\}/g, contact.lastName);

    // Create mailto link
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      setSending(true);
      // Open default email client
      window.location.href = mailtoLink;
      
      // Mark invitation as sent in Firestore
      await contactsService.markInvitationSent(contact.id);
      
      // Mark as sent after a delay
      setTimeout(() => {
        setSending(false);
        setSent(true);
        if (onSendSuccess) {
          onSendSuccess();
        }
        
        // Auto-close after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      }, 1000);
    } catch (err) {
      setSending(false);
      setError('Failed to open email client. Please try again.');
      console.error('Email error:', err);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    setError('');
    
    if (templateId === 'custom') {
      setCustomSubject('');
      setCustomMessage('');
    }
  };

  return (
    <AccessibleModal
      isOpen={true}
      onClose={onClose}
      title="Send Email Invitation"
    >
      <div className="space-y-6">
        {/* Contact Info */}
        <div className="bg-ubuntu-warm-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-ubuntu-orange rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {contact.firstName} {contact.lastName}
              </h3>
              <p className="text-sm text-gray-600">
                {contact.emails && contact.emails.length > 0 ? (
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {contact.emails[0]}
                  </span>
                ) : (
                  <span className="text-red-600">No email address</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Template Selection */}
        <div>
          <AccessibleSelect
            label="Email Template"
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
            options={emailTemplates.map(template => ({
              value: template.id,
              label: template.name
            }))}
          />
          <p className="mt-1 text-sm text-gray-500">Choose a pre-written template or create a custom message</p>
        </div>

        {/* Template Preview or Custom Fields */}
        {selectedTemplate === 'custom' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Email subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ubuntu-orange focus:border-transparent"
              />
            </div>
            <AccessibleTextarea
              label="Message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Type your custom message here..."
              rows={8}
            />
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-ubuntu-orange" />
              <h4 className="font-semibold text-gray-900">Preview</h4>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Subject:</p>
                <p className="text-sm text-gray-900">{selectedTemplateData?.subject}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Message:</p>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {selectedTemplateData?.body}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </motion.div>
        )}

        {/* Success Message */}
        {sent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Email Client Opened</p>
              <p className="text-sm text-green-700">
                Your default email application has been opened with the message ready to send.
              </p>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={sending}
          >
            Cancel
          </button>
          <button
            onClick={handleSendEmail}
            disabled={
              sending || 
              sent || 
              !contact.emails?.length || 
              (selectedTemplate === 'custom' && (!customSubject || !customMessage))
            }
            className="flex-1 px-4 py-2 bg-ubuntu-orange text-white rounded-lg hover:bg-ubuntu-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Opening...
              </>
            ) : sent ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Sent
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Email
              </>
            )}
          </button>
        </div>

        {/* Info Text */}
        <p className="text-xs text-gray-500 text-center">
          This will open your default email application with the message pre-filled.
          You can review and edit before sending.
        </p>
      </div>
    </AccessibleModal>
  );
};

export default EmailInviteModal;
