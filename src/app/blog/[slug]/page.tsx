// src/app/blog/[slug]/page.tsx
import { getPostData, getAdjacentPosts, getRelatedPosts } from '@/lib/server/posts-server';
import { wpQuery } from '@/lib/graphql';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Script from 'next/script';
import { ReadingProgressBar } from '@/components/ReadingProgressBar';
import { ShareButtons } from '@/components/ShareButtons';
import { BackToTop } from '@/components/BackToTop';
import { CalendarDays, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
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

// export async function generateStaticParams() {
//     const slugs = await getAllPostSlugs();
//     return slugs.map(({ slug }) => ({ slug }));
// }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostData(slug);

    if (!post) {
        return {
            title: 'Post Not Found | Kevin Gillispie',
            description: 'The requested blog post could not be found.',
        };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kevingillispie.com';
    const pageUrl = `${siteUrl}/blog/${slug}`;

    // Prefer Yoast SEO fields; fall back to post data
    const seoTitle = post.seo?.title || post.title + ' | Kevin Gillispie';
    const seoDesc = post.seo?.metaDesc || htmlToText(post.excerpt, { wordwrap: false }).trim() || 'Full-stack web developer insights and projects.';
    const ogImage = post.seo?.opengraphImage?.sourceUrl
        ? new URL(post.seo.opengraphImage.sourceUrl, process.env.NEXT_PUBLIC_WORDPRESS_URL || siteUrl).toString()
        : `${siteUrl}/opengraph-image.png`;

    const imageWidth = post.seo?.opengraphImage?.mediaDetails?.width || 1200;
    const imageHeight = post.seo?.opengraphImage?.mediaDetails?.height || 630;

    return {
        metadataBase: new URL(siteUrl), // Required for proper relative → absolute resolution
        title: seoTitle,
        description: seoDesc,
        alternates: {
            canonical: post.seo?.canonical || pageUrl,
        },
        openGraph: {
            title: post.seo?.opengraphTitle || seoTitle,
            description: post.seo?.opengraphDescription || seoDesc,
            url: pageUrl,
            siteName: 'Kevin Gillispie',
            images: [{ url: ogImage, width: imageWidth, height: imageHeight }],
            type: 'article',
            publishedTime: new Date(post.date).toISOString(),
            // You could add modifiedTime if available from WP
        },
        twitter: {
            card: 'summary_large_image',
            title: post.seo?.twitterTitle || seoTitle,
            description: post.seo?.twitterDescription || seoDesc,
            images: [post.seo?.twitterImage?.sourceUrl ? new URL(post.seo.twitterImage.sourceUrl, process.env.NEXT_PUBLIC_WORDPRESS_URL || siteUrl).toString() : ogImage],
            creator: '@kevinlgillispie',
        },
        robots: {
            index: post.seo?.metaRobotsNoindex !== 'noindex',
            follow: post.seo?.metaRobotsNofollow !== 'nofollow',
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
            <article className="container max-w-4xl mx-auto py-16 md:py-24 px-4 lg:px-0 min-h-screen">
                <div className="mt-16 mb-8">
                    <BackButton />
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{post.title}</h1>

                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-10">
                    <Badge variant="outline">
                        <CalendarDays className="h-4 w-4 mr-1" aria-hidden="true" />
                        {post.date}
                    </Badge>
                    <Badge variant="secondary">
                        <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                        {post.readTime}
                    </Badge>
                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Badge key={tag} variant="default">{tag}</Badge>
                            ))}
                        </div>
                    )}
                </div>

                <hr className="my-10 border-border/60" />

                <div
                    className="prose prose-zinc dark:prose-invert max-w-none prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-primary/60 prose-blockquote:pl-5 prose-blockquote:italic prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-pre:bg-zinc-950 dark:prose-pre:bg-black prose-pre:rounded-lg prose-pre:p-4 overflow-x-auto prose-ul:list-disc prose-ul:pl-5 prose-li:my-1"
                    dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                />

                <div className="mt-12 py-8 border-y border-zinc-300 flex flex-col flex-wrap sm:flex-row sm:items-center sm:gap-6">
                    <ShareButtons title={post.title} url={fullUrl} />
                    <p className="text-xs text-muted-foreground italic mt-3 sm:mt-0">
                        Thanks for reading. If you found this useful, please share it!
                    </p>
                </div>

                {relatedPosts.length > 0 && (
                    <section className="mt-20 border-t pt-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold tracking-tight">Related Insights</h2>
                            <div className="h-px flex-1 bg-border mx-4 hidden sm:block" />
                        </div>
                        <div className="grid gap-6 md:grid-cols-3">
                            {relatedPosts.map((related) => {
                                const displayTag = related.tags.find(t => t !== 'Uncategorized') || related.tags[0];

                                return (
                                    <TransitionLink key={related.slug} href={`/blog/${related.slug}`} className="group block h-full">
                                        <Card className="h-full flex flex-col border-2 border-transparent hover:border-primary/20 hover:shadow-xl transition-all duration-300">
                                            <CardHeader className="p-5 pb-2">
                                                <div className="flex justify-between items-start mb-3">
                                                    {displayTag && (
                                                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary hover:bg-primary/20 border-none">
                                                            {displayTag}
                                                        </Badge>
                                                    )}
                                                    <div className="flex items-center text-[10px] text-muted-foreground font-medium">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        {related.readTime}
                                                    </div>
                                                </div>
                                                <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                    {related.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-5 pt-0 flex-grow">
                                                <p className="text-sm text-muted-foreground line-clamp-2 italic">
                                                    &ldquo;{related.excerpt}&rdquo;
                                                </p>
                                            </CardContent>
                                            <CardFooter className="p-5 pt-0 text-[11px] font-mono text-muted-foreground/60">
                                                {related.date}
                                            </CardFooter>
                                        </Card>
                                    </TransitionLink>
                                );
                            })}
                        </div>
                    </section>
                )}

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
                    <p className="text-center text-xs text-muted-foreground mt-8 mb-20 opacity-40">
                        <i>Just one of {totalCount} postings and counting.</i>
                    </p>
                )}
            </article>
        </>
    );
}