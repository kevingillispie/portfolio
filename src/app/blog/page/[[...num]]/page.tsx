import React from 'react';
import { getLatestPosts } from '@/lib/server/posts-server';
import type { PostData } from '@/lib/server/posts-server';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import TransitionLink from '@/components/TransitionLink';
import { Badge } from '@/components/ui/badge';
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
import {
    SchemaBreadcrumb,
    SchemaWebPage,
} from '@kevingillispie/schema-scalpel-js';

export const metadata: Metadata = {
    title: 'Blog & Insights',
    description: 'Thoughts, tutorials, and lessons on web development, Next.js, security, SEO, and more.',
};

export default async function BlogListPage({
    params,
}: {
    params?: Promise<{ num?: string[] }>;
}) {
    const resolvedParams = await params;
    const pageSegments = resolvedParams?.num || [];

    if (pageSegments.length > 1) {
        notFound();
    }

    let currentPage = 1;
    if (pageSegments.length === 1) {
        currentPage = Number(pageSegments[0]);
        if (isNaN(currentPage) || currentPage < 1) {
            notFound();
        }
    }

    if (currentPage === 1) {
        redirect('/blog');
    }

    const allPosts = await getLatestPosts(200);
    const postsPerPage = 20;
    const totalPages = Math.ceil(allPosts.length / postsPerPage);

    if (currentPage > totalPages) {
        notFound();
    }

    const startIndex = (currentPage - 1) * postsPerPage;
    const paginatedPosts = allPosts.slice(startIndex, startIndex + postsPerPage);

    // Dynamic page title for schema & metadata
    const pageTitle = currentPage === 1
        ? 'Blog & Insights'
        : `Blog & Insights | Page ${currentPage}`;

    return (
        <>
            {/* Schema markup – auto BreadcrumbList + WebPage */}
            <SchemaWebPage name={pageTitle} />
            <SchemaBreadcrumb /> {/* Auto-generates from path, e.g. Home > Blog > Page 3 */}

            <div className="container mx-auto max-w-5xl py-12 md:py-20 px-2 lg:px-0">
                <div className="hero-container text-center mt-8 pb-12">
                    {/* Optional: Keep your UI breadcrumb nav if you want visual breadcrumbs */}
                    {/* <Badge variant="secondary" className="mb-6 shadow-lg bg-background/80 backdrop-blur-sm">
            <BreadcrumbNav variant="pathname" />
          </Badge> */}

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
                        <code>//PlainText</code>
                    </h1>
                    <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto">
                        A journal of explanations, insights, and musings about the world of technology.
                    </p>
                </div>

                {/* All Posts – paginated */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-center md:text-left">All Posts</h2>

                    <div className="space-y-1">
                        {paginatedPosts.map((post: PostData) => (
                            <TransitionLink
                                key={post.slug}
                                href={`/blog/${post.slug}?fromPage=${currentPage}`}
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
                                    <ChevronRight className="ml-auto h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </TransitionLink>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        {currentPage > 1 ? (
                                            <PaginationPrevious href={currentPage === 2 ? '/blog' : `/blog/page/${currentPage - 1}`} />
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
                    )}
                </section>
            </div>
        </>
    );
}