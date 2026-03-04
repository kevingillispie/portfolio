import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CalendarDays, Clock, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/BackButton';
import TransitionLink from '@/components/TransitionLink';

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
        description: post.excerpt,
    };
}

export default async function PostPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const post = await getPostData(slug);

    if (!post) notFound();

    // Get all posts to find prev/next
    const allPosts = await getSortedPostsData();
    const currentIndex = allPosts.findIndex((p) => p.slug === slug);

    if (currentIndex === -1) notFound();

    const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

    return (
        <article className="container max-w-4xl mx-auto py-16 md:py-24 px-4 lg:px-0">
            <div className="mt-10 mb-6">
                <BackButton />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{post.title}</h1>

            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-10">
                <Badge>
                    <CalendarDays className="h-4 w-4 mr-1" /> {post.date}
                </Badge>
                <Badge variant="secondary">
                    <Clock className="h-4 w-4 mr-1" /> {post.readTime}
                </Badge>
            </div>

            <hr className="my-10 border-border/60" />

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
                    overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            {/* Pagination: Prev / Next */}
            {(prevPost || nextPost) && (
                <nav className="my-16 flex flex-wrap sm:flex-row justify-center sm:justify-between gap-1 border-t pt-4">
                    {nextPost ? (
                        <TransitionLink href={`/blog/${nextPost.slug}`}>
                            <Badge variant={"default"} className='my-1'>
                                <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                                Next |<div className="font-medium italic line-clamp-1">{nextPost.title}</div>
                            </Badge>
                        </TransitionLink>
                    ) : (
                        <div className="flex-1" /> // spacer
                    )}

                    {prevPost ? (
                        <TransitionLink href={`/blog/${prevPost.slug}`}>
                            <Badge variant={"default"} className='my-1'>
                                <span className="font-medium italic line-clamp-1">{prevPost.title}</span>| Prev
                                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Badge>
                        </TransitionLink>
                    ) : (
                        <div className="flex-1" /> // spacer
                    )}
                </nav>
            )}
        </article>
    );
}