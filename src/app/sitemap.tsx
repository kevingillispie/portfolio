// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { wpQuery } from '@/lib/graphql';   // ← your existing helper

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kevingillispie.com';

// ───────────────────────────────────────────────
// Static Next.js routes (these do NOT come from WP)
// Add every top-level route/folder you have here
// ───────────────────────────────────────────────
const staticRoutes: MetadataRoute.Sitemap = [
    {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 1,
    },
    {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    },
    {
        url: `${baseUrl}/contact`,           // ← your pure Next.js contact page
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    },
    // Add more static routes as needed, e.g.:
    // { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    // { url: `${baseUrl}/about`, ... },
];

// ───────────────────────────────────────────────
// Fetch ALL published post slugs + modified dates (lightweight)
// ───────────────────────────────────────────────
const GET_ALL_POSTS_FOR_SITEMAP = `
  query GetAllPostsForSitemap($first: Int = 500) {
    posts(first: $first, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
      nodes {
        slug
        modified
      }
    }
  }
`;

async function getAllPostsForSitemap() {
    try {
        const data = await wpQuery<any>(GET_ALL_POSTS_FOR_SITEMAP, { first: 500 });
        return data?.posts?.nodes ?? [];
    } catch (error) {
        console.error('Failed to fetch posts for sitemap:', error);
        return [];
    }
}

// Optional: If you also want WP Pages in the sitemap
// const GET_ALL_PAGES_FOR_SITEMAP = ` ... similar query for pages { nodes { slug modified } } `;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await getAllPostsForSitemap();

    const postRoutes: MetadataRoute.Sitemap = posts.map((post: any) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.modified),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Combine everything
    const allRoutes = [...staticRoutes, ...postRoutes];

    // Optional: Deduplicate just in case (e.g. if homepage is also a WP page)
    const uniqueRoutes = Array.from(
        new Map(allRoutes.map((route) => [route.url.replace(/\/+$/, ''), route])).values()
    );

    return uniqueRoutes;
}