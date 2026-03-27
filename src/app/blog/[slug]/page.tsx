// src/app/blog/[slug]/page.tsx
import { getPostData, getAdjacentPosts, getRelatedPosts } from '@/lib/server/posts-server';
import { wpQuery } from '@/lib/graphql';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from "next/image";
import Script from 'next/script';
import { ReadingProgressBar } from '@/components/ReadingProgressBar';
import { ShareButtons } from '@/components/ShareButtons';
import { BackToTop } from '@/components/BackToTop';
import { CalendarDays, Clock, ChevronLeft, ChevronRight, Heart, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/BackButton';
import TransitionLink from '@/components/TransitionLink';
import { getScscSchema } from '@/lib/server/get-scsc-schema';
import { htmlToText } from 'html-to-text'; // if needed for fallback desc

const GET_TOTAL_COUNT = `
    query GetPostTotalCount {
        publishedPostCount
    }
`;

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostData(slug);

    if (!post) {
        return {
            title: 'Post Not Found | Kevin Gillispie',
            description: 'The requested blog post could not be found.',
        };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kevingillispie.com';
    const pageUrl = `${siteUrl}/blog/${slug}`;

    const seo = post.seo || {};   // seo is now already rewritten

    const seoTitle = seo.title || `${post.title} | Kevin Gillispie`;
    const seoDesc = seo.metaDesc || htmlToText(post.excerpt, { wordwrap: false }).trim() || 'Full-stack web developer insights and projects.';

    // og:image is now a clean /media/... path (or falls back)
    const ogImage = seo.opengraphImage?.sourceUrl || `${siteUrl}/opengraph-image.png`;

    const imageWidth = seo.opengraphImage?.mediaDetails?.width || 1200;
    const imageHeight = seo.opengraphImage?.mediaDetails?.height || 630;

    return {
        metadataBase: new URL(siteUrl),
        title: seoTitle,
        description: seoDesc,
        alternates: {
            canonical: seo.canonical || pageUrl,
        },
        openGraph: {
            title: seo.opengraphTitle || seoTitle,
            description: seo.opengraphDescription || seoDesc,
            url: pageUrl,
            siteName: 'Kevin Gillispie',
            images: [{ url: ogImage, width: imageWidth, height: imageHeight }],
            type: 'article',
            publishedTime: new Date(post.date).toISOString(),
        },
        twitter: {
            card: 'summary_large_image',
            title: seo.twitterTitle || seoTitle,
            description: seo.twitterDescription || seoDesc,
            images: [seo.twitterImage?.sourceUrl || ogImage],
            creator: '@kevinlgillispie',
        },
        robots: {
            index: seo.metaRobotsNoindex !== 'noindex',
            follow: seo.metaRobotsNofollow !== 'nofollow',
        },
    };
}

export default async function PostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPostData(slug);
    if (!post) notFound();

    const [totalData, adjacent, relatedPosts] = await Promise.all([
        wpQuery<{ publishedPostCount: number }>(GET_TOTAL_COUNT).catch(() => null),
        getAdjacentPosts(slug, post.rawDate),
        getRelatedPosts(post.tags, slug)
    ]);

    const totalCount = totalData?.publishedPostCount ?? 0;
    const { prev: prevPost, next: nextPost } = adjacent;

    const currentPath = `/blog/${slug}`;
    const schemas = await getScscSchema(currentPath);

    // Scoped correctly here for the component's return
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kevingillispie.com';
    const fullUrl = `${siteUrl}/blog/${slug}`;

    return (
        <>
            {schemas.map((schema: any, i: number) => (
                <Script
                    key={`schema-${slug}-${i}`}
                    id={`schema-${slug}-${i}`}
                    type="application/ld+json"
                    strategy="beforeInteractive"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}

            {/* Optional: If using Yoast fullHead, you could inject it here, but prefer Next.js Metadata API */}
            {/* {post.seo?.fullHead && <div dangerouslySetInnerHTML={{ __html: post.seo.fullHead }} />} */}
            <ReadingProgressBar />
            <BackToTop />
            <article className="container max-w-3xl mx-auto py-16 md:py-24 px-4 lg:px-0 min-h-screen">
                <div className="mt-16 mb-8">
                    <BackButton />
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{post.title}</h1>

                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-10">
                    <Badge variant="default">
                        <CalendarDays className="h-4 w-4 mr-1" aria-hidden="true" />
                        {post.date}
                    </Badge>
                    <Badge variant="secondary">
                        <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                        {post.readTime}
                    </Badge>
                    {/* Inside your [slug]/page.tsx */}
                    <div className="flex flex-wrap items-center gap-3 border-l-1 border-zinc-400 pl-3">
                        {/* Categories as primary badges */}
                        {post.categories.map((cat) => (
                            <Badge key={cat} variant={'outline'} className='shadow-md dark:border-slate-500'>
                                <Tag />
                                {cat}
                            </Badge>
                        ))}

                        {post.tags.map((tag) => (
                            <Badge key={tag} variant={'outline'} className='shadow dark:border-slate-500'>
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Featured Image */}
                {post.featuredImage?.sourceUrl ? (
                    <div className="relative w-full aspect-[16/9] md:aspect-[2/1] mb-12 rounded-xl overflow-hidden shadow-xl">
                        <Image
                            src={post.featuredImage.sourceUrl}
                            alt={post.featuredImage.altText || post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 768px"
                            priority
                        />
                    </div>
                ) : null}

                <div
                    className="prose text-zinc-800 dark:prose-invert dark:text-zinc-200 max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                />

                {/* Share Section */}
                <div className="mt-16 py-10 border-y border-border">
                    <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">

                        {/* Thank you message */}
                        <div className="flex flex-col items-start gap-3 text-muted-foreground">
                            <div className="text-lg flex flex-row gap-2"><p>Thanks for reading!</p><Heart className='text-red-400' /></div>
                            <p className="text-sm max-w-md">
                                If this post helped you, sparked an idea, or made you rage-click — <i>please share it!</i>
                            </p>
                        </div>

                        {/* Share Buttons */}
                        <ShareButtons title={post.title} url={fullUrl} />
                    </div>
                </div>

                {/* Navigation */}
                {(prevPost || nextPost) && (
                    <nav className="mt-16 flex flex-col sm:flex-row justify-between gap-6 border-t pt-8">
                        {prevPost ? (
                            <TransitionLink
                                href={`/blog/${prevPost.slug}`}
                                className="group flex-1"
                                aria-label={`Previous post: ${prevPost.title}`}
                            >
                                <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <ChevronLeft className="h-6 w-6 flex-shrink-0 transition-transform group-hover:-translate-x-1" />
                                    <div className="min-w-0">
                                        <p className="text-sm text-muted-foreground">Previous</p>
                                        <p className="font-medium line-clamp-2">{prevPost.title}</p>
                                    </div>
                                </div>
                            </TransitionLink>
                        ) : (
                            <div className="flex-1" />
                        )}

                        {nextPost ? (
                            <TransitionLink
                                href={`/blog/${nextPost.slug}`}
                                className="group flex-1 text-right"
                                aria-label={`Next post: ${nextPost.title}`}
                            >
                                <div className="flex items-center justify-end gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="min-w-0">
                                        <p className="text-sm text-muted-foreground">Next</p>
                                        <p className="font-medium line-clamp-2">{nextPost.title}</p>
                                    </div>
                                    <ChevronRight className="h-6 w-6 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                                </div>
                            </TransitionLink>
                        ) : (
                            <div className="flex-1" />
                        )}
                    </nav>
                )}

                {/* Total Count Footnote (Optional/Debug) */}
                {totalCount > 0 && (
                    <p className="text-center text-xs text-muted-foreground mt-8 opacity-40">
                        <i>Just 1 of {totalCount} postings and counting. Read more below!</i>
                    </p>
                )}

                {relatedPosts.length > 0 && (
                    <section className="mt-12 mb-24 pt-12">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-bold tracking-tight">Related Posts</h2>
                            <div className="h-px flex-1 bg-border mx-4 hidden sm:block" />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {relatedPosts.map((related, index) => {
                                const displayCat =
                                    related.tags?.find((t: string) => t !== "Uncategorized") || related.tags?.[0];

                                // Cycle through nice accent colors (or make this dynamic based on category)
                                const accentColors = [
                                    "bg-primary/10 dark:bg-primary/20",
                                    "bg-emerald-600/10 dark:bg-emerald-400/20",
                                    "bg-amber-600/10 dark:bg-amber-400/20",
                                    "bg-rose-600/10 dark:bg-rose-400/20",
                                    "bg-sky-600/10 dark:bg-sky-400/20",
                                    "bg-violet-600/10 dark:bg-violet-400/20",
                                ];
                                const cardColor = accentColors[index % accentColors.length];

                                // Decide which cards span on xl (e.g., first and last in this example)
                                const isWide = index === 0 || index === relatedPosts.length - 1;

                                return (
                                    <TransitionLink
                                        key={related.slug}
                                        href={`/blog/${related.slug}`}
                                        className={`group block h-full ${isWide ? "xl:col-span-2" : ""}`}
                                    >
                                        <div
                                            className={`flex h-full flex-col gap-6 rounded-xl overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1 ${cardColor}`}
                                        >
                                            <div className="flex flex-col flex-1 gap-4">
                                                {/* Category (optional – you can remove if not needed) */}
                                                {displayCat && (
                                                    <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                                        {displayCat}
                                                    </div>
                                                )}

                                                {/* Title – large and responsive like the original */}
                                                <h3 className="text-lg leading-tight font-medium transition-colors duration-200 md:text-xl lg:text-3xl text-foreground group-hover:text-primary">
                                                    {related.title}
                                                </h3>

                                                {/* Excerpt */}
                                                <p className="text-sm lg:text-base text-muted-foreground line-clamp-3 flex-1">
                                                    {related.excerpt}
                                                </p>

                                                {/* Read More Button */}
                                                <div className="mt-auto">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent-foreground p-0 transition-colors group-hover:text-primary"
                                                    >
                                                        Read More
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="transition-transform duration-200 group-hover:translate-x-0.5"
                                                        >
                                                            <path d="M5 12h14" />
                                                            <path d="m12 5 7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </TransitionLink>
                                );
                            })}
                        </div>
                    </section>
                )}

            </article>
        </>
    );
}