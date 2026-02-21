"use client";  // ← This makes it a Client Component

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
import Link from "next/link";

// Pass projects as prop (or fetch if needed)
interface HeroCarouselProps {
    projects: {
        name: string;
        slug: string;
        url: string;
        description: string;
        image: string;
    }[];
}

export function HeroCarousel({ projects }: HeroCarouselProps) {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    return (
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
                                <div className="absolute inset-0">
                                    <Image
                                        src={project.image}
                                        alt={`${project.name} screenshot`}
                                        fill
                                        className="object-cover brightness-[0.6] transition-transform duration-700 hover:scale-105"
                                        priority
                                    />
                                </div>

                                <div className="relative z-10 text-white text-center px-6 sm:px-12 max-w-4xl">
                                    <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-4 drop-shadow-md">
                                        {project.name}
                                    </h1>
                                    <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
                                        {project.description}
                                    </p>
                                    <Button asChild size="lg" variant="secondary" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20">
                                        <Link href={project.url} target="_blank" rel="noopener noreferrer external">
                                            View Project →
                                        </Link>
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
    );
}