import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

export const sendPasswordResetEmail = async (email, resetToken, frontendBaseUrl) => {
  const resetLink = `${frontendBaseUrl.replace(/\/$/, '')}/reset-password?token=${resetToken}`;
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@example.com',
    to: email,
    subject: 'Password Reset - GUVI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <p><a href="${resetLink}" style="color: #007bff;">Reset Password</a></p>
        <p>Or copy this link: ${resetLink}</p>
        <p>This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
        <hr/>
        <p style="color: #6c757d;">Skill Up. Level Up. - GUVI</p>
      </div>
    `,
    text: `Password Reset: ${resetLink} (expires in 1 hour)`,
  };

  if (transporter) {
    await transporter.sendMail(mailOptions);
    return { sent: true };
  }
  console.log('[DEV] Password reset link (no SMTP configured):', resetLink);
  return { sent: false, devLink: resetLink };
};
