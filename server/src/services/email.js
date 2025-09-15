// server/src/services/email.js
import nodemailer from "nodemailer";

function getEmailConfig() {
  const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
  const EMAIL_PORT = Number(process.env.EMAIL_PORT || 587);
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn("Email credentials not fully configured (EMAIL_USER or EMAIL_PASS missing).");
  }

  return {
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465, // true for 465, false for 587
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  };
}

/**
 * sendEmail({ to, subject, text, html })
 * returns messageId (nodemailer response.messageId)
 */
export async function sendEmail({ to, subject, text, html }) {
  const config = getEmailConfig();
  
  if (!config.auth.user || !config.auth.pass) {
    throw new Error("Email service not configured (EMAIL_USER/EMAIL_PASS missing).");
  }

  const transporter = nodemailer.createTransport(config);

  const mailOptions = {
    from: `"KaamKarlo" <${config.auth.user}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // info.messageId is good, info.accepted contains recipients
    console.info("Email sent:", { messageId: info.messageId, accepted: info.accepted });
    return info.messageId || JSON.stringify(info);
  } catch (err) {
    console.error("Nodemailer error:", err.response || err.message || err);
    throw new Error(err.message || "Failed to send email.");
  }
}
