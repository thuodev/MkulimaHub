import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "MkulimaHub <onboarding@resend.dev>";

export const sendEmployeeCredentialsEmail = async (
  toEmail,
  name,
  farmName,
  tempPassword,
) => {
  const loginUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: toEmail,
    subject: `You've been added to ${farmName} on MkulimaHub`,
    html: `
      <p>Hi ${name},</p>
      <p>You've been added as a member of <strong>${farmName}</strong> on MkulimaHub.</p>
      <p>Your login details:</p>
      <ul>
        <li><strong>Email:</strong> ${toEmail}</li>
        <li><strong>Temporary password:</strong> ${tempPassword}</li>
      </ul>
      <p>Log in at <a href="${loginUrl}/login">${loginUrl}/login</a> and change your password once you're in.</p>
    `,
  });
};

export const sendPasswordResetEmail = async (toEmail, name, resetToken) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: toEmail,
    subject: "Reset your MkulimaHub password",
    html: `
      <p>Hi ${name},</p>
      <p>Someone requested a password reset for your MkulimaHub account. If this was you, click the link below — it expires in 1 hour:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });
};
