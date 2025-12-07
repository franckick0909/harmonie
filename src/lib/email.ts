import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Harmonie <onboarding@resend.dev>', // Domaine de test Resend
            to,
            subject,
            html,
        });

        if (error) {
            console.error('Failed to send email:', error);
            throw new Error(error.message);
        }

        return data;
    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
}
