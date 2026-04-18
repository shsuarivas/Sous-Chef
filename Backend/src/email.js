import { Resend } from 'resend';

// eslint-disable-next-line no-undef
const resend = new Resend(process.env.RESEND_API_KEY);
// eslint-disable-next-line no-undef
const FROM = process.env.EMAIL_FROM || 'noreply@byteyourfork.com';

export async function sendPasswordResetEmail(toEmail, code) {
    await resend.emails.send({
        from: FROM,
        to: toEmail,
        subject: 'Reset your Byte Your Fork password',
        html: `
            <h2>Password Reset</h2>
            <p>Your password reset code is:</p>
            <h1 style="letter-spacing: 8px;">${code}</h1>
            <p>This code expires in 30 minutes. If you did not request this, you can ignore this email.</p>
        `
    });
}

export async function sendMFACodeEmail(toEmail, code) {
    await resend.emails.send({
        from: FROM,
        to: toEmail,
        subject: 'Your Byte Your Fork verification code',
        html: `
            <h2>Verification Code</h2>
            <p>Your one-time login code is:</p>
            <h1 style="letter-spacing: 8px;">${code}</h1>
            <p>This code expires in 10 minutes. Do not share it with anyone.</p>
        `
    });
}
