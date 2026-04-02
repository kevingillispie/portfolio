// src/app/actions/contact.ts
'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const formSchema = z.object({
    name: z.string().min(2).trim(),
    email: z.string().email().trim(),
    subject: z.string().min(2).trim(),
    message: z.string().min(10).max(500).trim(),
});

type FormState = {
    success: boolean;
    message: string;
} | null;

// Create Redis client from environment variables (injected by Vercel Upstash integration)
const redis = Redis.fromEnv();

const getRateLimiter = () => new Ratelimit({
    redis,                    // ← now uses @upstash/redis
    limiter: Ratelimit.slidingWindow(5, '60 m'), // 5 submissions per IP per hour
});

export async function sendContactForm(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    // ====================== RATE LIMITING ======================
    const ratelimit = getRateLimiter();

    const headersList = await headers();
    const ip = headersList
        .get('x-forwarded-for')
        ?.split(',')[0]
        ?.trim() || 'unknown';

    const { success: limitOk } = await ratelimit.limit(ip);

    if (!limitOk) {
        console.warn(`Rate limit exceeded for IP: ${ip}`);
        return {
            success: false,
            message: 'Too many requests. Please try again later.',
        };
    }

    // ====================== ANTI-SPAM LAYERS ======================
    // 1. Honeypot
    const honeypot = formData.get('website');
    if (honeypot && String(honeypot).trim().length > 0) {
        return { success: false, message: 'Invalid submission.' };
    }

    // 2. Timestamp check (2s < age < 30min)
    const timestampStr = formData.get('timestamp') as string | null;
    const timestamp = timestampStr ? parseInt(timestampStr, 10) : 0;
    const now = Math.floor(Date.now() / 1000);

    if (isNaN(timestamp) || now - timestamp < 2 || now - timestamp > 1800) {
        return { success: false, message: 'Invalid submission.' };
    }

    // 3. Cloudflare Turnstile verification
    const token = formData.get('cf-turnstile-response') as string | null;
    if (!token) {
        return { success: false, message: 'Please verify you are human.' };
    }

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            secret: process.env.TURNSTILE_SECRET_KEY!,
            response: token,
            remoteip: ip,
        }),
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
        console.warn('Turnstile verification failed:', verifyData);
        return { success: false, message: 'Invalid submission.' };
    }

    // ====================== NORMAL VALIDATION ======================
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

    // ====================== SEND TO CF7 ======================
    const formId = 55;
    const cf7Endpoint = `https://api.kevingillispie.com/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`;

    const body = new FormData();
    body.append('_wpcf7_unit_tag', `wpcf7-f${formId}-p0-o1`);
    body.append('sender-name', name);
    body.append('sender-email', email);
    body.append('sender-subject', subject);
    body.append('sender-message', message);

    try {
        const response = await fetch(cf7Endpoint, { method: 'POST', body });
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