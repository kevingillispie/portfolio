import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kevingillispie.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // If you ever add private routes later:
            // disallow: ['/api/', '/draft/', '/admin/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}