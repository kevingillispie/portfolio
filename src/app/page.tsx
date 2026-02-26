import { Badge } from "@/components/ui/badge";
import { getLatestPosts } from "@/lib/server/posts-server";
import { CalendarDays } from 'lucide-react';
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
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Define your projects data (easy to expand/maintain)
const projects = [
    {
        name: "Schema Scalpel",
        slug: "schemascalpel",
        url: "https://schemascalpel.com",
        description: "Surgical precision for WordPress structured data & SEO schema.",
        image: "/placeholder.svg"
    },
    {
        name: "OverPhish",
        slug: "overphish",
        url: "https://overphish.app",
        description: "Lightweight browser extension to block phishing domains in real-time.",
        image: "/placeholder.svg",
    },
    {
        name: "Unityper",
        slug: "unityper",
        url: "https://unityper.com",
        description: "Modern web agency — launching soon with clean, performant sites.",
        image: "/placeholder.svg",
    },
];

export default async function Home() {
    const latestPosts = await getLatestPosts(3);

    return (
        <div className="relative w-full overflow-hidden">
            <HALWireframeWall rows={8} cols={16} />

            <div className="container mx-auto">
                <div className="hero-container relative text-center mt-8 py-12 mx-6 md:py-20">
                    <div className="pointer-events-auto">
                        <Badge variant="default" className="badge-shadow mb-6 py-1">Code & Content Creator</Badge>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
                            Kevin Gillispie
                        </h1>
                        <p className="text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto">
                            Full-Stack Web Development • Cyber Security <br /> WP Plugins • Browser Extensions
                        </p>
                        <p className="mt-6 text-lg max-w-2xl mx-auto ">
                            Building performant, user-focused tools <br />and sites that solve real problems.
                        </p>
                    </div>
                </div>

                <section className="w-full p-6">
                    <h2 className="text-3xl text-center font-bold mt-8">Projects</h2>
                    <div className="container grid gap-8 lg:grid-cols-3 lg:gap-12 lg:pt-12">
                        {/* 3. Ensure carousel and cards are interactive */}
                        <div className="lg:col-span-2">
                            <ProjectCarousel projects={projects} />
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-card text-card-foreground space-y-6 rounded-xl border p-6 shadow-lg h-full flex flex-col">
                                <h3 className="text-xl font-semibold tracking-tight">About Me</h3>

                                <div className="space-y-6 flex-1">
                                    {/* Your bio paragraph */}
                                    <p className="text-muted-foreground leading-relaxed">
                                        I&apos;m a full-stack web developer specializing in modern React ecosystems (Next.js, TypeScript, Tailwind, shadcn/ui). I build performant tools like SEO plugins, browser security extensions, and agency-grade sites. Passionate about clean code, security, and user-focused design.
                                    </p>

                                    {/* Skills badges - easy to customize */}
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary">Next.js</Badge>
                                        <Badge variant="secondary">TypeScript</Badge>
                                        <Badge variant="secondary">Tailwind CSS</Badge>
                                        <Badge variant="secondary">shadcn/ui</Badge>
                                        <Badge variant="secondary">React</Badge>
                                        <Badge variant="secondary">WordPress</Badge>
                                        <Badge variant="secondary">Browser Extensions</Badge>
                                        <Badge variant="secondary">Security Tools</Badge>
                                        <Badge variant="secondary">PHP</Badge>
                                        <Badge variant="secondary">JavaScript</Badge>
                                    </div>

                                    {/* Optional: Add avatar or small photo here later */}
                                    {/* <div className="flex items-center gap-4 pt-4 border-t">
                                    <Avatar className="h-12 w-12">
                                    <AvatarImage src="/your-photo.jpg" alt="Kevin Gillispie" />
                                    <AvatarFallback>KG</AvatarFallback>
                                    </Avatar>
                                    <div>
                                    <p className="font-medium">Kevin Gillispie</p>
                                    <p className="text-sm text-muted-foreground">Web Developer</p>
                                    </div>
                                </div> 
                                */}
                                </div>

                                {/* CTA button at bottom */}
                                <Button asChild size={'lg'} className="mt-auto" style={{ borderRadius: "100px" }}>
                                    <TransitionLink href="/contact">Get in Touch →</TransitionLink>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent / Featured Section */}
                <section className="container py-16 md:py-24 p-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Latest from <i>Plain Text</i></h2>
                        <p className="text-small text-zinc-400">Updates and observations.</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {latestPosts.map((post) => (
                            <Card key={post.slug} className="flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
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
                                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                                    <CardDescription className="flex items-center gap-2 text-sm">
                                        <CalendarDays className="h-4 w-4" />
                                        {post.date}
                                        <span>•</span>
                                        {post.readTime}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <p className="text-muted-foreground line-clamp-3">
                                        {post.description}
                                    </p>
                                </CardContent>

                                <CardFooter className="pt-0">
                                    <Button variant="ghost" asChild className="ml-auto">
                                        <TransitionLink href={`/blog/${post.slug}`}>
                                            Read more →
                                        </TransitionLink>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button asChild variant="outline" size="lg">
                            <TransitionLink href="/blog">View all posts →</TransitionLink>
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
}