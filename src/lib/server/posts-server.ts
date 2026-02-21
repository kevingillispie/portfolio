// src/lib/server/posts-server.ts
// This file is server-only — no client code allowed

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { remark } from 'remark';
import remarkHtml from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostData {
    slug: string;
    title: string;
    date: string;
    description: string;
    tags: string[];
    featured?: boolean;
    readTime?: string;
    contentHtml: string;
}

export async function getPostData(slug: string): Promise<PostData | null> {
    if (!slug) return null;

    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const postDate = typeof data.date === 'string' ? data.date : data.date.toISOString().split('T')[0];

    const processedContent = await remark()
        .use(remarkHtml, { sanitize: false })
        .process(content);

    const contentHtml = processedContent.toString();

    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.ceil(wordCount / 225);

    return {
        slug,
        contentHtml,
        title: data.title as string,
        date: postDate,
        description: data.description as string,
        tags: (data.tags as string[]) || [],
        featured: data.featured as boolean || false,
        readTime: `${readTimeMinutes} min read (${wordCount} words)`,
    };
}

export async function getLatestPosts(limit = 3): Promise<PostData[]> {
    const allPosts = await getSortedPostsData();
    return allPosts.slice(0, limit);
}

export async function getSortedPostsData(): Promise<PostData[]> {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = await Promise.all(
        fileNames.map(async (fileName) => {
            const slug = fileName.replace(/\.mdx?$/, '');
            const post = await getPostData(slug);
            return post!;
        })
    );

    return allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}