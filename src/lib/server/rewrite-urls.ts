// src/lib/server/rewrite-urls.ts

const BACKEND_URL = 'https://api.kevingillispie.com';
const FRONTEND_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kevingillispie.com';

/**
 * Converts any full backend URL into either:
 * - A clean /media/... path (for images)
 * - The frontend domain (for canonical, og:url, etc.)
 */
export function rewriteWpUrl(url: string | undefined | null): string | undefined {
    if (!url || typeof url !== 'string') return undefined;

    // 1. Clean up double slashes (excluding the protocol https://)
    const sanitizedUrl = url.replace(/([^:]\/)\/+/g, "$1");

    if (sanitizedUrl.includes(BACKEND_URL)) {
        if (sanitizedUrl.includes('/wp-content/uploads/')) {
            const uploadPath = sanitizedUrl.split('/wp-content/uploads/')[1];
            return uploadPath ? `/media/${uploadPath}` : sanitizedUrl;
        }
        return sanitizedUrl.replace(BACKEND_URL, FRONTEND_URL);
    }

    return sanitizedUrl;
}

/**
 * Rewrites the entire seo object from Yoast
 */
export function rewriteSeoObject(seo: any): any {
    if (!seo || typeof seo !== 'object') return seo;

    const rewritten = { ...seo };

    // Rewrite top-level URL fields
    if (rewritten.canonical) {
        rewritten.canonical = rewriteWpUrl(rewritten.canonical);
    }

    // Handle opengraphImage
    if (rewritten.opengraphImage?.sourceUrl) {
        rewritten.opengraphImage = {
            ...rewritten.opengraphImage,
            sourceUrl: rewriteWpUrl(rewritten.opengraphImage.sourceUrl),
        };
    }

    // Handle twitterImage
    if (rewritten.twitterImage?.sourceUrl) {
        rewritten.twitterImage = {
            ...rewritten.twitterImage,
            sourceUrl: rewriteWpUrl(rewritten.twitterImage.sourceUrl),
        };
    }

    return rewritten;
}