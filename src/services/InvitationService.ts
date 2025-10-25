import { Contact, contactsService } from '@/services/ContactsService';
import { auth } from '@/config/firebase';
import { 
  doc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  Timestamp,
  updateDoc 
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface Invitation {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  recipientEmail: string;
  recipientContactId?: string;
  inviteToken: string;
  method: 'email' | 'sms' | 'link';
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  sentAt: Date;
  acceptedAt?: Date;
  expiresAt: Date;
  message?: string;
}

export class InvitationService {
  private collectionName = 'invitations';
  private invitationBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lifesync-lifecv.web.app';

  /**
   * Generate a unique invitation token
   */
  private generateToken(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Send email invitation to a contact
   */
  async sendEmailInvitation(contact: Contact, customMessage?: string): Promise<Invitation> {
    if (contact.emails.length === 0) {
      throw new Error('Contact has no email address');
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const inviteToken = this.generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30-day expiry

    const invitationData: Omit<Invitation, 'id'> = {
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'A Salatiso User',
      senderEmail: currentUser.email || '',
      recipientEmail: contact.emails[0],
      recipientContactId: contact.id,
      inviteToken,
      method: 'email',
      status: 'pending',
      sentAt: new Date(),
      expiresAt,
      message: customMessage
    };

    // Save invitation to Firestore
    const invitationRef = collection(db, this.collectionName);
    const doc = await addDoc(invitationRef, {
      ...invitationData,
      sentAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(expiresAt)
    });

    const invitation: Invitation = {
      ...invitationData,
      id: doc.id
    };

    // Send email via API
    await this.sendInvitationEmail(invitation);

    // Update contact with invitation status
    await contactsService.updateContact(contact.id, {
      invitationSent: true,
      invitationSentDate: new Date()
    });

    return invitation;
  }

  /**
   * Send invitation email
   */
  private async sendInvitationEmail(invitation: Invitation): Promise<void> {
    try {
      const inviteUrl = `${this.invitationBaseUrl}/accept-invitation?token=${invitation.inviteToken}`;

      const response = await fetch('/api/send-invitation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientEmail: invitation.recipientEmail,
          senderName: invitation.senderName,
          senderEmail: invitation.senderEmail,
          inviteUrl,
          customMessage: invitation.message,
          expiresAt: invitation.expiresAt.toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send invitation email');
      }
    } catch (error) {
      console.error('Error sending invitation email:', error);
      throw error;
    }
  }

  /**
   * Get all invitations sent by user
   */
  async getUserInvitations(userId: string): Promise<Invitation[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('senderId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        sentAt: doc.data().sentAt?.toDate() || new Date(),
        acceptedAt: doc.data().acceptedAt?.toDate(),
        expiresAt: doc.data().expiresAt?.toDate() || new Date()
      } as Invitation));
    } catch (error) {
      console.error('Error getting user invitations:', error);
      throw error;
    }
  }

  /**
   * Accept an invitation using token
   */
  async acceptInvitation(token: string): Promise<Invitation> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('inviteToken', '==', token)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error('Invalid invitation token');
      }

      const invitationDoc = querySnapshot.docs[0];
      const invitation = {
        id: invitationDoc.id,
        ...invitationDoc.data()
      } as Invitation;

      // Check if expired
      if (invitation.expiresAt < new Date()) {
        throw new Error('Invitation has expired');
      }

      // Update invitation status
      await updateDoc(doc(db, this.collectionName, invitationDoc.id), {
        status: 'accepted',
        acceptedAt: Timestamp.now()
      });

      // Update contact if exists
      if (invitation.recipientContactId) {
        await contactsService.updateContact(invitation.recipientContactId, {
          invitationAccepted: true
        });
      }

      return {
        ...invitation,
        status: 'accepted',
        acceptedAt: new Date()
      };
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  }

  /**
   * Decline an invitation
   */
  async declineInvitation(token: string): Promise<void> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('inviteToken', '==', token)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error('Invalid invitation token');
      }

      const invitationDoc = querySnapshot.docs[0];

      await updateDoc(doc(db, this.collectionName, invitationDoc.id), {
        status: 'declined'
      });
    } catch (error) {
      console.error('Error declining invitation:', error);
      throw error;
    }
  }

  /**
   * Get invitation by token
   */
  async getInvitationByToken(token: string): Promise<Invitation | null> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('inviteToken', '==', token)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        sentAt: doc.data().sentAt?.toDate() || new Date(),
        acceptedAt: doc.data().acceptedAt?.toDate(),
        expiresAt: doc.data().expiresAt?.toDate() || new Date()
      } as Invitation;
    } catch (error) {
      console.error('Error getting invitation:', error);
      return null;
    }
  }

  /**
   * Get invitation statistics for a user
   */
  async getInvitationStats(userId: string): Promise<{
    total: number;
    pending: number;
    accepted: number;
    declined: number;
  }> {
    try {
      const invitations = await this.getUserInvitations(userId);
      return {
        total: invitations.length,
        pending: invitations.filter(i => i.status === 'pending').length,
        accepted: invitations.filter(i => i.status === 'accepted').length,
        declined: invitations.filter(i => i.status === 'declined').length
      };
    } catch (error) {
      console.error('Error getting invitation stats:', error);
      return { total: 0, pending: 0, accepted: 0, declined: 0 };
    }
  }
}

export const invitationService = new InvitationService();
