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
import { Badge } from "./ui/badge";

const projects = [
    {
        name: "Schema Scalpel",
        slug: "schemascalpel",
        url: "https://schemascalpel.com",
        description: "Boost your <strong>search engine rankings</strong> with <i>surgical control</i> over your brand&rsquo;s identity!",
        badge: "Branding",
        font: "obvia-exapanded",
        logo: "/schema-scalpel-icon.png",
        image: "/media/carousel-schema-scalpel.png"
    },
    {
        name: "OverPhish",
        slug: "overphish",
        url: "https://overphish.app",
        description: "Lightweight browser extension that blocks <strong>1M+</strong> phishing domains in <i>milliseconds</i>.",
        badge: "Protection",
        font: "omnes-light",
        logo: "/overphish-logo.png",
        image: "/media/carousel-overphish.png",
    },
    {
        name: "Unityper",
        slug: "unityper",
        url: "https://unityper.com",
        description: "Modern, <i>AI-enhanced</i> web agency — building secure, performant sites with maximal <strong>SEO</strong> value.",
        badge: "Development",
        font: "condor",
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
                            <div className="relative h-[60vh] sm:h-[725px] lg:h-[699px] text-center xl:text-left flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0">
                                    <Image
                                        src={project.image}
                                        alt={`${project.name} screenshot`}
                                        fill
                                        className="object-cover brightness-[0.5] transition-transform duration-700 hover:scale-105"
                                        priority={projects.indexOf(project) === 0}  // Keep for the first slide (LCP candidate)
                                        fetchPriority={projects.indexOf(project) === 0 ? "high" : "auto"}  // Explicitly boost the first one
                                        loading={projects.indexOf(project) === 0 ? "eager" : "lazy"}     // Reinforce eager for first
                                    />
                                </div>

                                <div className="relative z-10 text-white p-4 xs:py-6 xs:px-6 sm:px-10 md:px-16 max-w-[90%] sm:max-w-3xl md:max-w-4xl rounded-xl">
                                    <Image src={project.logo} alt={`${project.slug} screenshot`} width={96} height={96} className="mx-auto rounded-xl mb-3 w-16 md:w-24" />
                                    <div className="flex justify-center mb-6">
                                        <Badge variant={'secondary'}>{project.badge}</Badge>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <h3 style={{ lineHeight: "0.8" }} className={`w-[100%] text-5xl md:text-9xl lg:text-[11rem] font-bold tracking-tight drop-shadow-lg ${project.font} ${project.slug === "schemascalpel" ? 'lg:mb-4 xl:mb-0' : (project.slug === "unityper" ? 'lg:mb-8 xl:mb-0' : '')}`}>
                                            {project.name}
                                        </h3>
                                    </div>
                                    <p className="relative sm:text-lg md:text-xl lg:text-xl xl:max-w-xs xl:max-w-sm my-4 p-2">
                                        <span dangerouslySetInnerHTML={{ __html: project.description }} />
                                    </p>
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="secondary"
                                        className="p-6"
                                    >
                                        <TransitionLink
                                            href={project.url}
                                            target="_blank"
                                            rel="noopener noreferrer external"
                                        >
                                            View {project.name} →
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
        </div >
    );
}