import { getLatestPosts } from "@/lib/server/posts-server";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Network, Shield } from 'lucide-react';
import TransitionLink from "@/components/TransitionLink";
import { ProjectCarousel } from "@/components/ProjectCarousel";
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
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
                                    <h3 className="text-xl font-semibold tracking-tight border-b-1 pb-1 mb-3">About Me <ButtonGroup>
                                        <Button><Link href={'https://github.com/kevingillispie'} target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M544 160C544 124.7 515.3 96 480 96L160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160zM361.8 471.7C361.8 469.9 361.8 465.7 361.9 460.1C362 448.7 362 431.3 362 416.4C362 400.8 356.8 390.9 350.7 385.7C387.7 381.6 426.7 376.5 426.7 312.6C426.7 294.4 420.2 285.3 409.6 273.6C411.3 269.3 417 251.6 407.9 228.6C394 224.3 362.2 246.5 362.2 246.5C335.6 239 305.6 239 279 246.5C279 246.5 247.2 224.3 233.3 228.6C224.2 251.5 229.8 269.2 231.6 273.6C221 285.3 216 294.4 216 312.6C216 376.2 253.3 381.6 290.3 385.7C285.5 390 281.2 397.4 279.7 408C270.2 412.3 245.9 419.7 231.4 394.1C222.3 378.3 205.9 377 205.9 377C189.7 376.8 204.8 387.2 204.8 387.2C215.6 392.2 223.2 411.4 223.2 411.4C232.9 441.1 279.3 431.1 279.3 431.1C279.3 440.1 279.4 452.8 279.4 461.7C279.4 466.5 279.5 470.3 279.5 471.7C279.5 476 276.5 481.2 268 479.7C202 457.6 155.8 394.8 155.8 321.4C155.8 229.6 226 159.9 317.8 159.9C409.6 159.9 484 229.6 484 321.4C484.1 394.8 439.3 457.7 373.3 479.7C364.9 481.2 361.8 476 361.8 471.7zM271.3 416.9C271.1 415.4 272.4 414.1 274.3 413.7C276.2 413.5 278 414.3 278.2 415.6C278.5 416.9 277.2 418.2 275.2 418.6C273.3 419 271.5 418.2 271.3 416.9zM262.2 420.1C260 420.3 258.5 419.2 258.5 417.7C258.5 416.4 260 415.3 262 415.3C263.9 415.1 265.7 416.2 265.7 417.7C265.7 419 264.2 420.1 262.2 420.1zM247.9 417.9C246 417.5 244.7 416 245.1 414.7C245.5 413.4 247.5 412.8 249.2 413.2C251.2 413.8 252.5 415.3 252 416.6C251.6 417.9 249.6 418.5 247.9 417.9zM235.4 410.6C233.9 409.3 233.5 407.4 234.5 406.5C235.4 405.4 237.3 405.6 238.8 407.1C240.1 408.4 240.6 410.4 239.7 411.2C238.8 412.3 236.9 412.1 235.4 410.6zM226.9 400.6C225.8 399.1 225.8 397.4 226.9 396.7C228 395.8 229.7 396.5 230.6 398C231.7 399.5 231.7 401.3 230.6 402.1C229.7 402.7 228 402.1 226.9 400.6zM220.6 391.8C219.5 390.5 219.3 389 220.2 388.3C221.1 387.4 222.6 387.9 223.7 388.9C224.8 390.2 225 391.7 224.1 392.4C223.2 393.3 221.7 392.8 220.6 391.8zM214.6 385.4C213.3 384.8 212.7 383.7 213.1 382.8C213.5 382.2 214.6 381.9 215.9 382.4C217.2 383.1 217.8 384.2 217.4 385C217 385.9 215.7 386.1 214.6 385.4z" /></svg></Link></Button>
                                        <Button><Link href={'https://schemascalpel.com/'} target="_blank">Schema Scalpel</Link></Button>
                                        <Button><Link href={'https://overphish.app'} target="_blank">OverPhish</Link></Button>
                                    </ButtonGroup></h3>

                                    <div className="space-y-6 flex-1">
                                        <p className="text-muted-foreground leading-relaxed">
                                            I love computer code. It&rsquo;s the language of logic that moves machines. I also love human language. It&rsquo;s the code of thought that moves minds. Apps and ideas, and my observations about them, are the things that will fill this website.
                                        </p>
                                        <p className="text-muted-foreground leading-relaxed">
                                            By day, I&rsquo;m a full-stack web developer and cybersecurity practitioner running <HoverCard openDelay={10} closeDelay={100}>
                                                <HoverCardTrigger asChild>
                                                    <Button variant="link" className="p-0 h-0"><i>Unityper Agency</i></Button>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="flex w-64 flex-col gap-0.5 mt-3">
                                                    <div>Official WordPress plugin for per-page JSON-LD schema customization, 8,500+ downloads and counting!</div>
                                                    <Link href={'https://unityper.com'} className="flex justify-center"><Button variant={"outline"} className="mt-3">Schema Scalpel website</Button></Link>
                                                </HoverCardContent>
                                            </HoverCard>, where I build performant, secure, SEO-friendly solutions—specializing in modern React stacks, headless WordPress, browser extensions, and PHP/JS.
                                        </p>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Notable projects include <HoverCard openDelay={10} closeDelay={100}>
                                                <HoverCardTrigger asChild>
                                                    <Button variant="link" className="p-0 h-0">Schema Scalpel</Button>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="flex w-64 flex-col gap-0.5 mt-3">
                                                    <div>Official WordPress plugin for per-page JSON-LD schema customization, 8,500+ downloads and counting!</div>
                                                    <Link href={'https://schemascalpel.com'} className="flex justify-center"><Button variant={"outline"} className="mt-3">Schema Scalpel website</Button></Link>
                                                </HoverCardContent>
                                            </HoverCard> and <HoverCard openDelay={10} closeDelay={100}>
                                                <HoverCardTrigger asChild>
                                                    <Button variant="link" className="p-0 h-0">OverPhish</Button>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="flex w-64 flex-col gap-0.5 mt-3">
                                                    <div>Privacy-first browser extension blocking phishing/malware in real time, live on Chrome, Firefox, and Edge</div>
                                                    <Link href={'https://overphish.app'} className="flex justify-center"><Button variant={"outline"} className="mt-3">OverPhish website</Button></Link>
                                                </HoverCardContent>
                                            </HoverCard>. I hold CompTIA Security+, Network+, and Google Cybersecurity Professional certificates.
                                        </p>

                                        <div className="flex justify-center">
                                            <ButtonGroup>
                                                <Button><Link href={'https://github.com/kevingillispie'} target="_blank">GitHub</Link></Button>
                                                <Button><Link href={'https://schemascalpel.com/'} target="_blank">Schema Scalpel</Link></Button>
                                                <Button><Link href={'https://overphish.app'} target="_blank">OverPhish</Link></Button>
                                            </ButtonGroup>
                                        </div>

                                        <div className="flex flex-wrap gap-3 justify-center">
                                            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/80 px-4 py-1.5 text-sm font-medium">
                                                <Shield className="h-4 w-4" /> CompTIA Security+
                                            </div>
                                            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/80 px-4 py-1.5 text-sm font-medium">
                                                <Network className="h-4 w-4" /> CompTIA Network+
                                            </div>
                                            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/80 px-4 py-1.5 text-sm font-medium">
                                                Google Cybersecurity Professional
                                            </div>
                                        </div>
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