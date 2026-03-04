// src/lib/server/posts-server.ts
import { wpQuery } from '@/lib/graphql';
import { format } from 'date-fns';
import { htmlToText } from 'html-to-text';

export interface PostData {
    slug: string;
    title: string;
    date: string;
    description: string;
    tags: string[];
    featured?: boolean;
    readTime?: string;
    contentHtml: string; // for single post rendering
}

const WORDS_PER_MINUTE = 225;

function calculateReadTime(text: string): string {
    if (!text) return '1 min read'; // fallback

    // Strip HTML and get clean text
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

export async function getPostData(slug: string): Promise<PostData | null> {
    const GET_POST = `
    query GetPost($slug: String!) {
      post(id: $slug, idType: SLUG) {
        slug
        title
        date
        excerpt(format: RENDERED)
        content(format: RENDERED)
        tags { nodes { name } }
        categories { nodes { name } }
        # featuredImage { node { sourceUrl altText } }  # add later
        # acf { featured }
      }
    }
  `;

    try {
        const data = await wpQuery<any>(GET_POST, { slug });

        const post = data?.post;
        if (!post) return null;

        const allTags = [
            ... (post.categories?.nodes?.map((c: any) => c.name) ?? []),
            ... (post.tags?.nodes?.map((t: any) => t.name) ?? []),
        ].filter(Boolean);

        const plainExcerpt = htmlToText(post.excerpt ?? '', {
            wordwrap: false,
            selectors: [
                { selector: 'a', options: { ignoreHref: true } },
                { selector: 'img', format: 'skip' },
            ],
            longWordSplit: { forceWrapOnLimit: false },
        }).trim();

        return {
            slug: post.slug,
            title: post.title,
            date: format(new Date(post.date), 'MMMM d, yyyy'),
            description: plainExcerpt || 'No excerpt available.',
            tags: allTags.slice(0, 3),
            featured: false, // ACF later
            readTime: calculateReadTime(post.content ?? ''),
            contentHtml: post.content ?? '', // use RAW or switch to RENDERED if you want processed HTML
        };
    } catch (error) {
        console.error('Failed to fetch single post:', error);
        return null;
    }
}



const GET_LATEST_POSTS = `
  query GetLatestPosts($first: Int!) {
    posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        slug
        title
        date
        excerpt(format: RENDERED)
        content(format: RENDERED)
        tags { nodes { name } }
        categories { nodes { name } }
      }
    }
  }
`;

type WPPostsResponse = {
    posts: {
        nodes: Array<{
            slug: string;
            title: string;
            date: string;
            excerpt: string | null;
            content: string | null;
            tags: { nodes: { name: string }[] };
            categories: { nodes: { name: string }[] };
        }>;
    };
};

export async function getLatestPosts(limit = 3): Promise<PostData[]> {
    try {
        const data = await wpQuery<WPPostsResponse>(GET_LATEST_POSTS, { first: limit });

        const wpPosts = data?.posts?.nodes ?? [];

        return wpPosts.map((post) => {
            const allTags = [
                ...post.categories.nodes.map(c => c.name),
                ...post.tags.nodes.map(t => t.name),
            ].filter(Boolean);

            const rawExcerpt = post.excerpt ?? '';
            const plainExcerpt = htmlToText(rawExcerpt, {
                wordwrap: false,
                selectors: [
                    { selector: 'a', options: { ignoreHref: true } },
                    { selector: 'img', format: 'skip' },
                ],
            }).trim();

            return {
                slug: post.slug,
                title: post.title,
                date: format(new Date(post.date), 'MMMM d, yyyy'),
                description: plainExcerpt || 'No excerpt available.',
                tags: allTags.slice(0, 3),
                featured: false,
                readTime: calculateReadTime(post.content ?? ''), // now real!
                contentHtml: post.content ?? '',
            };
        });
    } catch (error) {
        console.error('Failed to fetch WP posts:', error);
        return [];
    }
}

export async function getSortedPostsData(): Promise<PostData[]> {
    // For compatibility; in production, avoid fetching ALL posts — paginate or limit
    return getLatestPosts(99);
}