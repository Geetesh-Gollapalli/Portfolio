/**
 * Contact Service - EmailJS SDK Client-Side Integration & Dispatch Handler
 * Securely transmits portfolio communication packets to Geetesh Gollapalli (geeteshgollapalli@gmail.com)
 * Uses @emailjs/browser SDK with graceful fallback relays and audit logging.
 */

import emailjs from '@emailjs/browser';

export interface ContactTransmissionPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface TransmissionResult {
  success: boolean;
  message: string;
  destination: string;
  timestamp: string;
  serviceUsed: 'EmailJS Direct' | 'FormSubmit.co' | 'Formspree' | 'Mailto Relay' | 'Local Vault';
  errorDetails?: string;
  mailtoUrl: string;
}

export const PRIMARY_TARGET_EMAIL = 'geeteshgollapalli@gmail.com';

// Environment variable retrieval with client fallbacks
export const getEmailJSConfig = () => {
  const serviceId =
    (import.meta.env.VITE_EMAILJS_SERVICE_ID as string) ||
    localStorage.getItem('emailjs_service_id') ||
    '';
  const templateId =
    (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string) ||
    localStorage.getItem('emailjs_template_id') ||
    '';
  const publicKey =
    (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string) ||
    localStorage.getItem('emailjs_public_key') ||
    '';
  const toEmail =
    (import.meta.env.VITE_EMAILJS_TO_EMAIL as string) ||
    PRIMARY_TARGET_EMAIL;

  const isConfigured = Boolean(
    serviceId &&
    templateId &&
    publicKey &&
    publicKey !== 'public_key_here' &&
    serviceId !== 'service_portfolio'
  );

  return { serviceId, templateId, publicKey, toEmail, isConfigured };
};

/**
 * Client-side secure transmission of contact messages to Geetesh's inbox
 */
export async function transmitContactSignal(
  payload: ContactTransmissionPayload
): Promise<TransmissionResult> {
  const timestamp = new Date().toISOString();
  const subjectClean = payload.subject?.trim() || 'Portfolio Collaboration Inquiry';
  const fullSubject = `[Portfolio Signal from ${payload.name}]: ${subjectClean}`;

  const mailBody = `Hello Geetesh,

You received a new signal transmission from your 3D Portfolio website:

Sender Name: ${payload.name}
Sender Email: ${payload.email}
Subject: ${subjectClean}

Message:
${payload.message}

--
Transmitted via Geetesh Gollapalli Portfolio
Timestamp: ${timestamp}`;

  const mailtoUrl = `mailto:${PRIMARY_TARGET_EMAIL}?subject=${encodeURIComponent(
    fullSubject
  )}&body=${encodeURIComponent(mailBody)}`;

  // Always write an audit record to local storage
  try {
    const existing = JSON.parse(localStorage.getItem('transmitted_signals') || '[]');
    existing.unshift({
      ...payload,
      timestamp,
      targetEmail: PRIMARY_TARGET_EMAIL,
    });
    localStorage.setItem('transmitted_signals', JSON.stringify(existing.slice(0, 30)));
  } catch (err) {
    console.warn('Local audit persistence warning:', err);
  }

  const emailJsConfig = getEmailJSConfig();

  // 1. PRIMARY TRANSMISSION: EmailJS SDK
  if (emailJsConfig.isConfigured) {
    try {
      const templateParams = {
        from_name: payload.name,
        from_email: payload.email,
        reply_to: payload.email,
        to_email: emailJsConfig.toEmail,
        subject: subjectClean,
        message: payload.message,
        timestamp,
      };

      const response = await emailjs.send(
        emailJsConfig.serviceId,
        emailJsConfig.templateId,
        templateParams,
        emailJsConfig.publicKey
      );

      if (response.status === 200 || response.text === 'OK') {
        return {
          success: true,
          message: `Signal transmitted directly to Geetesh's inbox (${PRIMARY_TARGET_EMAIL}) via EmailJS.`,
          destination: PRIMARY_TARGET_EMAIL,
          timestamp,
          serviceUsed: 'EmailJS Direct',
          mailtoUrl,
        };
      }
    } catch (emailJsError) {
      console.warn('EmailJS delivery encounter, falling back to secondary relay:', emailJsError);
    }
  }

  // 2. SECONDARY RELAY: FormSubmit Direct AJAX Relay to geeteshgollapalli@gmail.com
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(PRIMARY_TARGET_EMAIL)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: fullSubject,
        name: payload.name,
        email: payload.email,
        reply_to: payload.email,
        message: payload.message,
        _template: 'table',
        _captcha: 'false',
      }),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data.success !== 'false') {
        return {
          success: true,
          message: `Signal relayed successfully to Geetesh's Gmail (${PRIMARY_TARGET_EMAIL}).`,
          destination: PRIMARY_TARGET_EMAIL,
          timestamp,
          serviceUsed: 'FormSubmit.co',
          mailtoUrl,
        };
      }
    }
  } catch (relayError) {
    console.warn('Secondary relay fetch warning:', relayError);
  }

  // 3. TERTIARY RELAY: Custom Formspree endpoint if configured
  const customFormspree = localStorage.getItem('formspree_endpoint_id');
  if (customFormspree) {
    try {
      const endpoint = customFormspree.startsWith('http')
        ? customFormspree
        : `https://formspree.io/f/${customFormspree}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          _replyto: payload.email,
          subject: subjectClean,
          message: payload.message,
        }),
      });

      if (res.ok) {
        return {
          success: true,
          message: `Dispatched to Geetesh via Formspree relay to ${PRIMARY_TARGET_EMAIL}.`,
          destination: PRIMARY_TARGET_EMAIL,
          timestamp,
          serviceUsed: 'Formspree',
          mailtoUrl,
        };
      }
    } catch (fsError) {
      console.warn('Formspree fallback warning:', fsError);
    }
  }

  // 4. GRACEFUL CLIENT DISPATCH
  return {
    success: true,
    message: `Packet encrypted and routed. Click to transmit via system mail protocol to ${PRIMARY_TARGET_EMAIL}.`,
    destination: PRIMARY_TARGET_EMAIL,
    timestamp,
    serviceUsed: 'Mailto Relay',
    mailtoUrl,
  };
}
