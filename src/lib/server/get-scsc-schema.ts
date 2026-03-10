// src/lib/server/get-scsc-schema.ts
import { cache } from 'react';

const FRONTEND_URL = 'https://kevingillispie.com';
const BACKEND_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://api.kevingillispie.com';

export const getScscSchema = cache(async (path: string): Promise<any[]> => {
    if (!path) return [];

    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const endpoint = `${BACKEND_URL.replace(/\/$/, '')}/wp-json/custom/v1/scsc-schema/?path=${encodeURIComponent(cleanPath)}`;

    try {
        const res = await fetch(endpoint, {
            next: { revalidate: 3600 },
            headers: { 'Accept': 'application/json' },
        });

        if (!res.ok) {
            console.warn(`SCSC schema fetch failed for ${path}: ${res.status}`);
            return [];
        }

        let data = await res.json();
        if (!Array.isArray(data)) data = [];

        // Replace backend domain → frontend domain in all URLs
        const fixedData = data.map((schema: any) => {
            if (!schema || typeof schema !== 'object') return schema;

            const jsonString = JSON.stringify(schema);
            const replaced = jsonString.replace(
                new RegExp(BACKEND_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                FRONTEND_URL
            );

            try {
                return JSON.parse(replaced);
            } catch (e) {
                console.warn('Schema replace/parse failed:', e);
                return schema; // fallback to original
            }
        });

        return fixedData;
    } catch (error) {
        console.error(`SCSC schema error for ${path}:`, error);
        return [];
    }
});