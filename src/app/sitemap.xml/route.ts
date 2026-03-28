// app/sitemap.xml/route.ts
import { wpQuery } from '@/lib/graphql';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kevingillispie.com';

const GET_SITEMAP_DATA = `
    query GetSitemapData($first: Int = 500) {
        posts(
            first: $first
            where: { 
                status: PUBLISH,
                orderby: { field: DATE, order: DESC }
            }
        ) {
            nodes {
                slug
                modified
            }
        }
    }
`;

async function getSitemapData() {
    try {
        const data = await wpQuery<any>(GET_SITEMAP_DATA, { first: 500 });
        return data?.posts?.nodes ?? [];
    } catch (error) {
        console.error('[Sitemap] GraphQL error:', error);
        return [];
    }
}

export async function GET() {
    const posts = await getSitemapData();

    // Static routes — easy to maintain in one place
    const staticRoutes = [
        { loc: baseUrl, changefreq: 'yearly', priority: '1.0' },
        { loc: `${baseUrl}/blog`, changefreq: 'weekly', priority: '0.9' },
        { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.8' },
        // Add new static pages here as your site grows
    ];

    const staticUrls = staticRoutes.map((route) => ({
        loc: route.loc,
        lastmod: new Date().toISOString(),
        changefreq: route.changefreq,
        priority: route.priority,
    }));

    const postUrls = posts.map((post: any) => ({
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod: new Date(post.modified || Date.now()).toISOString(),
        changefreq: 'monthly',
        priority: '0.7',
    }));

    const allUrls = [...staticUrls, ...postUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allUrls
            .map(
                (url) => `<url>
                        <loc>${url.loc}</loc>
                        <lastmod>${url.lastmod}</lastmod>
                        <changefreq>${url.changefreq}</changefreq>
                        <priority>${url.priority}</priority>
                    </url>`
            )
            .join('\n')}
        </urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}