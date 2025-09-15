import { Router } from "express";
import Booking from "../models/Booking.js";
import { sendWhatsAppTemplateMessage, isWhatsAppConfigured } from "../services/whatsapp.js";
import { sendEmail } from "../services/email.js";

// --- START: NEW IMPORTS FOR GOOGLE SHEETS ---
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import path from 'path';
import fs from 'fs';
// --- END: NEW IMPORTS FOR GOOGLE SHEETS ---

const router = Router();
const memoryStore = [];
const useMemory = !process.env.MONGODB_URI;

// --- START: NEW GOOGLE SHEETS FUNCTION ---

// The ID of your Google Sheet (from its URL)
const SPREADSHEET_ID = '1PiUIU9xcuvGxogLIUgdyo9Ct4XoknRRpkQjfMLqS9d0'; // 👈 PASTE YOUR SHEET ID HERE

/**
 * Appends booking data to a Google Sheet.
 * @param {object} bookingData - The booking data object.
 */
async function appendToSheet(bookingData) {
  try {
    // Make sure your credentials file is in the /server directory
    const credentialsPath = path.resolve(process.cwd(), 'credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const row = [
      new Date().toISOString(), // Timestamp
      bookingData.name,
      bookingData.email || '-',
      bookingData.phone,
      bookingData.service,
      bookingData.address || '-',
      bookingData.message || '-',
      String(bookingData._id), // Booking ID
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1', // Will append to the first empty row of "Sheet1"
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [row],
      },
    });
    console.log('Booking successfully added to Google Sheet.');
  } catch (error) {
    // Log the error but don't stop the main booking process
    console.error('Error writing to Google Sheet:', error.message);
  }
}
// --- END: NEW GOOGLE SHEETS FUNCTION ---


