import { getLatestPosts } from "@/lib/server/posts-server";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Network, Shield } from 'lucide-react';
import TransitionLink from "@/components/TransitionLink";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import SkillSpheroid from "@/components/SkillSpheroid";
import HALWireframeWall from "@/components/HALWireframeWall";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Script from "next/script";
import { getScscSchema } from "@/lib/server/get-scsc-schema";
import Link from "next/link";

const projects = [
    {
        name: "Schema Scalpel",
        slug: "schemascalpel",
        url: "https://schemascalpel.com",
        description: "Boost your <strong>search engine rankings</strong> with <i>surgical control</i> over your brand&rsquo;s identity!",
        logo: "/scalpel-scalpel-logo.png",
        image: "/schema-scalpel-hero-background.png"
    },
    {
        name: "OverPhish",
        slug: "overphish",
        url: "https://overphish.app",
        description: "Lightweight browser extension that blocks <strong>1M+</strong> phishing domains in <i>milliseconds</i>.",
        logo: "/overphish-logo.png",
        image: "/overphish-hero-background.png",
    },
    {
        name: "Unityper",
        slug: "unityper",
        url: "https://unityper.com",
        description: "Modern, <i>AI-enhanced</i> web agency — building secure, performant sites with maximal <strong>SEO</strong> value.",
        logo: "/unityper-logo.png",
        image: "/unityper-hero-background.png",
    },
];

export const metadata = {
    title: "Kevin Gillispie – Full-Stack Web Developer",
    description: "Full-stack web developer specializing in Next.js, TypeScript, Tailwind, shadcn/ui. Building performant SEO plugins, browser security tools, and modern sites.",
};

export default async function Home() {
    const schemas = await getScscSchema('/');
    const latestPosts = await getLatestPosts(3);
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

            <div className="relative w-full overflow-hidden">
                <HALWireframeWall rows={8} cols={16} />

                <div className="container mx-auto">
                    <div className="home-hero-container relative text-center mt-8 py-12 mx-6 md:py-20 bg-radial from-zinc-50/70 via-transparent to-transparent dark:bg-none">
                        <div className="pointer-events-auto">
                            <Badge variant="default" className="badge-shadow mb-6 py-1 dark:text-zinc-300 dark:bg-slate-800 dark:border dark:border-gray-600">Code & Content Creator</Badge>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
                                Kevin Gillispie
                            </h1>
                            <p className="text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto">
                                <span className="sm:hidden">• </span>Full-Stack Web Development • Cyber&nbsp;Security <br className="hidden sm:block" /> WP Plugins<span className="hidden sm:inline"> • </span><br className="sm:hidden" />Browser Extensions
                            </p>
                            <hr className="sm:hidden border border-top-1 border-zinc-800/50 dark:border-zinc-300 w-25 mt-6 mx-auto" />
                            <p className="mt-6 text-lg max-w-2xl mx-auto">
                                Building performant, user-focused tools <br />and sites that solve real problems.
                            </p>
                        </div>
                    </div>

                    <section className="w-full p-6">
                        <h2 className="text-3xl text-center font-bold mt-8">Projects</h2>
                        <div className="container grid gap-8 grid-cols-1 xl:grid-cols-3 xl:gap-12 pt-12">
                            <div className="xl:col-span-2">
                                <ProjectCarousel projects={projects} />
                            </div>

                            <div className="xl:col-span-1">
                                <div className="bg-card dark:bg-gradient-to-br dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 text-card-foreground space-y-6 rounded-xl border dark:border-slate-700 p-6 shadow-xl h-full flex flex-col">
                                    <h3 className="text-xl font-semibold tracking-tight border-b-1 pb-1 mb-3">About Me</h3>

                                    <div className="space-y-6 flex-1">
                                        <p className="text-muted-foreground leading-relaxed">
                                            I&rsquo;m the founder of <HoverCard openDelay={10} closeDelay={100}>
                                                <HoverCardTrigger asChild>
                                                    <Button variant="link" className="p-0 h-0"><i>Unityper Agency</i></Button>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="flex w-64 flex-col gap-0.5 mt-3">
                                                    <div>Official WordPress plugin for per-page JSON-LD schema customization, 8,500+ downloads and counting!</div>
                                                    <Link href={'https://unityper.com'} className="flex justify-center"><Button variant={"outline"} className="mt-3">Schema Scalpel website</Button></Link>
                                                </HoverCardContent>
                                            </HoverCard>, a full-service web development studio specializing in fast, secure, accessible, and SEO-aware websites.
                                        </p>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Professional projects include the <HoverCard openDelay={10} closeDelay={100}>
                                                <HoverCardTrigger asChild>
                                                    <Button variant="link" className="p-0 h-0">Schema Scalpel</Button>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="flex w-64 flex-col gap-0.5 mt-3">
                                                    <div>Official WordPress plugin for per-page JSON-LD schema customization, 8,500+ downloads and counting!</div>
                                                    <Link href={'https://schemascalpel.com'} className="flex justify-center"><Button variant={"outline"} className="mt-3">Schema Scalpel website</Button></Link>
                                                </HoverCardContent>
                                            </HoverCard> WordPress plugin and the <HoverCard openDelay={10} closeDelay={100}>
                                                <HoverCardTrigger asChild>
                                                    <Button variant="link" className="p-0 h-0">OverPhish</Button>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="flex w-64 flex-col gap-0.5 mt-3">
                                                    <div>Privacy-first browser extension blocking phishing/malware in real time, live on Chrome, Firefox, and Edge</div>
                                                    <Link href={'https://overphish.app'} className="flex justify-center"><Button variant={"outline"} className="mt-3">OverPhish website</Button></Link>
                                                </HoverCardContent>
                                            </HoverCard> anti-phishing browser extension.
                                        </p>
                                        <SkillSpheroid />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Recent / Featured Section */}
                    <section className="container py-16 md:py-24 p-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold">Latest from <code className="font-normal">//PlainText</code></h2>
                            <p className="text-small text-zinc-400">Updates and observations.</p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {latestPosts.length > 0 ? (
                                latestPosts.map((post) => (
                                    <Card key={post.slug} className="flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 dark:bg-gradient-to-br dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
                                        <div className="aspect-video relative">
                                            <Image
                                                src="/placeholder.svg?height=400&width=600&text=Blog+Post"
                                                alt={post.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <CardHeader>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {post.tags.slice(0, 3).map((tag) => (
                                                    <Badge key={tag} variant="secondary">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <CardTitle className="line-clamp-2"><h3 className="text-xl">{post.title}</h3></CardTitle>
                                            <CardDescription className="flex flex-col xl:flex-row xl:items-center gap-2 text-sm">
                                                <Badge variant="default">
                                                    <CalendarDays className="h-4 w-4 mr-1" aria-hidden="true" />
                                                    {post.date}
                                                </Badge>
                                                <Badge variant="secondary">
                                                    <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                                                    {post.readTime}
                                                </Badge>
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="flex-1">
                                            <p className="text-muted-foreground line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                        </CardContent>

                                        <CardFooter className="pt-0">
                                            <Button variant="outline" asChild className="ml-auto">
                                                <TransitionLink href={`/blog/${post.slug}`}>
                                                    Read more →
                                                </TransitionLink>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 text-muted-foreground">
                                    No recent posts available yet. Check back soon!
                                </div>
                            )}
                        </div>

                        <div className="text-center mt-12 mb-20 md:mb-0">
                            <Button asChild variant="outline" size="lg">
                                <TransitionLink href="/blog">View all posts →</TransitionLink>
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}