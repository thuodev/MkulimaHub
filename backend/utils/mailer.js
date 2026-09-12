import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendEmployeeCredentialsEmail = async (
  toEmail,
  name,
  farmName,
  tempPassword,
) => {
  const loginUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  await transporter.sendMail({
    from: `"MkulimaHub" <${process.env.GMAIL_USER}>`,
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
