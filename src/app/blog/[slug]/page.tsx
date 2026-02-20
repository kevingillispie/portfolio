import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CalendarDays, Clock } from 'lucide-react';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = await getSortedPostsData();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostData(slug);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: post.title,
        description: post.description,
    };
}

export default async function PostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPostData(slug);

    if (!post) notFound();

    return (
        <article className="container max-w-4xl mx-auto py-16 md:py-24">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{post.title}</h1>

            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-12">
                <CalendarDays className="h-4 w-4" /> {post.date}
                <Clock className="h-4 w-4" /> {post.readTime}
            </div>

            <div
                className="prose 
                    prose-zinc 
                    dark:prose-invert 
                    max-w-none 
                    prose-lg 
                    prose-headings:font-bold 
                    prose-headings:tracking-tight 
                    prose-a:text-primary 
                    hover:prose-a:underline 
                    prose-blockquote:border-l-4 
                    prose-blockquote:border-primary/60 
                    prose-blockquote:pl-5 
                    prose-blockquote:italic 
                    prose-code:bg-zinc-100 
                    dark:prose-code:bg-zinc-800 
                    prose-pre:bg-zinc-950 
                    dark:prose-pre:bg-black 
                    prose-pre:rounded-lg 
                    prose-pre:p-4 
                    overflow-x-auto
                "
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
        </article>
    );
}