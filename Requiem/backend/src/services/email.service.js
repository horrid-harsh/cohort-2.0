import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";

/**
 * Send Email using Resend
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: `Requiem <${fromEmail}>`,
      to,
      subject,
      html,
    });

    return data;
  } catch (error) {
    console.error("Resend error:", error);
    return null;
  }
};

/**
 * Send Verification Email
 */
export const sendVerificationEmail = async (email, name, token) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const verificationLink = `${frontendUrl}/verify-email?token=${token}`;
  
  console.log(token);
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h1 style="color: #333;">Welcome to Requiem, ${name}!</h1>
      <p style="color: #666; font-size: 16px;">Please verify your email address to get started.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" 
           style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
           Verify Email Address
        </a>
      </div>
      <p style="color: #999; font-size: 12px;">This link will expire in 24 hours.</p>
    </div>
  `;

  return await sendEmail({ to: email, subject: "Verify your email - Requiem", html });
};