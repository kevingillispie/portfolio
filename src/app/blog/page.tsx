import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample data – you can later load from MDX/files/database
const posts = [
    // Featured post (index 0)
    {
        slug: "portfolio-rebuild-2026",
        title: "Rebuilding my portfolio with Next.js 16 & shadcn/ui",
        excerpt: "Why I switched from a static Cloudflare site to a modern Next.js App Router setup, TypeScript, Tailwind, React Compiler, and shadcn/ui components for better developer experience and performance.",
        date: "February 19, 2026",
        readTime: "6 min",
        tags: ["Next.js", "shadcn/ui", "TypeScript", "Portfolio"],
        featured: true,
    },
    // The four current cards
    {
        slug: "overphish-tech-deep-dive",
        title: "How OverPhish blocks phishing in under 300 KB",
        excerpt: "A technical breakdown of the lightweight browser extension: Manifest V3, real-time domain checks, minimal permissions, and strong privacy focus.",
        date: "January 15, 2026",
        readTime: "8 min",
        tags: ["Security", "Browser Extension", "Manifest V3"],
    },
    {
        slug: "schema-scalpel-lessons",
        title: "Lessons from building Schema Scalpel",
        excerpt: "Challenges encountered and solutions found while creating a WordPress plugin for precise schema markup, performance, and broad theme compatibility.",
        date: "December 10, 2025",
        readTime: "7 min",
        tags: ["WordPress", "SEO", "Plugins"],
    },
    {
        slug: "coming-soon-unityper",
        title: "What's next: Unityper agency launch",
        excerpt: "Teaser for the upcoming web agency focused on clean, fast, accessible websites built with modern tools and best practices.",
        date: "March 2026 (planned)",
        readTime: "3 min",
        tags: ["Agency", "Next.js", "Performance"],
    },
    // 10 list-style posts (email-like)
    ...Array.from({ length: 10 }, (_, i) => ({
        slug: `post-${i + 5}`,
        title: `Article Title ${i + 1} – Exploring Web Development Topics`,
        excerpt: "Short summary that gives just enough context to decide if it's worth reading right now. Usually 1–2 sentences.",
        date: `February ${15 - i}, 2026`,
        readTime: `${4 + i % 6} min`,
        tags: ["Development", "Tips"],
        unread: i % 3 === 0, // simulate some "unread"
    })),
];

export const metadata: Metadata = {
    title: "Blog & Insights",
    description: "Thoughts, deep dives, and lessons learned about web development, Next.js, security tools, SEO plugins, and more.",
};

export default function BlogPage() {
    const featured = posts.find((p) => p.featured);
    const recentCards = posts.slice(1, 5); // the four cards
    const listPosts = posts.slice(5); // the 10 email-like

    return (
        <div className="container mx-auto max-w-5xl py-12 md:py-20">
            {/* Featured Post – larger, prominent */}
            {featured && (
                <section className="mb-16">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            Blog & Insights
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Occasional writings about building tools, performance, security, and modern web development.
                        </p>
                    </div>
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
                                            {featured.excerpt}
                                        </p>
                                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <CalendarDays className="h-4 w-4" />
                                                {featured.date}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="h-4 w-4" />
                                                {featured.readTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-1/2 h-64 md:h-auto bg-muted relative">
                                    {/* Placeholder for featured image – add real <Image> later */}
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 text-6xl font-bold">
                                        Featured
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </section>
            )}

            {/* Four recent card-style posts */}
            <section className="mb-20">
                <h2 className="text-2xl font-bold mb-8 text-center md:text-left">Recent Posts</h2>
                <div className="grid gap-8 md:grid-cols-2">
                    {recentCards.map((post) => (
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
                                        <Clock className="h-4 w-4" /> {post.readTime}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
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

            {/* 10 email-like list items */}
            <section>
                <h2 className="text-2xl font-bold mb-6 text-center md:text-left">All Posts</h2>
                <div className="space-y-1">
                    {listPosts.map((post) => (
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
                                    {post.excerpt}
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