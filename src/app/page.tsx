"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay"; // Install if you want auto-play: npm install embla-carousel-autoplay

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image"; // For optimized project screenshots

// Define your projects data (easy to expand/maintain)
const projects = [
    {
        name: "Schema Scalpel",
        slug: "schemascalpel",
        url: "https://schemascalpel.com",
        description: "Surgical precision for WordPress structured data & SEO schema.",
        image: "/images/schemascalpel-screenshot.png", // Place images in public/images/
    },
    {
        name: "OverPhish",
        slug: "overphish",
        url: "https://overphish.app",
        description: "Lightweight browser extension to block phishing attempts in real-time.",
        image: "/images/overphish-screenshot.png",
    },
    {
        name: "Unityper",
        slug: "unityper",
        url: "https://unityper.com",
        description: "Modern web agency — launching soon with clean, performant sites.",
        image: "/images/unityper-teaser.png",
    },
];

export default function Home() {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true }) // Optional auto-play
    );

    return (
        <main className="min-h-screen">
            {/* Hero Carousel Section */}
            <section className="relative w-full bg-zinc-950 text-white"> {/* Adjust bg to match your zinc theme */}
                <Carousel
                    plugins={[plugin.current]}
                    className="w-full"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                >
                    <CarouselContent>
                        {projects.map((project) => (
                            <CarouselItem key={project.slug}>
                                <div className="relative h-[70vh] md:h-[80vh] flex items-center justify-center">
                                    {/* Background image or gradient */}
                                    <div className="absolute inset-0">
                                        <Image
                                            src={project.image}
                                            alt={`${project.name} screenshot`}
                                            fill
                                            className="object-cover brightness-50" // Darken for text readability
                                            priority={true} // For LCP on first slide
                                        />
                                    </div>

                                    {/* Content overlay */}
                                    <div className="relative z-10 text-center px-6 max-w-4xl">
                                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                                            {project.name}
                                        </h1>
                                        <p className="text-xl md:text-2xl mb-8 opacity-90">
                                            {project.description}
                                        </p>
                                        <Button asChild size="lg" variant="default">
                                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                                                View Project →
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                </Carousel>
            </section>

            {/* About Me Section (next) */}
            <section className="container py-16 md:py-24">
                <h2 className="text-3xl font-bold text-center mb-8">About Me</h2>
                {/* Add your bio, avatar, skills badges here */}
            </section>

            {/* Recent / Featured Section */}
            <section className="container py-16 md:py-24 bg-zinc-50 dark:bg-zinc-900">
                {/* Grid of cards for recent activity / placeholders */}
            </section>
        </main>
    );
}