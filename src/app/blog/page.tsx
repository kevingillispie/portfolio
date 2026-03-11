// src/app/blog/page.tsx
import React from 'react';
import { wpQuery } from '@/lib/graphql';
import { getFeaturedAndRecent, getPaginatedPosts } from '@/lib/server/posts-server';
import type { PostData } from '@/lib/server/posts-server';
import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import TransitionLink from '@/components/TransitionLink';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { CalendarDays, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getScscSchema } from '@/lib/server/get-scsc-schema';

const schemas = await getScscSchema('/blog');

const metaDescription = "Thoughts, tutorials, and lessons on web development, Next.js, security, SEO, and more.";

export const metadata: Metadata = {
    title: '//PlainText by Kevin Gillispie',
    description: metaDescription,
    openGraph: {
        title: '//PlainText by Kevin Gillispie',
        description: metaDescription,
        url: 'https://kevingillispie.com/blog',
        images: '/opengraph-image.png',
        type: 'website',
    },
    // Add twitter, robots, etc. if needed
};

const POSTS_PER_PAGE = 20;
const GET_TOTAL_COUNT = `
    query GetPostTotalCount {
        publishedPostCount
    }
`;

export default async function BlogListPage({
    params,
}: {
    params?: Promise<{ page?: string[] }>;
}) {
    const resolvedParams = await params;
    const pageSegments = resolvedParams?.page || [];

    if (pageSegments.length > 1) notFound();

    let currentPage = 1;
    if (pageSegments.length === 1) {
        currentPage = Number(pageSegments[0]);
        if (isNaN(currentPage) || currentPage < 1) notFound();
    }

    // Featured + recent
    const { featured, recent } = await getFeaturedAndRecent();

    // Paginated posts (cumulative fetch)
    let allPosts: PostData[] = [];
    let endCursor: string | null = null;
    let hasMore = true;

    for (let i = 1; i <= currentPage && hasMore; i++) {
        const { posts, pageInfo } = await getPaginatedPosts(endCursor);
        allPosts = [...allPosts, ...posts];
        endCursor = pageInfo.endCursor;
        hasMore = pageInfo.hasNextPage;
    }

    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const paginatedPosts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    let totalCount = 0;
    try {
        const totalData = await wpQuery<{ publishedPostCount: number }>(GET_TOTAL_COUNT);
        totalCount = totalData?.publishedPostCount ?? 0;
    } catch (error) {
        console.warn('Could not fetch publishedPostCount:', error);
        // Fallback to approximation if plugin not active
    }

    const totalPages = totalCount > 0
        ? Math.ceil(totalCount / POSTS_PER_PAGE)
        : Math.ceil(allPosts.length / POSTS_PER_PAGE) || 1;

    if (currentPage > totalPages && allPosts.length > 0) {
        notFound();
    }

    return (
        <>
            {schemas.map((schema: any, i: number) => (
                <Script
                    id={`schema-scalpel-${i}`}
                    className='schema-scalpel'
                    key={`schema-${i}`}
                    type="application/ld+json"
                    strategy="beforeInteractive"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
            <div className="container mx-auto max-w-5xl py-12 md:py-20 px-6 lg:px-0 min-h-screen">
                {/* Hero */}
                <div className="hero-container text-center mt-8 pb-12">
                    <Badge variant="secondary" className="mb-6 shadow-lg bg-background/80 backdrop-blur-sm">
                        <BreadcrumbNav variant="pathname" />
                    </Badge>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
                        <code>//PlainText</code>
                    </h1>
                    <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto">
                        A journal of explanations, insights, and musings about the world of technology.
                    </p>
                </div>

                {/* Featured post */}
                {featured ? (
                    <section className="mb-16">
                        <TransitionLink href={`/blog/${featured.slug}`} className="group block no-underline">
                            <Card className="overflow-hidden border-2 border-primary/30 hover:border-primary/60 transition-all hover:shadow-2xl">
                                <div className="md:flex">
                                    <div className="md:w-1/2 bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex items-center justify-center">
                                        <div>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {featured.tags.map((tag) => (
                                                    <Badge key={tag} variant="default">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">
                                                {featured.title}
                                            </h2>
                                            <p className="text-lg text-muted-foreground mb-6 line-clamp-3">
                                                {featured.excerpt}
                                            </p>
                                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1.5">
                                                    <CalendarDays className="h-4 w-4" />
                                                    {featured.date}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="h-4 w-4" />
                                                    {featured.readTime || 'Reading time TBD'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:w-1/2 h-64 md:h-auto bg-muted relative">
                                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 text-6xl font-bold">
                                            Featured
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </TransitionLink>
                    </section>
                ) : (
                    <div className="text-center py-12 text-muted-foreground border rounded-lg mb-16">
                        No featured post yet.
                    </div>
                )}

                {/* Recent posts */}
                <section className="mb-20">
                    <h2 className="text-2xl font-bold mb-8 text-center md:text-left">Recent Posts</h2>
                    {recent.length > 0 ? (
                        <div className="grid gap-8 md:grid-cols-2">
                            {recent.map((post: PostData) => (
                                <TransitionLink key={post.slug} href={`/blog/${post.slug}`} className="group block no-underline">
                                    <Card className="h-full transition-all hover:shadow-xl hover:-translate-y-1">
                                        <CardHeader>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {post.tags.map((tag) => (
                                                    <Badge key={tag} variant="secondary">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                                                <h3 className="text-xl">{post.title}</h3>
                                            </CardTitle>
                                            <CardDescription className="flex gap-1 mt-2">
                                                <Badge>
                                                    <CalendarDays className="h-4 w-4 mr-1" /> {post.date}
                                                </Badge>
                                                <Badge variant="secondary">
                                                    <Clock className="h-4 w-4 mr-1" /> {post.readTime || 'TBD'}
                                                </Badge>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground line-clamp-3 p-2 pl-3 bg-zinc-100 dark:bg-zinc-800 rounded-sm border-l-4 shadow-md">
                                                {post.excerpt}
                                            </p>
                                        </CardContent>
                                        <CardFooter>
                                            <span className="text-sm font-medium text-primary group-hover:underline">
                                                Read more →
                                            </span>
                                        </CardFooter>
                                    </Card>
                                </TransitionLink>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground border rounded-lg">
                            No recent posts yet.
                        </div>
                    )}
                </section>

                {/* All Posts */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-center md:text-left">All Posts</h2>

                    {paginatedPosts.length > 0 ? (
                        <div className="space-y-1">
                            {paginatedPosts.map((post: PostData) => (
                                <TransitionLink
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className={cn(
                                        "group flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 px-5 py-4 rounded-lg border transition-all bg-white dark:bg-zinc-900 hover:bg-zinc-50/50 shadow-lg"
                                    )}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-base font-medium">{post.title}</h3>
                                        </div>
                                        <p className="mt-1 p-2 pl-3 text-sm text-muted-foreground bg-zinc-100 dark:bg-zinc-800 rounded-sm border-l-4 shadow-md">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-6 text-xs text-muted-foreground whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                            <Badge variant="default">
                                                <div className="flex gap-2">
                                                    <CalendarDays className="h-3.5 w-3.5" />
                                                    {post.date}
                                                </div>
                                            </Badge>
                                            <Badge variant="secondary">
                                                <div className="flex gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    {post.readTime || 'TBD'}
                                                </div>
                                            </Badge>
                                        </div>
                                        <ChevronRight
                                            className="ml-auto h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity border border-zinc-500 rounded"
                                            color="#333"
                                            strokeWidth={4}
                                        />
                                    </div>
                                </TransitionLink>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground border rounded-lg">
                            No posts found.
                        </div>
                    )}

                    {totalPages > 0 ? (
                        <div className="mt-12 mb-24 md:mb-10 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        {currentPage > 1 ? (
                                            <PaginationPrevious
                                                href={currentPage === 2 ? '/blog' : `/blog/page/${currentPage - 1}`}
                                            />
                                        ) : (
                                            <PaginationPrevious className="pointer-events-none opacity-50" aria-disabled="true" />
                                        )}
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                                        .map((pageNum, idx, arr) => {
                                            if (idx > 0 && pageNum - arr[idx - 1] > 1) {
                                                return (
                                                    <React.Fragment key={`ellipsis-${idx}`}>
                                                        <PaginationItem>
                                                            <PaginationEllipsis />
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink
                                                                href={pageNum === 1 ? '/blog' : `/blog/page/${pageNum}`}
                                                                isActive={pageNum === currentPage}
                                                            >
                                                                {pageNum}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    </React.Fragment>
                                                );
                                            }

                                            return (
                                                <PaginationItem key={pageNum}>
                                                    <PaginationLink
                                                        href={pageNum === 1 ? '/blog' : `/blog/page/${pageNum}`}
                                                        isActive={pageNum === currentPage}
                                                    >
                                                        {pageNum}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}

                                    <PaginationItem>
                                        {currentPage < totalPages ? (
                                            <PaginationNext href={`/blog/page/${currentPage + 1}`} />
                                        ) : (
                                            <PaginationNext className="pointer-events-none opacity-50" aria-disabled="true" />
                                        )}
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    ) : (
                        <div className="mb-24" />
                    )}
                </section>
            </div>
        </>
    );
}