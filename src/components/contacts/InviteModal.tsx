import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Mail,
  MessageSquare
} from 'lucide-react';
import { AccessibleModal, AccessibleTextarea } from '@/components/accessibility';
import { Contact } from '@/services/ContactsService';
import { invitationService } from '@/services/InvitationService';

interface InviteModalProps {
  contact: Contact;
  onClose: () => void;
  onSendSuccess?: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({
  contact,
  onClose,
  onSendSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState<'email' | 'sms' | 'link'>('email');
  const [selectedEmail, setSelectedEmail] = useState<string>(contact.emails[0] || '');
  const [customMessage, setCustomMessage] = useState('');
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendInvitation = async () => {
    setIsLoading(true);
    setSendStatus('sending');
    setErrorMessage('');

    try {
      if (method === 'email') {
        // Create a modified contact with the selected email
        const contactWithSelectedEmail = {
          ...contact,
          emails: [selectedEmail]
        };
        await invitationService.sendEmailInvitation(contactWithSelectedEmail, customMessage);
        setSendStatus('success');
        if (onSendSuccess) onSendSuccess();
        setTimeout(onClose, 2000);
      } else if (method === 'sms') {
        // SMS functionality would be implemented here
        setErrorMessage('SMS invitations are coming soon!');
        setSendStatus('error');
      } else if (method === 'link') {
        // Generate shareable link
        setErrorMessage('Link sharing is coming soon!');
        setSendStatus('error');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send invitation');
      setSendStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AccessibleModal
      isOpen={true}
      onClose={onClose}
      title={`Invite ${contact.firstName} ${contact.lastName}`}
      size="md"
    >
      <div className="space-y-6">
        {/* Status Messages */}
        {sendStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3"
          >
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-900">Invitation Sent!</h4>
              <p className="text-sm text-green-700 mt-1">
                {contact.firstName} will receive an invitation to join the Salatiso Ecosystem.
              </p>
            </div>
          </motion.div>
        )}

        {sendStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3"
          >
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900">Error</h4>
              <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
            </div>
          </motion.div>
        )}

        {sendStatus === 'idle' && (
          <>
            {/* Contact Info */}
            <div className="bg-ubuntu-aubergine/5 border border-ubuntu-aubergine/20 rounded-lg p-4">
              <h4 className="font-medium text-ubuntu-aubergine mb-3">Inviting:</h4>
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-medium">Name:</span>{' '}
                  {contact.firstName} {contact.lastName}
                </p>
                
                {/* Email Selection */}
                {contact.emails.length > 0 && (
                  <div>
                    <label className="block font-medium mb-2">
                      📧 Email:
                    </label>
                    {contact.emails.length === 1 ? (
                      <p className="text-ubuntu-warm-700 bg-white px-3 py-2 rounded border border-ubuntu-warm-200">
                        {contact.emails[0]}
                      </p>
                    ) : (
                      <select
                        value={selectedEmail}
                        onChange={(e) => setSelectedEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-ubuntu-warm-300 rounded-lg bg-white text-ubuntu-warm-900 focus:outline-none focus:ring-2 focus:ring-ubuntu-gold focus:border-transparent"
                      >
                        {contact.emails.map((email, index) => (
                          <option key={index} value={email}>
                            {email}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {contact.phoneNumbers.length > 0 && (
                  <p>
                    <span className="font-medium">Phone:</span> {contact.phoneNumbers[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Invitation Method Selection */}
            <div className="space-y-3">
              <h4 className="font-medium text-ubuntu-warm-900">How to invite?</h4>

              <motion.label
                whileHover={{ scale: 1.01 }}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  method === 'email'
                    ? 'border-ubuntu-gold bg-ubuntu-gold/5'
                    : 'border-ubuntu-warm-200'
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value="email"
                  checked={method === 'email'}
                  onChange={(e) => setMethod(e.target.value as 'email' | 'sms' | 'link')}
                  className="w-4 h-4 text-ubuntu-gold"
                />
                <Mail className="w-5 h-5 text-ubuntu-gold ml-3 mr-2" />
                <div>
                  <p className="font-medium text-ubuntu-warm-900">Email Invitation</p>
                  <p className="text-xs text-ubuntu-warm-600">Send invitation via email (recommended)</p>
                </div>
              </motion.label>

              <motion.label
                whileHover={{ scale: 1.01 }}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all opacity-50 ${
                  method === 'sms'
                    ? 'border-ubuntu-gold bg-ubuntu-gold/5'
                    : 'border-ubuntu-warm-200'
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value="sms"
                  disabled
                  className="w-4 h-4 text-ubuntu-warm-300"
                />
                <MessageSquare className="w-5 h-5 text-ubuntu-warm-300 ml-3 mr-2" />
                <div>
                  <p className="font-medium text-ubuntu-warm-500">SMS Invitation</p>
                  <p className="text-xs text-ubuntu-warm-500">Coming soon...</p>
                </div>
              </motion.label>
            </div>

            {/* Custom Message */}
            {method === 'email' && (
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Add a personal message to help them understand why you're inviting them..."
                  className="w-full px-4 py-2 border border-ubuntu-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-gold focus:border-transparent resize-none"
                  rows={4}
                />
                <p className="text-xs text-ubuntu-warm-500 mt-1">
                  {customMessage.length}/500 characters
                </p>
              </div>
            )}

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-medium">💡 Email Template:</span> The invitation will be sent with the new Sonny Network message and will include a link and QR code to your public LifeSync profile.
              </p>
            </div>
          </>
        )}

        {/* Action Buttons */}
        {sendStatus === 'idle' && (
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-ubuntu-warm-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-ubuntu-warm-700 border border-ubuntu-warm-300 rounded-lg hover:bg-ubuntu-warm-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSendInvitation}
              disabled={isLoading || (method === 'email' && !selectedEmail)}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Invitation</span>
                </>
              )}
            </button>
          </div>
        )}

        {sendStatus !== 'idle' && (
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-ubuntu-warm-700 border border-ubuntu-warm-300 rounded-lg hover:bg-ubuntu-warm-50 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </AccessibleModal>
  );
};

export default InviteModal;
