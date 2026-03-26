// src/components/ProjectCarousel.tsx
"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import TransitionLink from "./TransitionLink";

const projects = [
    {
        name: "Schema Scalpel",
        slug: "schemascalpel",
        url: "https://schemascalpel.com",
        description: "Boost your <strong>search engine rankings</strong> with <i>surgical control</i> over your brand&rsquo;s identity!",
        logo: "/scalpel-scalpel-logo.png",
        image: "/media/carousel-schema-scalpel.png"
    },
    {
        name: "OverPhish",
        slug: "overphish",
        url: "https://overphish.app",
        description: "Lightweight browser extension that blocks <strong>1M+</strong> phishing domains in <i>milliseconds</i>.",
        logo: "/overphish-logo.png",
        image: "/media/carousel-overphish.png",
    },
    {
        name: "Unityper",
        slug: "unityper",
        url: "https://unityper.com",
        description: "Modern, <i>AI-enhanced</i> web agency — building secure, performant sites with maximal <strong>SEO</strong> value.",
        logo: "/unityper-logo.png",
        image: "/media/carousel-unityper.png",
    },
];

export function ProjectCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    return (
        <div className="rounded-xl overflow-hidden shadow-md">
            <Carousel
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent>
                    {projects.map((project) => (
                        <CarouselItem key={project.slug} className="pl-2 md:pl-4">
                            <div className="relative h-[45vh] xs:h-[50vh] sm:h-[725px] lg:h-[699px] flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0">
                                    <Image
                                        src={project.image}
                                        alt={`${project.name} screenshot`}
                                        fill
                                        className="object-cover brightness-[0.6] transition-transform duration-700 hover:scale-105"
                                        priority={projects.indexOf(project) === 0}  // Keep for the first slide (LCP candidate)
                                        fetchPriority={projects.indexOf(project) === 0 ? "high" : "auto"}  // Explicitly boost the first one
                                        loading={projects.indexOf(project) === 0 ? "eager" : "lazy"}     // Optional: reinforce eager for first
                                    />
                                </div>

                                <div className="relative z-10 text-white text-center p-4 xs:py-6 xs:px-6 sm:px-10 md:px-12 max-w-[90%] sm:max-w-3xl md:max-w-4xl rounded-xl">
                                    <Image src={project.logo} alt={`${project.name} screenshot`} width={100} height={100} className="rounded-xl mx-auto mb-3 w-16 md:w-[100px]" />
                                    <h3 className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3 sm:mb-4 drop-shadow-lg ${project.name === "Unityper" ? "condor" : ''}`}>
                                        {project.name}
                                    </h3>
                                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl sm:mt-7 mb-6 sm:mb-8 opacity-90 max-w-xl mx-auto p-2 bg-zinc-50/20 backdrop-blur-sm rounded-lg border border-zinc-400">
                                        <span dangerouslySetInnerHTML={{ __html: project.description }} />
                                    </p>
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="secondary"
                                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:text-white"
                                    >
                                        <TransitionLink
                                            href={project.url}
                                            target="_blank"
                                            rel="noopener noreferrer external"
                                        >
                                            View Project →
                                        </TransitionLink>
                                    </Button>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* More mobile-friendly arrow positioning */}
                <CarouselPrevious
                    className="left-4 -translate-x-1/2 sm:translate-x-0"
                    variant="outline"
                />
                <CarouselNext
                    className="right-4 translate-x-1/2 sm:translate-x-0"
                    variant="outline"
                />
            </Carousel>
        </div>
    );
}