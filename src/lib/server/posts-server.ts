// src/lib/server/posts-server.ts
import { wpQuery } from '@/lib/graphql';
import { format } from 'date-fns';
import { htmlToText } from 'html-to-text';

export interface PostData {
    slug: string;
    title: string;
    date: string;          // formatted: "March 4, 2026"
    excerpt: string;       // plain text preview
    tags: string[];
    featured?: boolean;
    readTime?: string;
    contentHtml: string;   // raw HTML for dangerouslySetInnerHTML
}

const WORDS_PER_MINUTE = 225;

function calculateReadTime(text: string): string {
    if (!text.trim()) return '1 min read';

    const plainText = htmlToText(text, {
        wordwrap: false,
        selectors: [
            { selector: 'a', options: { ignoreHref: true } },
            { selector: 'img', format: 'skip' },
        ],
        longWordSplit: { forceWrapOnLimit: false },
    }).trim();

    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
    return `${minutes} min read`;
}

// ───────────────────────────────────────────────
// SINGLE POST (used by /blog/[slug])
// ───────────────────────────────────────────────
type WPPostResponse = {
    post: {
        slug: string;
        title: string;
        date: string;
        excerpt: string | null;
        content: string | null;
        tags: { nodes: { name: string }[] };
        categories: { nodes: { name: string }[] };
    } | null;
};

export async function getPostData(slug: string): Promise<PostData | null> {
    const GET_POST = `
    query GetPost($slug: ID!) {
        post(id: $slug, idType: SLUG) {
            slug
            title
            date
            excerpt(format: RENDERED)
            content(format: RENDERED)
            tags { nodes { name } }
            categories { nodes { name } }
        }
    }
  `;

    try {
        const data = await wpQuery<WPPostResponse>(GET_POST, { slug });
        const post = data?.post;

        if (!post) return null;

        const allTags = [
            ...(post.categories?.nodes?.map((c: any) => c.name) ?? []),
            ...(post.tags?.nodes?.map((t: any) => t.name) ?? []),
        ].filter(Boolean);

        const plainExcerpt = htmlToText(post.excerpt ?? '', {
            wordwrap: false,
            selectors: [{ selector: 'a', options: { ignoreHref: true } }],
        }).trim();

        const fullContent = post.content ?? '';

        return {
            slug: post.slug,
            title: post.title,
            date: format(new Date(post.date), 'MMMM d, yyyy'),
            excerpt: plainExcerpt || 'No excerpt available.',
            tags: allTags.slice(0, 3),
            featured: false,
            readTime: calculateReadTime(fullContent),
            contentHtml: fullContent,
        };
    } catch (error) {
        console.error(`Failed to fetch post "${slug}":`, error);
        return null;
    }
}

// ───────────────────────────────────────────────
// LATEST POSTS (used by homepage / previews)
// ───────────────────────────────────────────────
const GET_LATEST_POSTS = `
    query GetLatestPosts($first: Int!) {
        posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
            nodes {
                slug
                title
                date
                excerpt(format: RENDERED)
                content(format: RAW)
                tags { nodes { name } }
                categories { nodes { name } }
                postFeaturedFlag {featurePost}
            }
        }
    }
`;

export async function getLatestPosts(limit = 3): Promise<PostData[]> {
    try {
        const data = await wpQuery<any>(GET_LATEST_POSTS, { first: limit });
        const rawPosts = data?.posts?.nodes ?? [];

        return rawPosts.map((node: any) => {
            const allTags = [
                ...(node.categories?.nodes?.map((c: any) => c.name) ?? []),
                ...(node.tags?.nodes?.map((t: any) => t.name) ?? []),
            ].filter(Boolean);

            const plainExcerpt = htmlToText(node.excerpt ?? '', {
                wordwrap: false,
                selectors: [{ selector: 'a', options: { ignoreHref: true } }],
            }).trim();

            const fullContent = node.content ?? '';

            return {
                slug: node.slug,
                title: node.title,
                date: format(new Date(node.date), 'MMMM d, yyyy'),
                excerpt: plainExcerpt || 'No excerpt available.',
                tags: allTags.slice(0, 3),
                featured: false,
                readTime: calculateReadTime(fullContent),
                contentHtml: fullContent,
            };
        });
    } catch (error) {
        console.error('Failed to fetch latest posts:', error);
        return [];
    }
}

// ───────────────────────────────────────────────
// FEATURED + RECENT (used by /blog page)
// ───────────────────────────────────────────────
const GET_FEATURED_AND_RECENT = `
    query GetFeaturedAndRecent($first: Int = 50) {
        posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
            nodes {
                slug
                title
                date
                excerpt(format: RENDERED)
                content(format: RAW)
                tags { nodes { name } }
                categories { nodes { name } }
                postFeaturedFlag {featurePost}
            }
        }
    }
`;

