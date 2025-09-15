// server/src/services/whatsapp.js
import axios from "axios";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

/**
 * Returns true when env vars exist
 */
export function isWhatsAppConfigured() {
  return !!WHATSAPP_TOKEN && !!PHONE_NUMBER_ID;
}

/**
 * Send a template message using Meta Cloud API (v20.0+)
 * @param {object} opts
 * @param {string} opts.to - E.164 phone number string (e.g. "+919876543210")
 * @param {string} opts.templateName - Template name approved in Meta (e.g. "booking_confirmation")
 * @param {string} opts.language - language code (e.g. "en_US")
 * @param {Array<{type?:string, text?:string}>} opts.componentsParams - array of parameter objects matching template body placeholders
 *
 * Returns API response object (or throws error)
 */
export async function sendWhatsAppTemplateMessage({
  to,
  templateName,
  language = "en_US",
  componentsParams = [], // e.g. [{ type: "text", text: "Rajesh" }, ...]
}) {
  if (!isWhatsAppConfigured()) {
    throw new Error("WhatsApp service is not configured on the server.");
  }

  if (!to || !/^\+\d{7,15}$/.test(to)) {
    throw new Error("Invalid 'to' phone number. Use E.164 format (e.g. +919876543210).");
  }

  const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: language },
      components: [
        {
          type: "body",
          parameters: componentsParams,
        },
      ],
    },
  };

  try {
    const resp = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    // Graph API returns messages array with id on success
    return resp.data;
  } catch (err) {
    const metaErr = err.response?.data || err.message;
    // Log more details on server
    console.error("WhatsApp API error:", JSON.stringify(metaErr, null, 2));
    throw new Error(
      metaErr?.error?.message || metaErr?.error || String(metaErr) || "WhatsApp API Error"
    );
  }
}
