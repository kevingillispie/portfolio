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
                    <Badge variant="secondary" className="mb-4">Continuous Code</Badge>
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
        </main>
    );
}