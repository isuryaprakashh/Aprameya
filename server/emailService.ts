import nodemailer from 'nodemailer';

export const OFFICIAL_CLUB_EMAIL = process.env.EMAIL_FROM || 'aprameya.techclub@kluniversity.in';

interface EventRegistrationEmailData {
  userEmail: string;
  userName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
}

interface EventCancellationEmailData {
  userEmail: string;
  userName: string;
  eventTitle: string;
  eventDate: string;
}

interface PasswordResetOtpData {
  userEmail: string;
  userName: string;
  otp: string;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;

  if (user && pass) {
    return nodemailer.createTransport({
      host: host || 'smtp.gmail.com',
      port: port,
      secure: port === 465,
      auth: { user, pass }
    });
  }
  return null;
}

export async function sendPasswordResetOtpEmail({
  userEmail,
  userName,
  otp
}: PasswordResetOtpData): Promise<boolean> {
  const fromAddress = OFFICIAL_CLUB_EMAIL;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #0a0a0a; color: #ededed; border: 1px solid #222222; border-radius: 12px;">
      <div style="margin-bottom: 24px; text-align: center;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.05em; color: #ffffff; text-transform: uppercase;">APRAMEYA</h2>
        <p style="margin: 4px 0 0; font-size: 11px; color: #888888; font-family: monospace; letter-spacing: 0.1em; text-transform: uppercase;">AI & Autonomous Systems Club • KL University</p>
      </div>

      <div style="padding: 24px; background: #121212; border: 1px solid #262626; border-radius: 8px; margin-bottom: 24px;">
        <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 16px; color: #ffffff;">Password Reset Verification Code</h3>
        <p style="margin: 0 0 16px; font-size: 13px; color: #a1a1aa; line-height: 1.5;">
          Hello ${userName || 'Student'}, a password reset request was initiated for your Aprameya portal account. Enter the 6-digit verification code below to set a new password:
        </p>

        <div style="text-align: center; margin: 24px 0; padding: 18px; background: #000000; border: 1px dashed #404040; border-radius: 8px;">
          <div style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #ffffff; font-family: monospace;">${otp}</div>
          <p style="margin: 8px 0 0; font-size: 11px; color: #71717a; font-family: monospace;">VALID FOR 10 MINUTES • DO NOT SHARE</p>
        </div>

        <p style="margin: 0; font-size: 12px; color: #71717a; line-height: 1.5;">
          If you did not request this verification code, your account is safe and you can safely disregard this message.
        </p>
      </div>

      <div style="text-align: center; font-size: 11px; color: #52525b; border-top: 1px solid #1f1f23; padding-top: 16px;">
        <p style="margin: 0;">Official Dispatch from ${fromAddress}</p>
        <p style="margin: 4px 0 0;">R609e, R&D Block, KL University</p>
      </div>
    </div>
  `;

  console.log(`\n======================================================`);
  console.log(`📬 [PASSWORD RESET OTP DISPATCH]`);
  console.log(`To: ${userEmail} (${userName})`);
  console.log(`From: ${fromAddress}`);
  console.log(`Verification OTP: >>> ${otp} <<<`);
  console.log(`Expiry: 10 minutes`);
  console.log(`======================================================\n`);

  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Aprameya Club" <${fromAddress}>`,
        to: userEmail,
        subject: `[APRAMEYA] Your Password Reset Verification Code: ${otp}`,
        html: htmlContent
      });
      console.log(`✅ Reset OTP dispatched successfully via SMTP to ${userEmail}`);
    } catch (error) {
      console.error(`⚠️ SMTP dispatch error (code logged in console for fallback):`, error);
    }
  }

  return true;
}

export async function sendEventRegistrationEmail(data: EventRegistrationEmailData): Promise<void> {
  const fromAddress = OFFICIAL_CLUB_EMAIL;
  console.log(`📧 [EVENT EMAIL] Registration confirmed for ${data.userEmail} -> ${data.eventTitle}`);

  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Aprameya Club" <${fromAddress}>`,
        to: data.userEmail,
        subject: `Event Registration Confirmed - ${data.eventTitle}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #fff;">
            <h2>Registration Confirmed: ${data.eventTitle}</h2>
            <p>Hi ${data.userName}, you are confirmed for ${data.eventTitle} on ${data.eventDate} at ${data.eventTime} (${data.eventLocation}).</p>
          </div>
        `
      });
    } catch (e) {
      console.error('Failed to send registration email:', e);
    }
  }
}

export async function sendEventCancellationEmail(data: EventCancellationEmailData): Promise<void> {
  console.log(`📧 [EVENT EMAIL] Cancellation notice for ${data.userEmail} -> ${data.eventTitle}`);
}
