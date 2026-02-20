import { getSortedPostsData } from '@/lib/posts';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';


export const metadata: Metadata = {
    title: 'Blog & Insights',
    description: 'Thoughts, tutorials, and lessons on web development, Next.js, security, SEO, and more.',
};

export default async function BlogPage() {
    const allPosts = await getSortedPostsData();

    const featured = allPosts.find((p) => p.featured);
    const recent = allPosts.filter((p) => !p.featured).slice(0, 4);
    const older = allPosts.slice(4);

    return (
        <div className="container mx-auto max-w-5xl py-12 md:py-20">
            <div className="text-center mt-8 pb-12">
                <Badge variant="secondary" className="mb-6 shadow">Blog</Badge>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
                    Plain Text
                </h1>
                <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto">
                    A journal of explanations, insights, and musings about the world of technology.
                </p>
            </div>
            {/* Featured post */}
            {featured && (
                <section className="mb-16">
                    <Link href={`/blog/${featured.slug}`} className="group block no-underline">
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
                                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">
                                            {featured.title}
                                        </h1>
                                        <p className="text-lg text-muted-foreground mb-6 line-clamp-3">
                                            {featured.description || featured.excerpt}
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
                    </Link>
                </section>
            )}

            {/* Recent card-style posts */}
            <section className="mb-20">
                <h2 className="text-2xl font-bold mb-8 text-center md:text-left">Recent Posts</h2>
                <div className="grid gap-8 md:grid-cols-2">
                    {recent.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group block no-underline">
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
                                        {post.title}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-4 text-sm mt-2">
                                        <CalendarDays className="h-4 w-4" /> {post.date}
                                        <Clock className="h-4 w-4" /> {post.readTime || 'TBD'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground line-clamp-3">{post.description || post.excerpt}</p>
                                </CardContent>
                                <CardFooter>
                                    <span className="text-sm font-medium text-primary group-hover:underline">
                                        Read more →
                                    </span>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Email-like list of older posts */}
            <section>
                <h2 className="text-2xl font-bold mb-6 text-center md:text-left">All Posts</h2>
                <div className="space-y-1">
                    {older.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className={cn(
                                "group flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 rounded-lg border transition-all hover:bg-accent/50",
                                post.unread && "border-l-4 border-l-primary bg-accent/30"
                            )}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                    {post.unread && (
                                        <div className="h-2.5 w-2.5 rounded-full bg-primary flex-shrink-0" />
                                    )}
                                    <h3
                                        className={cn(
                                            "text-base font-medium truncate",
                                            post.unread && "font-semibold"
                                        )}
                                    >
                                        {post.title}
                                    </h3>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                                    {post.description || post.excerpt}
                                </p>
                            </div>
                            <div className="flex items-center gap-6 text-xs text-muted-foreground whitespace-nowrap">
                                <span className="flex items-center gap-1">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    {post.date}
                                </span>
                                <ChevronRight className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}