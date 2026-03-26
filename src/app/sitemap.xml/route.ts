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

const BOT_KEYWORDS = [
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandex',
    'sogou', 'exabot', 'semrushbot', 'ahrefsbot', 'mj12bot', 'petalbot',
    'crawler', 'spider'
];

function isLikelyBot(userAgent: string): boolean {
    if (!userAgent) return false;
    const lower = userAgent.toLowerCase();
    if (/(chrome|safari|firefox|edge|opera)/.test(lower)) return false;
    return BOT_KEYWORDS.some(kw => lower.includes(kw));
}

export async function GET(request: Request) {
    const posts = await getSitemapData();

    const staticUrls = [
        { loc: baseUrl, lastmod: new Date().toISOString(), changefreq: 'monthly', priority: '1.0' },
        { loc: `${baseUrl}/blog`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: '0.9' },
        { loc: `${baseUrl}/contact`, lastmod: new Date().toISOString(), changefreq: 'monthly', priority: '0.8' },
    ];

    const postUrls = posts.map((post: any) => ({
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod: new Date(post.modified || Date.now()).toISOString(),
        changefreq: 'monthly',
        priority: '0.7',
    }));

    const allUrls = [...staticUrls, ...postUrls];

    const url = new URL(request.url);
    const wantsRawXml = url.searchParams.get('raw') === 'true';
    const userAgent = request.headers.get('user-agent') || '';
    const isBot = isLikelyBot(userAgent);

    const shouldServeRawXml = wantsRawXml || isBot;

    if (shouldServeRawXml) {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allUrls.map(u => `  <url>
                <loc>${u.loc}</loc>
                <lastmod>${u.lastmod}</lastmod>
                <changefreq>${u.changefreq}</changefreq>
                <priority>${u.priority}</priority>
            </url>`).join('\n')}
        </urlset>`;

        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            },
        });
    }

    // Polished Human-Friendly HTML – matching your zinc/slate palette
    const html = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>XML Sitemap - Kevin Gillispie</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    body { font-family: 'Geist' system-ui, -apple-system, sans-serif; }
                </style>
            </head>
            <body class="text-foreground dark:text-zinc-300 min-h-screen flex flex-col bg-gradient-to-br from-zinc-300 via-zinc-50 to-zinc-200 dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 antialiased">
                <div class="w-[960px] mx-auto px-6 py-16">
                    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                        <div>
                            <h1 class="text-4xl font-bold tracking-tight">XML Sitemap</h1>
                            <p class="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">
                            All pages currently indexed on kevingillispie.com
                            </p>
                        </div>
                        
                        <a href="/sitemap.xml?raw=true"
                            class="inline-flex items-center px-5 py-2.5 text-sm font-medium border border-zinc-300 dark:border-slate-700 rounded-xl hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors">
                            View Raw XML →
                        </a>
                    </div>

                    <div class="bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow">
                        <div class="overflow-x-auto">
                            <table class="table-auto w-[100%]">
                                <thead>
                                    <tr class="border-b border-zinc-200 dark:border-slate-800 bg-zinc-50 dark:bg-slate-950">
                                        <th class="px-8 py-6 text-left text-sm font-medium text-zinc-500 dark:text-slate-400">URL</th>
                                        <th class="px-8 py-6 text-left text-sm font-medium text-zinc-500 dark:text-slate-400">Last Modified</th>
                                        <th class="px-8 py-6 text-left text-sm font-medium text-zinc-500 dark:text-slate-400">Change Frequency</th>
                                        <th class="px-8 py-6 text-left text-sm font-medium text-zinc-500 dark:text-slate-400">Priority</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
                                    ${allUrls.map(u => `
                                    <tr class="hover:bg-zinc-50 dark:hover:bg-zinc-950/50 transition-colors group">
                                        <td class="px-8 py-6">
                                        <a href="${u.loc}" 
                                            class="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 break-all transition-colors">
                                            <code class="text-sm">${u.loc.replace(baseUrl, '') || 'https://www.kevingillispie.com/'}</code>
                                        </a>
                                        </td>
                                        <td class="px-8 py-6 text-sm text-zinc-500 dark:text-zinc-400">
                                            ${new Date(u.lastmod).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td class="px-8 py-6 text-sm capitalize text-zinc-600 dark:text-zinc-300">
                                            ${u.changefreq}
                                        </td>
                                        <td class="px-8 py-6">
                                            <span class="inline-flex items-center px-3.5 py-1 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                                ${u.priority}
                                            </span>
                                        </td>
                                    </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="mt-12 text-center text-xs text-zinc-500 dark:text-zinc-400">
                    This sitemap is automatically generated.
                    </div>
                </div>
            </body>
        </html>`;

    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
}