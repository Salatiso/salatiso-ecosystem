import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

interface EmailRequest {
  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  inviteUrl: string;
  customMessage?: string;
  expiresAt: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { recipientEmail, senderName, senderEmail, inviteUrl, customMessage, expiresAt } = req.body as EmailRequest;

    // Validate email
    if (!recipientEmail || !senderName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create email content with Sonny Network branding
    const emailSubject = 'Join My Network on the Sonny Network (Powered by LifeSync)';
    
    const emailBody = `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    .footer { color: #666; font-size: 12px; margin-top: 20px; }
    .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0; }
    .qr-code { text-align: center; margin: 20px 0; }
    .qr-code img { max-width: 200px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✨ You're Invited to Join the Sonny Network</h1>
      <p>Powered by LifeSync</p>
    </div>
    
    <div class="content">
      <p>Hi ${recipientEmail.split('@')[0]},</p>
      
      <p><strong>${senderName}</strong> would like to invite you to join their network on the <strong>Sonny Network</strong>, a digital space built on LifeSync where we can stay connected and grow together.</p>
      
      <p>By joining, you'll become part of ${senderName}'s circle within the Sonny Network, where you can:</p>
      <ul>
        <li>✅ Stay connected as family, friends, and community</li>
        <li>📱 Share updates, stories, and important documents</li>
        <li>🤝 Collaborate on projects and initiatives</li>
        <li>📚 Build and preserve family and personal legacy</li>
      </ul>
      
      <p><em>The Sonny Network is powered by LifeSync, so when you accept this invitation you'll be creating your profile on LifeSync — the core platform that keeps everything in sync.</em></p>
      
      ${customMessage ? `<div class="highlight"><p><strong>Personal Message from ${senderName}:</strong></p><p>"${customMessage}"</p></div>` : ''}
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${inviteUrl}" class="button">👉 Accept Invitation & Join Now</a>
      </p>
      
      <div class="qr-code">
        <p><strong>Or scan the QR code to join:</strong></p>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteUrl)}" alt="QR Code" />
      </div>
      
      <p><strong>About ${senderName}'s Public Profile:</strong></p>
      <p>You can learn more about ${senderName} on their public LifeSync profile:</p>
      <p style="text-align: center;">
        <a href="https://lifesync-lifecv.web.app/profile/${senderEmail.replace(/@/g, '_').replace(/\./g, '_')}" style="color: #667eea;">
          View ${senderName}'s Public Profile →
        </a>
      </p>
      
      <p style="margin-top: 30px; font-size: 12px; color: #999;">
        This invitation expires on ${new Date(expiresAt).toLocaleDateString()}.<br/>
        If you didn't expect this invitation, you can safely ignore it.
      </p>
    </div>
    
    <div class="footer">
      <p style="text-align: center; margin-top: 20px;">
        © 2025 LifeSync. All rights reserved. | Powered by Salatiso Ecosystem
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Configure email transporter (using environment variables)
    // For development, you can use Ethereal Email
    // For production, use SendGrid, Gmail, or other SMTP service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Sonny Network" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: emailSubject,
      html: emailBody,
      replyTo: senderEmail,
    });

    return res.status(200).json({ success: true, message: 'Invitation email sent successfully' });
  } catch (error) {
    console.error('Error sending invitation email:', error);
    return res.status(500).json({ 
      error: 'Failed to send invitation email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