function buildMessages(booking) {
  const createdAt = new Date(booking.createdAt).toLocaleString();
  const subject = `✅ Booking Confirmed - ${booking.service}`;
  const text = `Hello ${booking.name},\n\nYour booking has been received.\n\nService: ${booking.service}\nPhone: ${booking.phone}\nEmail: ${booking.email || '-'}\nAddress: ${booking.address || '-'}\nMessage: ${booking.message || '-'}\nBooking ID: ${booking._id}\nCreated: ${createdAt}\n\nWe will contact you shortly.\n\nTricity Solutions`;
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; margin-bottom: 0;">
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">
        ✅ Booking Confirmed
      </h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
        Thank you for choosing Tricity Solutions
      </p>
    </div>
    
    <!-- Main Content -->
    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      
      <!-- Greeting -->
      <div style="margin-bottom: 25px;">
        <h2 style="color: #28a745; margin: 0 0 10px 0; font-size: 22px;">
          Hello ${booking.name}! 👋
        </h2>
        <p style="color: #6c757d; margin: 0; font-size: 16px;">
          Your booking has been successfully received and is being processed.
        </p>
      </div>
      
      <!-- Service Badge -->
      <div style="background: #e8f5e8; color: #155724; padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center; border-left: 5px solid #28a745;">
        <h3 style="margin: 0; font-size: 20px; font-weight: bold;">
          🛠️ ${booking.service}
        </h3>
        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">
          Service Requested
        </p>
      </div>
      
      <!-- Booking Details -->
      <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e9ecef;">
        <h3 style="color: #495057; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #dee2e6; padding-bottom: 10px;">
          📋 Booking Details
        </h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #007bff;">
            <strong style="color: #007bff; display: block; margin-bottom: 5px;">📞 Phone</strong>
            <span style="color: #495057; font-size: 16px;">${booking.phone}</span>
          </div>
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #6f42c1;">
            <strong style="color: #6f42c1; display: block; margin-bottom: 5px;">📧 Email</strong>
            <span style="color: #495057; font-size: 16px;">${booking.email || 'Not provided'}</span>
          </div>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #fd7e14; margin-bottom: 15px;">
          <strong style="color: #fd7e14; display: block; margin-bottom: 5px;">📍 Address</strong>
          <span style="color: #495057; font-size: 16px;">${booking.address || 'Not provided'}</span>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #20c997; margin-bottom: 15px;">
          <strong style="color: #20c997; display: block; margin-bottom: 5px;">💬 Message</strong>
          <span style="color: #495057; font-size: 16px;">${booking.message || 'No additional message'}</span>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107;">
            <strong style="color: #ffc107; display: block; margin-bottom: 5px;">🆔 Booking ID</strong>
            <span style="color: #495057; font-family: monospace; font-size: 14px;">${booking._id}</span>
          </div>
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #6c757d;">
            <strong style="color: #6c757d; display: block; margin-bottom: 5px;">⏰ Created</strong>
            <span style="color: #495057; font-size: 14px;">${createdAt}</span>
          </div>
        </div>
      </div>
      
      <!-- Next Steps -->
      <div style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: white; padding: 25px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; font-size: 18px;">
          🚀 What's Next?
        </h3>
        <p style="margin: 0; font-size: 16px; opacity: 0.9;">
          Our team will contact you within 24 hours to confirm the details and schedule your service.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding-top: 20px; border-top: 2px solid #e9ecef; color: #6c757d; font-size: 14px;">
        <p style="margin: 0;">
          <strong>Tricity Solutions</strong> - Professional Home Services
        </p>
        <p style="margin: 5px 0 0 0;">
          Thank you for trusting us with your home improvement needs!
        </p>
      </div>
      
    </div>
  </body>
  </html>`;
  return { subject, text, html };
}

function buildAdminMessages(booking) {
  const createdAt = new Date(booking.createdAt).toLocaleString();
  const subject = `🔔 New Booking Alert - ${booking.service}`;
  const text = `🚨 NEW BOOKING RECEIVED!\n\nCustomer Details:\nName: ${booking.name}\nPhone: ${booking.phone}\nEmail: ${booking.email || 'Not provided'}\nService: ${booking.service}\nAddress: ${booking.address || 'Not provided'}\nMessage: ${booking.message || 'No message'}\nBooking ID: ${booking._id}\nCreated: ${createdAt}\n\n⚠️ ACTION REQUIRED: Please contact the customer to confirm the booking.\n\nTricity Solutions Admin Panel`;
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking Alert</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; margin-bottom: 0;">
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">
        🔔 New Booking Alert
      </h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
        Tricity Solutions Admin Panel
      </p>
    </div>
    
    <!-- Main Content -->
    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      
      <!-- Service Badge -->
      <div style="background: #e3f2fd; color: #1976d2; padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: center; border-left: 5px solid #2196f3;">
        <h2 style="margin: 0; font-size: 20px; font-weight: bold;">
          🛠️ ${booking.service}
        </h2>
      </div>
      
      <!-- Customer Details -->
      <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e9ecef;">
        <h3 style="color: #495057; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #dee2e6; padding-bottom: 10px;">
          👤 Customer Information
        </h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #28a745;">
            <strong style="color: #28a745; display: block; margin-bottom: 5px;">👤 Name</strong>
            <span style="color: #495057; font-size: 16px;">${booking.name}</span>
          </div>
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #007bff;">
            <strong style="color: #007bff; display: block; margin-bottom: 5px;">📞 Phone</strong>
            <span style="color: #495057; font-size: 16px;">${booking.phone}</span>
          </div>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin-bottom: 15px;">
          <strong style="color: #ffc107; display: block; margin-bottom: 5px;">📧 Email</strong>
          <span style="color: #495057; font-size: 16px;">${booking.email || 'Not provided'}</span>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #6f42c1; margin-bottom: 15px;">
          <strong style="color: #6f42c1; display: block; margin-bottom: 5px;">📍 Address</strong>
          <span style="color: #495057; font-size: 16px;">${booking.address || 'Not provided'}</span>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #fd7e14;">
          <strong style="color: #fd7e14; display: block; margin-bottom: 5px;">💬 Message</strong>
          <span style="color: #495057; font-size: 16px;">${booking.message || 'No message'}</span>
        </div>
      </div>
      
      <!-- Booking Details -->
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #ffeaa7;">
        <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 16px;">
          📋 Booking Details
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <strong style="color: #856404; display: block; margin-bottom: 5px;">🆔 Booking ID</strong>
            <span style="color: #495057; font-family: monospace; background: white; padding: 5px 10px; border-radius: 4px; font-size: 14px;">${booking._id}</span>
          </div>
          <div>
            <strong style="color: #856404; display: block; margin-bottom: 5px;">⏰ Created</strong>
            <span style="color: #495057; font-size: 14px;">${createdAt}</span>
          </div>
        </div>
      </div>
      
      <!-- Action Required -->
      <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 25px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; font-size: 18px;">
          ⚠️ Action Required
        </h3>
        <p style="margin: 0; font-size: 16px; opacity: 0.9;">
          Please contact the customer to confirm the booking and schedule the service.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding-top: 20px; border-top: 2px solid #e9ecef; color: #6c757d; font-size: 14px;">
        <p style="margin: 0;">
          <strong>Tricity Solutions</strong> - Professional Home Services
        </p>
        <p style="margin: 5px 0 0 0;">
          This is an automated notification. Please do not reply to this email.
        </p>
      </div>
      
    </div>
  </body>
  </html>`;
  return { subject, text, html };
}

