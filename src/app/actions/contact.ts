// src/app/actions/contact.ts
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

const formSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().min(2),
    message: z.string().min(10).max(500),
});

type FormState = {
    success: boolean;
    message: string
} | null;

export async function sendContactForm(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const validated = formSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
    });

    if (!validated.success) {
        return { success: false, message: 'Please check the form fields.' };
    }

    const { name, email, subject, message } = validated.data;

    const formId = 55;

    const cf7Endpoint = `https://api.kevingillispie.com/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`;

    const body = new FormData();
    body.append('_wpcf7_unit_tag', `wpcf7-f${formId}-p0-o1`);
    body.append('sender-name', name);
    body.append('sender-email', email);
    body.append('sender-subject', subject);
    body.append('sender-message', message);

    try {
        const response = await fetch(cf7Endpoint, {
            method: 'POST',
            body,
        });

        const result = await response.json();

        if (result.status === 'mail_sent') {
            return {
                success: true,
                message: result.message || 'Thank you! Your message has been sent successfully.',
            };

        } else {
            console.error('CF7 error:', result);
            return {
                success: false,
                message: result.message || 'The form could not be sent.',
            };
        }
    } catch (error) {
        console.error('Contact form submission error:', error);
        return {
            success: false,
            message: 'Failed to connect to the server. Please try again later.',
        };
    }
}