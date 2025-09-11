import nodemailer from 'nodemailer';

const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || '';
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpSecure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true;
const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER || '';

let transporter = null;

function createConfiguredTransport() {
  if (smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: { user: smtpUser, pass: smtpPass },
    });
  }
  return null;
}

async function getTransport() {
  if (transporter) return transporter;
  transporter = createConfiguredTransport();
  if (transporter) return transporter;
  // Fallback to Ethereal test account for development visibility
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
  return transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  const tx = await getTransport();
  const info = await tx.sendMail({ from: fromEmail || 'no-reply@example.com', to, subject, html, text });
  // If Ethereal was used, include preview URL in messageId for easy access
  const preview = nodemailer.getTestMessageUrl(info);
  return preview || info.messageId;
}