export async function getFeaturedAndRecent(): Promise<{
    featured: PostData | null;
    recent: PostData[];
}> {
    try {
        const data = await wpQuery<any>(GET_FEATURED_AND_RECENT, { first: 50 });
        const rawPosts = data?.posts?.nodes ?? [];
        const mapped = rawPosts.map((node: any) => {
            // Reuse same mapping logic as getLatestPosts
            const allTags = [
                ...(node.categories?.nodes?.map((c: any) => c.name) ?? []),
                ...(node.tags?.nodes?.map((t: any) => t.name) ?? []),
            ].filter(Boolean);

            const plainExcerpt = htmlToText(node.excerpt ?? '', {
                wordwrap: false,
                selectors: [{ selector: 'a', options: { ignoreHref: true } }],
            }).trim();

            const fullContent = node.content ?? '';

            return {
                slug: node.slug,
                title: node.title,
                date: format(new Date(node.date), 'MMMM d, yyyy'),
                excerpt: plainExcerpt || 'No excerpt available.',
                tags: allTags.slice(0, 3),
                featured: node.postFeaturedFlag?.featurePost ?? false,
                readTime: calculateReadTime(fullContent),
                contentHtml: fullContent,
            };
        });

        const featured = mapped.find((p) => p.featured) ?? null;
        const recent = mapped.filter((p) => !p.featured).slice(0, 4);

        return { featured, recent };
    } catch (error) {
        console.error('Failed to fetch featured/recent:', error);
        return { featured: null, recent: [] };
    }
}

// ───────────────────────────────────────────────
// PAGINATED POSTS (used by /blog pagination)
// ───────────────────────────────────────────────
const GET_PAGINATED_POSTS = `
    query GetPaginatedPosts($first: Int!, $after: String) {
        posts(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
            pageInfo {
                hasNextPage
                endCursor
            }
            nodes {
                slug
                title
                date
                excerpt(format: RENDERED)
                content(format: RAW)
                tags { nodes { name } }
                categories { nodes { name } }
            }
        }
    }
`;

type WPPostNode = {
    slug: string;
    title: string;
    date: string;
    excerpt: string | null;
    content: string | null;
    tags: { nodes: { name: string }[] };
    categories: { nodes: { name: string }[] };
};

type WPPostsConnection = {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: WPPostNode[];
};

export async function getPaginatedPosts(afterCursor?: string | null): Promise<{
    posts: PostData[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
    try {
        const data = await wpQuery<{ posts: WPPostsConnection }>(GET_PAGINATED_POSTS, {
            first: 20,
            after: afterCursor || null,
        });

        const rawPosts = data?.posts?.nodes ?? [];
        const posts = rawPosts.map((node: WPPostNode) => {
            const allTags = [
                ...(node.categories?.nodes?.map((c: any) => c.name) ?? []),
                ...(node.tags?.nodes?.map((t: any) => t.name) ?? []),
            ].filter(Boolean);

            const plainExcerpt = htmlToText(node.excerpt ?? '', {
                wordwrap: false,
                selectors: [{ selector: 'a', options: { ignoreHref: true } }],
            }).trim();

            const fullContent = node.content ?? '';

            return {
                slug: node.slug,
                title: node.title,
                date: format(new Date(node.date), 'MMMM d, yyyy'),
                excerpt: plainExcerpt || 'No excerpt available.',
                tags: allTags.slice(0, 5),
                featured: false,
                readTime: calculateReadTime(fullContent),
                contentHtml: fullContent,
            };
        });

        return {
            posts,
            pageInfo: data?.posts?.pageInfo ?? { hasNextPage: false, endCursor: null },
        };
    } catch (error) {
        console.error('Failed to fetch paginated posts:', error);
        return { posts: [], pageInfo: { hasNextPage: false, endCursor: null } };
    }
}

// ───────────────────────────────────────────────
// ALL POST SLUGS (for generateStaticParams)
// ───────────────────────────────────────────────
export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
    const GET_SLUGS = `
    query GetAllPostSlugs($first: Int = 500) {
      posts(first: $first) {
        nodes {
          slug
        }
      }
    }
  `;

    try {
        const data = await wpQuery<any>(GET_SLUGS, { first: 500 });
        return data?.posts?.nodes ?? [];
    } catch (error) {
        console.error('Failed to fetch post slugs:', error);
        return [];
    }
}