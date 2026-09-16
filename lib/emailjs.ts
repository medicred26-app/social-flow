export interface SendOtpParams {
  toEmail: string;
  toName: string;
  otp: string;
}

export const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_ju07k4r',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_scew9gb',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'otVTMOVNTqwtD8-kl'
};

/**
 * Sends a 6-digit OTP verification email to the user using EmailJS API.
 */
export async function sendOtpEmail({ toEmail, toName, otp }: SendOtpParams): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      service_id: EMAILJS_CONFIG.serviceId,
      template_id: EMAILJS_CONFIG.templateId,
      user_id: EMAILJS_CONFIG.publicKey,
      template_params: {
        to_email: toEmail,
        to_name: toName || toEmail.split('@')[0],
        user_name: toName || toEmail.split('@')[0],
        email: toEmail,
        user_email: toEmail,
        otp: otp,
        passcode: otp,
        code: otp,
        verification_code: otp,
        otp_code: otp
      }
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log(`[EmailJS] OTP email successfully dispatched to ${toEmail}`);
      return { success: true };
    }

    const responseText = await response.text();
    console.warn('[EmailJS] API returned non-OK status:', responseText);

    // Fallback: try calling backend send-otp endpoint if client direct fetch encounters CORS or issue
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const backendRes = await fetch(`${backendUrl}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: toEmail, name: toName, otp })
    });

    const backendData = await backendRes.json().catch(() => null);
    if (backendRes.ok && backendData?.success) {
      return { success: true };
    }

    return { 
      success: false, 
      error: responseText || backendData?.message || 'EmailJS service response error.' 
    };
  } catch (err: any) {
    console.error('[EmailJS] Error sending OTP email:', err);
    return { success: false, error: err?.message || 'Failed to dispatch email verification OTP.' };
  }
}