function validateE164(phone) {
  return /^\+[1-9]\d{7,14}$/.test(phone || "");
}

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, address, service, message } = req.body || {};
    if (!name || !phone || !service) {
      return res
        .status(400)
        .json({ error: "Missing required fields: name, phone, service" });
    }
    if (!validateE164(phone)) {
      return res
        .status(400)
        .json({
          error: "Phone must be in E.164 format, e.g. +91XXXXXXXXXX",
        });
    }

    let booking;
    if (useMemory) {
      booking = {
        _id: String(Date.now()),
        name, email, phone, address, service, message,
        status: "pending",
        notification: { whatsapp: "pending", email: "pending" },
        createdAt: new Date(),
      };
      memoryStore.push(booking);
    } else {
      booking = await Booking.create({ name, email, phone, address, service, message });
    }
    
    // --- NEW: Call the function to update Google Sheets ---
    // We call it here so it has the booking._id
    appendToSheet(booking);
    // --- END: NEW CODE ---

    const { subject, text, html } = buildMessages(booking);
    const { subject: adminSubject, text: adminText, html: adminHtml } = buildAdminMessages(booking);

    const results = { whatsapp: null, email: null, adminEmail: null, errors: {} };
    const syncMode =
      (process.env.NOTIFY_SYNC || "").toLowerCase() === "true" ||
      req.query.sync === "1";

    // --- WhatsApp ---
    if (!isWhatsAppConfigured()) {
      booking.notification.whatsapp = "failed";
      results.errors.whatsapp =
        "WhatsApp not configured. Set WHATSAPP_TOKEN and WHATSAPP_PHONE_NUMBER_ID.";
    } else {
      try {
        const resp = await sendWhatsAppTemplateMessage({
          to: phone,
          templateName: "booking_confirmation", // 👈 must match your approved template
          language: "en_US",
          componentsParams: [
            { type: "text", text: name },
            { type: "text", text: service },
            { type: "text", text: booking._id.toString() },
          ],
        });
        results.whatsapp = resp.messages?.[0]?.id || "sent";
        booking.notification.whatsapp = "sent";
      } catch (err) {
        booking.notification.whatsapp = "failed";
        booking.status = "failed";
        results.errors.whatsapp = err.message;
        req.log?.error({ err }, "WhatsApp send failed");
      }
    }

    // --- Email ---
    try {
      if (email) {
        const messageId = await sendEmail({ to: email, subject, text, html });
        results.email = messageId;
        booking.notification.email = "sent";
      }
    } catch (err) {
      booking.notification.email = "failed";
      booking.status = "failed";
      results.errors.email = err?.message || "Unknown Email error";
      req.log?.error({ err }, "Email send failed");
    }

    // --- Admin Email ---
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        const adminMessageId = await sendEmail({ 
          to: adminEmail, 
          subject: adminSubject, 
          text: adminText, 
          html: adminHtml 
        });
        results.adminEmail = adminMessageId;
        console.info("Admin notification sent:", { messageId: adminMessageId, to: adminEmail });
      } else {
        console.warn("Admin email not configured (ADMIN_EMAIL missing)");
        results.errors.adminEmail = "Admin email not configured";
      }
    } catch (err) {
      results.errors.adminEmail = err?.message || "Unknown Admin Email error";
      req.log?.error({ err }, "Admin email send failed");
    }

    if (!useMemory) {
      if (
        booking.notification.whatsapp === "sent" ||
        booking.notification.email === "sent"
      ) {
        booking.status = "confirmed";
      }
      await booking.save();
    }

    return res.status(201).json({
      success: true,
      bookingId: booking._id,
      status: booking.status,
      notification: booking.notification,
      results,
      mode: syncMode ? "sync" : "async",
    });
  } catch (err) {
    req.log?.error({ err }, "Create booking failed");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;