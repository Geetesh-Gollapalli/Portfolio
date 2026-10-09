/**
 * Serverless Function Handler for Contact Form Submissions
 * Compatible with Vercel, Netlify Functions, and Node.js Express server
 */

export interface ContactRequestBody {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const TARGET_EMAIL = 'geeteshgollapalli@gmail.com';

/**
 * Standard serverless handler
 */
export async function handleContactSubmission(body: ContactRequestBody) {
  const { name, email, subject, message } = body;

  if (!name || !email || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Missing required parameters: name, email, and message are required.',
      }),
    };
  }

  const cleanSubject = subject?.trim() || 'Portfolio Collaboration Inquiry';
  const mailSubject = `[Portfolio Signal from ${name}]: ${cleanSubject}`;

  // Forward to FormSubmit or Formspree webhook
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        _replyto: email,
        _subject: mailSubject,
        message,
        _template: 'table',
      }),
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        recipient: TARGET_EMAIL,
        timestamp: new Date().toISOString(),
        details: data,
      }),
    };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to relay email packet',
        details: errorMsg,
        recipient: TARGET_EMAIL,
      }),
    };
  }
}
