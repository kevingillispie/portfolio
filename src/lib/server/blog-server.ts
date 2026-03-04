// src/lib/server/blog-server.ts
import { wpQuery } from '@/lib/graphql';
import { format } from 'date-fns';
import { htmlToText } from 'html-to-text';

export interface BlogPost {
    slug: string;
    title: string;
    date: string; // formatted
    excerpt: string;
    tags: string[];
    featured?: boolean;
    readTime?: string;
    // Add more later: content, featuredImage, etc.
}

const POSTS_PER_PAGE = 20;

// Featured + recent use a fixed large first-page query (adjust if >100 posts)
const GET_FEATURED_AND_RECENT = `
  query GetFeaturedAndRecent($first: Int = 50) {
    posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        slug
        title
        date
        excerpt(format: RENDERED)
        content(format: RENDERED)
        tags { nodes { name } }
        categories { nodes { name } }
        # acf { featured }  # if you add ACF + WPGraphQL-ACF extension
      }
    }
  }
`;

// Paginated "all posts" uses cursor-based (efficient)
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
        content(format: RENDERED)
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
    tags: { nodes: { name: string }[] };
    categories: { nodes: { name: string }[] };
};

type WPPostsConnection = {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: WPPostNode[];
};

function mapToBlogPost(node: WPPostNode): BlogPost {
    const allTags = [
        ...node.categories.nodes.map(c => c.name),
        ...node.tags.nodes.map(t => t.name),
    ].filter(Boolean);

    const plainExcerpt = htmlToText(node.excerpt ?? '', {
        wordwrap: false,
        selectors: [{ selector: 'a', options: { ignoreHref: true } }],
    }).trim();

    return {
        slug: node.slug,
        title: node.title,
        date: format(new Date(node.date), 'MMMM d, yyyy'),
        excerpt: plainExcerpt || 'No excerpt available.',
        tags: allTags.slice(0, 5), // adjust as needed
        featured: false, // placeholder; use ACF later
        readTime: '5 min read', // placeholder; compute from content later
    };
}

export async function getFeaturedAndRecent(): Promise<{
    featured: BlogPost | null;
    recent: BlogPost[];
}> {
    type FeaturedResponse = {
        posts: {
            nodes: WPPostNode[];
        };
    };
    const data = await wpQuery<FeaturedResponse>(GET_FEATURED_AND_RECENT, { first: 50 });

    const rawPosts = data?.posts?.nodes ?? [];
    const mapped = rawPosts.map(mapToBlogPost);

    const featured = mapped.find((p: BlogPost) => p.featured) ?? null;
    const recent = mapped.filter((p: BlogPost) => !p.featured).slice(0, 4);

    return { featured, recent };
}

export async function getPaginatedPosts(afterCursor?: string | null): Promise<{
    posts: BlogPost[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
    const data = await wpQuery<{ posts: WPPostsConnection }>(GET_PAGINATED_POSTS, {
        first: POSTS_PER_PAGE,
        after: afterCursor || null,
    });

    const rawPosts = data?.posts?.nodes ?? [];
    const posts = rawPosts.map(mapToBlogPost);

    return {
        posts,
        pageInfo: data?.posts?.pageInfo ?? { hasNextPage: false, endCursor: null },
    };
}