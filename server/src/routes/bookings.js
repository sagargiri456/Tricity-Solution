import { Router } from 'express';
import Booking from '../models/Booking.js';
import { sendWhatsAppMessage, isWhatsAppConfigured } from '../services/whatsapp.js';
import { sendEmail } from '../services/email.js';

const router = Router();
const memoryStore = [];
const useMemory = !process.env.MONGODB_URI;

function buildMessages(booking) {
  const createdAt = new Date(booking.createdAt).toLocaleString();
  const subject = `Booking Confirmation - ${booking.service}`;
  const text = `Hello ${booking.name},\n\nYour booking has been received.\n\nService: ${booking.service}\nPhone: ${booking.phone}\nEmail: ${booking.email || '-'}\nAddress: ${booking.address || '-'}\nMessage: ${booking.message || '-'}\nBooking ID: ${booking._id}\nCreated: ${createdAt}\n\nWe will contact you shortly.\n\nKaamKarlo.com`;
  const html = `<p>Hello <strong>${booking.name}</strong>,</p>
  <p>Your booking has been received.</p>
  <ul>
    <li><strong>Service:</strong> ${booking.service}</li>
    <li><strong>Phone:</strong> ${booking.phone}</li>
    <li><strong>Email:</strong> ${booking.email || '-'}</li>
    <li><strong>Address:</strong> ${booking.address || '-'}</li>
    <li><strong>Message:</strong> ${booking.message || '-'}</li>
    <li><strong>Booking ID:</strong> ${booking._id}</li>
    <li><strong>Created:</strong> ${createdAt}</li>
  </ul>
  <p>We will contact you shortly.</p>
  <p>KaamKarlo.com</p>`;
  const whatsapp = `Booking confirmed!\nService: ${booking.service}\nBooking ID: ${booking._id}\nWe will contact you soon. - KaamKarlo.com`;
  return { subject, text, html, whatsapp };
}

function validateE164(phone) {
  return /^\+[1-9]\d{7,14}$/.test(phone || '');
}

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, service, message } = req.body || {};
    if (!name || !phone || !service) {
      return res.status(400).json({ error: 'Missing required fields: name, phone, service' });
    }
    if (!validateE164(phone)) {
      return res.status(400).json({ error: 'Phone must be in E.164 format, e.g. +91XXXXXXXXXX' });
    }

    let booking;
    if (useMemory) {
      booking = {
        _id: String(Date.now()),
        name, email, phone, address, service, message,
        status: 'pending',
        notification: { whatsapp: 'pending', email: 'pending' },
        createdAt: new Date(),
      };
      memoryStore.push(booking);
    } else {
      booking = await Booking.create({ name, email, phone, address, service, message });
    }
    const { subject, text, html, whatsapp } = buildMessages(booking);

    const results = { whatsapp: null, email: null, errors: {} };
    const syncMode = ((process.env.NOTIFY_SYNC || '').toLowerCase() === 'true') || req.query.sync === '1';

    if (!isWhatsAppConfigured) {
      booking.notification.whatsapp = 'failed';
      results.errors.whatsapp = 'WhatsApp not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM.';
    }

    if (syncMode) {
      // Send synchronously so we can see real-time results in response
      try {
        if (phone && isWhatsAppConfigured) {
          const sid = await sendWhatsAppMessage({ to: phone, body: whatsapp });
          results.whatsapp = sid;
          booking.notification.whatsapp = 'sent';
        }
      } catch (err) {
        booking.notification.whatsapp = 'failed';
        booking.status = 'failed';
        results.errors.whatsapp = [
          err?.message,
          err?.code ? `code:${err.code}` : '',
          err?.status ? `status:${err.status}` : '',
          err?.moreInfo ? `info:${err.moreInfo}` : ''
        ].filter(Boolean).join(' ');
        req.log?.error({ err }, 'WhatsApp send failed (sync)');
      }
      try {
        if (email) {
          const messageId = await sendEmail({ to: email, subject, text, html });
          results.email = messageId;
          booking.notification.email = 'sent';
        }
      } catch (err) {
        booking.notification.email = 'failed';
        booking.status = 'failed';
        results.errors.email = err?.message || 'Unknown Email error';
        req.log?.error({ err }, 'Email send failed (sync)');
      }
      try {
        if (!useMemory) {
          if (booking.notification.whatsapp === 'sent' || booking.notification.email === 'sent') {
            booking.status = 'confirmed';
          }
          await booking.save();
        }
      } catch (err) {
        req.log?.error({ err }, 'Failed to update booking status (sync)');
      }
      return res.status(201).json({
        success: true,
        bookingId: booking._id,
        status: booking.status,
        notification: booking.notification,
        results,
        mode: 'sync'
      });
    }

    // Fire-and-forget style with persistence; respond success after enqueue
    const tasks = [];

    if (phone && isWhatsAppConfigured) {
      tasks.push(
        sendWhatsAppMessage({ to: phone, body: whatsapp })
          .then((sid) => {
            results.whatsapp = sid;
            booking.notification.whatsapp = 'sent';
          })
          .catch((err) => {
            booking.notification.whatsapp = 'failed';
            booking.status = 'failed';
            results.errors.whatsapp = [
              err?.message,
              err?.code ? `code:${err.code}` : '',
              err?.status ? `status:${err.status}` : '',
              err?.moreInfo ? `info:${err.moreInfo}` : ''
            ].filter(Boolean).join(' ');
            req.log?.error({ err }, 'WhatsApp send failed');
          })
      );
    }

    if (email) {
      tasks.push(
        sendEmail({ to: email, subject, text, html })
          .then((messageId) => {
            results.email = messageId;
            booking.notification.email = 'sent';
          })
          .catch((err) => {
            booking.notification.email = 'failed';
            booking.status = 'failed';
            results.errors.email = err?.message || 'Unknown Email error';
            req.log?.error({ err }, 'Email send failed');
          })
      );
    }

    Promise.allSettled(tasks).then(async () => {
      try {
        if (booking.notification.whatsapp === 'sent' || booking.notification.email === 'sent') {
          booking.status = 'confirmed';
        }
        if (!useMemory) {
          await booking.save();
        }
      } catch (err) {
        req.log?.error({ err }, 'Failed to update booking status');
      }
    });

    return res.status(201).json({
      success: true,
      bookingId: booking._id,
      status: booking.status,
      notification: booking.notification,
      results,
      mode: 'async'
    });
  } catch (err) {
    req.log?.error({ err }, 'Create booking failed');
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


