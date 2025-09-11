import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM || '';

let client = null;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

export const isWhatsAppConfigured = Boolean(accountSid && authToken && whatsappFrom);

export async function sendWhatsAppMessage({ to, body }) {
  if (!client || !isWhatsAppConfigured) {
    const why = [];
    if (!accountSid) why.push('TWILIO_ACCOUNT_SID');
    if (!authToken) why.push('TWILIO_AUTH_TOKEN');
    if (!whatsappFrom) why.push('TWILIO_WHATSAPP_FROM');
    const missing = why.length ? `Missing: ${why.join(', ')}` : 'Client not initialized';
    const err = new Error(`Twilio client not configured. ${missing}`);
    err.code = 'TWILIO_NOT_CONFIGURED';
    throw err;
  }
  const toFormatted = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
  const message = await client.messages.create({ from: whatsappFrom, to: toFormatted, body });
  return message.sid;
}


