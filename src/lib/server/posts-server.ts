// src/lib/server/posts-server.ts
import { wpQuery } from '@/lib/graphql';
import { format } from 'date-fns';
import { htmlToText } from 'html-to-text';

// Add this near your other interfaces in [slug]/page.tsx
interface SeoData {
    title?: string;
    metaDesc?: string;
    canonical?: string;
    opengraphTitle?: string;
    opengraphDescription?: string;
    opengraphImage?: {
        sourceUrl: string;
        mediaDetails?: {
            width: number;
            height: number;
        };
    };
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: {
        sourceUrl: string;
    };
    metaRobotsNoindex?: string;
    metaRobotsNofollow?: string;
}

export interface PostData {
    slug: string;
    title: string;
    date: string;          // formatted: "March 4, 2026"
    rawDate: string;       // "2026-03-04T12:00:00" for queries
    excerpt: string;
    categories: string[];
    tags: string[];
    featured?: boolean;
    readTime?: string;
    contentHtml: string;
    seo?: SeoData;
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
        seo: SeoData;
    } | null;
};

export async function getPostData(slug: string): Promise<PostData | null> {
    // SINGLE POST query (GET_POST)
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
            seo {
                title
                metaDesc
                canonical
                metaRobotsNoindex
                opengraphTitle
                opengraphDescription
                opengraphImage { sourceUrl mediaDetails { width height } }
                twitterTitle
                twitterDescription
                twitterImage { sourceUrl }
            }
        }
    }
`;

    try {
        const data = await wpQuery<WPPostResponse>(GET_POST, { slug });
        const post = data?.post;
        if (!post) return null;

        return mapNodeToPostData(post);
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

        return rawPosts.map(mapNodeToPostData);
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
        publishedPostCount
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
                rawDate: node.date,
                excerpt: plainExcerpt || 'No excerpt available.',
                tags: allTags.slice(0, 3),
                featured: node.postFeaturedFlag?.featurePost ?? false,
                readTime: calculateReadTime(fullContent),
                contentHtml: fullContent,
            };
        });

        const featured = mapped.find((p: PostData) => p.featured) ?? null;
        const recent = mapped.filter((p: PostData) => !p.featured).slice(0, 4);

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
        publishedPostCount
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

type WPPostsResponse = {
    posts: WPPostsConnection;
    publishedPostCount: number;
};

export async function getPaginatedPosts(
    afterCursor?: string | null,
    first = 20
): Promise<{
    posts: PostData[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    totalCount: number;
}> {
    try {
        const data = await wpQuery<WPPostsResponse>(GET_PAGINATED_POSTS, {
            first,
            after: afterCursor || null,
        });

        const rawPosts = data?.posts?.nodes ?? [];
        const posts = rawPosts.map(mapNodeToPostData);

        return {
            posts,
            pageInfo: data?.posts?.pageInfo ?? { hasNextPage: false, endCursor: null },
            totalCount: data?.publishedPostCount ?? 0,  // ← pull from response
        };
    } catch (error) {
        console.error('Failed to fetch paginated posts:', error);
        return {
            posts: [],
            pageInfo: { hasNextPage: false, endCursor: null },
            totalCount: 0,
        };
    }
}

// ───────────────────────────────────────────────
// ADJACENT POSTS (prev/next for single post page)
// ───────────────────────────────────────────────
const GET_ADJACENT_POSTS = `
    query GetAdjacentPosts($date: DateInput!) {
        previous: posts(
            first: 1
            where: {
                dateQuery: { 
                    before: $date
                }
                orderby: { field: DATE, order: DESC }
            }
        ) {
            nodes {
                slug
                title
                date
            }
        }
        next: posts(
            first: 1
            where: {
                dateQuery: { 
                    after: $date
                }
                orderby: { field: DATE, order: ASC }
            }
        ) {
            nodes {
                slug
                title
                date
            }
        }
    }
`;

interface AdjacentPost {
    slug: string;
    title: string;
    date: string; // raw WP date
}

export async function getAdjacentPosts(
    slug: string,
    currentDate: string
): Promise<{ prev: AdjacentPost | null; next: AdjacentPost | null }> {
    try {
        const dateObj = new Date(currentDate);

        const data = await wpQuery<any>(GET_ADJACENT_POSTS, {
            date: {
                year: dateObj.getFullYear(),
                month: dateObj.getMonth() + 1,
                day: dateObj.getDate()
            }
        });

        // Basic filtering to ensure we don't return the current post 
        // if multiple posts share the same date.
        const prevNode = data?.previous?.nodes?.find((n: any) => n.slug !== slug) || null;
        const nextNode = data?.next?.nodes?.find((n: any) => n.slug !== slug) || null;

        return {
            prev: prevNode ? {
                slug: prevNode.slug,
                title: prevNode.title,
                date: format(new Date(prevNode.date), 'MMMM d, yyyy')
            } : null,
            next: nextNode ? {
                slug: nextNode.slug,
                title: nextNode.title,
                date: format(new Date(nextNode.date), 'MMMM d, yyyy')
            } : null,
        };
    } catch (error) {
        console.error(`Failed to fetch adjacent for "${slug}":`, error);
        return { prev: null, next: null };
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

const GET_RELATED_POSTS = `
    query GetRelatedPosts($tagIn: [String], $notIn: [ID], $first: Int) {
        posts(
            first: $first
            where: {
                tagSlugIn: $tagIn,
                notIn: $notIn,
                orderby: { field: DATE, order: DESC }
            }
        ) {
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

export async function getRelatedPosts(
    tags: string[],
    currentSlug: string,
    limit = 3
): Promise<PostData[]> {
    if (!tags || tags.length === 0) return [];

    try {
        const data = await wpQuery<any>(GET_RELATED_POSTS, {
            tagIn: tags, // Passing the array of tag names/slugs
            notIn: [currentSlug],
            first: limit
        });

        const nodes = data?.posts?.nodes ?? [];
        return nodes.map((node: any) => {
            const allTags = [
                ...(node.categories?.nodes?.map((c: any) => c.name) ?? []),
                ...(node.tags?.nodes?.map((t: any) => t.name) ?? []),
            ].filter(Boolean);

            return {
                slug: node.slug,
                title: node.title,
                date: format(new Date(node.date), 'MMM d, yyyy'),
                rawDate: node.date,
                excerpt: htmlToText(node.excerpt ?? '', { wordwrap: false }).trim(),
                tags: allTags,
                readTime: calculateReadTime(node.content ?? ''),
                contentHtml: node.content ?? '',
            };
        });
    } catch (error) {
        console.error("Failed to fetch related posts:", error);
        return [];
    }
}

function mapNodeToPostData(node: any): PostData {
    const categories = node.categories?.nodes?.map((c: any) => c.name) || [];
    const tags = node.tags?.nodes?.map((t: any) => t.name) || [];

    const fullContent = node.content ?? '';
    const plainExcerpt = htmlToText(node.excerpt ?? '', {
        wordwrap: false,
        selectors: [{ selector: 'a', options: { ignoreHref: true } }],
    }).trim();

    return {
        slug: node.slug,
        title: node.title,
        date: format(new Date(node.date), 'MMMM d, yyyy'),
        rawDate: node.date,
        excerpt: plainExcerpt || 'No excerpt available.',
        categories,
        tags,
        featured: node.postFeaturedFlag?.featurePost ?? false,
        readTime: calculateReadTime(fullContent),
        contentHtml: fullContent,
        seo: node.seo || undefined,
    };
}