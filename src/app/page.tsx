"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Badge } from "@/components/ui/badge";
import {
    Menubar,
    MenubarContent,
    MenubarGroup,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image"; // For optimized project screenshots
import { Link } from "lucide-react";

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

export default function Home() {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true }) // Optional auto-play
    );

    return (
        <main className="min-h-screen bg-zinc-50">
            <div className="container mx-auto">
                <div className="text-center py-12 md:py-16 lg:py-20">
                    <Badge variant="secondary" className="mb-4">Code & Content Creator</Badge>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
                        Kevin Gillispie
                    </h1>
                    <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto">
                        Full-Stack Web Developer • Next.js • TypeScript <br />• Security Tools • SEO Plugins
                    </p>
                    {/* Optional short tagline or CTA */}
                    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Building performant, user-focused tools and sites that solve real problems.
                    </p>
                </div>
                {/* Hero Carousel Section */}
                <section className="w-full p-6">
                    <Menubar className="py-6 px-3 bg-zinc-100">
                        <MenubarMenu>
                            <MenubarTrigger>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="mr-2" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
                                </svg>
                                Home
                            </MenubarTrigger>
                            <MenubarContent>
                                <MenubarGroup>
                                    <MenubarItem>Top</MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarItem>Projects</MenubarItem>
                                    <MenubarItem>Recent Posts</MenubarItem>
                                </MenubarGroup>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                    <div className="container grid gap-8 lg:grid-cols-3 lg:gap-12 lg:pt-12">
                        {/* Large Hero Carousel - takes 2/3 on lg+ */}
                        <div className="lg:col-span-2 rounded-xl overflow-hidden shadow-md">
                            <Carousel
                                plugins={[plugin.current]}
                                className="w-full"
                                onMouseEnter={plugin.current.stop}
                                onMouseLeave={plugin.current.reset}
                            >
                                <CarouselContent>
                                    {projects.map((project) => (
                                        <CarouselItem key={project.slug}>
                                            <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden rounded-xl">
                                                {/* Background image */}
                                                <div className="absolute inset-0">
                                                    <Image
                                                        src={project.image}
                                                        alt={`${project.name} screenshot`}
                                                        fill
                                                        className="object-cover brightness-[0.6] transition-transform duration-700 hover:scale-105"
                                                        priority
                                                    />
                                                </div>

                                                {/* Content overlay - centered, with better padding */}
                                                <div className="relative z-10 text-white text-center px-6 sm:px-12 max-w-4xl">
                                                    <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-4 drop-shadow-md">
                                                        {project.name}
                                                    </h1>
                                                    <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
                                                        {project.description}
                                                    </p>
                                                    <Button asChild size="lg" variant="secondary" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20">
                                                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                                                            View Project →
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="left-4 lg:left-8" variant="ghost" />
                                <CarouselNext className="right-4 lg:right-8" variant="ghost" />
                            </Carousel>
                        </div>

                        {/* Sidebar: "Other featured posts" repurposed as About Me */}
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
                                        <Badge variant="secondary">WordPress Plugins</Badge>
                                        <Badge variant="secondary">Browser Extensions</Badge>
                                        <Badge variant="secondary">Security Tools</Badge>
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
                                <Button asChild className="mt-auto">
                                    <a href="/contact" className="w-full">
                                        Get in Touch →
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent / Featured Section */}
                <section className="container py-16 md:py-24 bg-zinc-50 dark:bg-zinc-900 p-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Recent Activity / Insights</h2>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* Card 1: Portfolio rebuild */}
                        <Card className="flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="aspect-video relative">
                                <Image
                                    src="/placeholder.svg?height=400&width=600&text=Next.js+Rebuild"
                                    alt="Next.js portfolio rebuild"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardHeader>
                                <CardTitle className="line-clamp-2">Rebuilding my portfolio with Next.js 16 + shadcn/ui</CardTitle>
                                <CardDescription>February 18, 2026</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-muted-foreground">
                                    Switched from static Cloudflare site to modern Next.js App Router, TypeScript, Tailwind, and shadcn/ui for better DX and performance showcase.
                                </p>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Button variant="ghost" asChild className="ml-auto">
                                    <a href="/blog/portfolio-rebuild">Read more →</a>
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Card 2: OverPhish deep dive */}
                        <Card className="flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="aspect-video relative">
                                <Image
                                    src="/placeholder.svg?height=400&width=600&text=OverPhish+Extension"
                                    alt="OverPhish browser extension"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardHeader>
                                <CardTitle className="line-clamp-2">How OverPhish blocks phishing in under 300KB</CardTitle>
                                <CardDescription>January 2026</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-muted-foreground">
                                    Built a lightweight Chrome/Firefox extension using Manifest V3, real-time domain checks, and minimal permissions for maximum user trust.
                                </p>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Button variant="ghost" asChild className="ml-auto">
                                    <a href="/blog/overphish-tech">Read more →</a>
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Card 3: Teaser / Coming soon */}
                        <Card className="flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="aspect-video relative">
                                <Image
                                    src="/placeholder.svg?height=400&width=600&text=Next+Project"
                                    alt="Upcoming project teaser"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardHeader>
                                <CardTitle className="line-clamp-2">What's next: Unityper launch & more</CardTitle>
                                <CardDescription>March 2026 (planned)</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-muted-foreground">
                                    Teaser for agency work, performance optimizations, and new open-source tools in the pipeline.
                                </p>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Button variant="ghost" asChild className="ml-auto">
                                    <a href="/blog/upcoming">Read more →</a>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </section>
            </div>
            <footer className="bg-zinc-900 text-zinc-400 py-8 mt-auto border-t border-zinc-800">
                <div className="container mx-auto text-white px-6 md:flex md:justify-between md:items-center">
                    {/* Left: Copyright + Built with */}
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm">
                            © {new Date().getFullYear()} Kevin Gillispie. All rights reserved.
                        </p>
                        <p className="text-xs mt-1 opacity-70">
                            Built with <Badge variant="outline" className="text-white">Next.js</Badge>, <Badge variant="outline" className="text-white">TypeScript</Badge>, <Badge variant="outline" className="text-white">Tailwind CSS</Badge>, and <Badge variant="outline" className="text-white">shadcn/ui</Badge>.
                        </p>
                    </div>

                    {/* Center/Right: Links + Socials */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                        {/* Quick nav */}
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="hover:text-zinc-200 transition-colors">Home</a>
                            <a href="/projects" className="hover:text-zinc-200 transition-colors">Projects</a>
                            <a href="/blog" className="hover:text-zinc-200 transition-colors">Insights</a>
                            <a href="/contact" className="hover:text-zinc-200 transition-colors">Contact</a>
                        </div>

                        {/* Social icons (use Lucide-react or simple links) */}
                        <div className="flex gap-5">
                            <a href="https://github.com/kevingillispie" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                {/* GitHub SVG or icon */}
                                <svg className="h-5 w-5 hover:text-zinc-200 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                            {/* Add LinkedIn, X, etc. similarly */}
                            <a href="https://linkedin.com/in/kevinlgillispie" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hover:text-zinc-200 transition-colors" fill="currentColor" viewBox="0 0 640 640"><path d="M196.3 512L103.4 512L103.4 212.9L196.3 212.9L196.3 512zM149.8 172.1C120.1 172.1 96 147.5 96 117.8C96 103.5 101.7 89.9 111.8 79.8C121.9 69.7 135.6 64 149.8 64C164 64 177.7 69.7 187.8 79.8C197.9 89.9 203.6 103.6 203.6 117.8C203.6 147.5 179.5 172.1 149.8 172.1zM543.9 512L451.2 512L451.2 366.4C451.2 331.7 450.5 287.2 402.9 287.2C354.6 287.2 347.2 324.9 347.2 363.9L347.2 512L254.4 512L254.4 212.9L343.5 212.9L343.5 253.7L344.8 253.7C357.2 230.2 387.5 205.4 432.7 205.4C526.7 205.4 544 267.3 544 347.7L544 512L543.9 512z" /></svg>
                            </a>
                            <a href="mailto:your@email.com" aria-label="Email">
                                <svg className="h-5 w-5 hover:text-zinc-200 transition-colors" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}