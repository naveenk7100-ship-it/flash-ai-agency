import { WhatsAppNotificationResult, EmailNotificationResult } from "./types";

/**
 * Real WhatsApp & Email Notification Dispatcher
 * Strictly complies with instructions:
 * - Never fakes success.
 * - Accurately reports missing credentials or approved API setups.
 */

export async function sendWhatsAppAlert(message: {
  leadName: string;
  leadEmail: string;
  serviceType: string;
  brief: string;
}): Promise<WhatsAppNotificationResult> {
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const recipient = process.env.WHATSAPP_RECIPIENT_PHONE;

  if (!phoneId || !accessToken || !recipient) {
    const missing: string[] = [];
    if (!phoneId) missing.push("WHATSAPP_PHONE_ID");
    if (!accessToken) missing.push("WHATSAPP_ACCESS_TOKEN");
    if (!recipient) missing.push("WHATSAPP_RECIPIENT_PHONE");

    return {
      sent: false,
      provider: "unconfigured",
      reason: `WhatsApp Cloud API credentials unconfigured: Missing [${missing.join(", ")}]. Set in .env to enable instant live WhatsApp pings.`
    };
  }

  try {
    const textBody = `🚨 *New FLASH.Ai Agency Inquiry*\n\n👤 *Client:* ${message.leadName}\n📧 *Email:* ${message.leadEmail}\n🛠️ *Service:* ${message.serviceType}\n📝 *Brief:* ${message.brief}`;

    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: recipient,
        type: "text",
        text: { body: textBody }
      })
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        sent: false,
        provider: "whatsapp_cloud_api",
        reason: data.error?.message || "Meta WhatsApp Cloud API rejected the payload."
      };
    }

    return {
      sent: true,
      provider: "whatsapp_cloud_api",
      recipient
    };
  } catch (err: any) {
    return {
      sent: false,
      provider: "whatsapp_cloud_api",
      reason: err?.message || "Failed to reach Meta WhatsApp endpoint."
    };
  }
}

export async function sendEmailAlert(message: {
  leadName: string;
  leadEmail: string;
  serviceType: string;
  brief: string;
}): Promise<EmailNotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.AGENCY_NOTIFICATION_EMAIL || "contact@flashai.agency";

  if (!apiKey) {
    return {
      sent: false,
      provider: "unconfigured",
      reason: "Resend Email API unconfigured: Missing RESEND_API_KEY in environment variables."
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "FLASH.Ai Agency <leads@resend.dev>",
        to: [toEmail],
        subject: `[FLASH.Ai] New Lead: ${message.leadName} (${message.serviceType})`,
        text: `New project inquiry received:\n\nName: ${message.leadName}\nEmail: ${message.leadEmail}\nService: ${message.serviceType}\nBrief:\n${message.brief}`
      })
    });

    if (!res.ok) {
      const err = await res.text();
      return {
        sent: false,
        provider: "resend",
        reason: `Resend API error: ${err}`
      };
    }

    return {
      sent: true,
      provider: "resend"
    };
  } catch (err: any) {
    return {
      sent: false,
      provider: "resend",
      reason: err?.message || "Network exception sending email alert."
    };
  }
}
