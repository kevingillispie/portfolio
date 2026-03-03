"use client";

import React, { useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import TransitionLink from "./TransitionLink";
import { Home } from "lucide-react";

interface BreadcrumbNavProps {
    variant?: "friendly" | "pathname";
}

export function BreadcrumbNav({ variant = "friendly" }: BreadcrumbNavProps) {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean);

    const [postTitle, setPostTitle] = useState<string | null>(null);

    // Fetch title for individual blog posts
    useEffect(() => {
        if (pathSegments[0] === "blog" && pathSegments[1] && pathSegments[1] !== "page") {
            const slug = pathSegments[1];
            fetch(`/api/post-title?slug=${slug}`)
                .then((res) => res.json())
                .then((data) => setPostTitle(data.title || null))
                .catch(() => setPostTitle(null));
        }
    }, [pathname]);

    const segmentToLabel: Record<string, string> = {
        blog: "Plain Text",
        projects: "Projects",
        contact: "Contact",
    };

    const items = pathSegments
        .map((segment, index) => {
            if (segment === "page") {
                return null;
            }

            const isPaginated = pathSegments[index - 1] === "page";
            const href = isPaginated
                ? "/blog"
                : "/" + pathSegments.slice(0, index + 1).join("/");

            const isLast = index === pathSegments.length - 1;

            let label = "";

            if (variant === "pathname") {
                label = segment
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");
            } else {
                label =
                    segmentToLabel[segment] ||
                    segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
            }

            if (isPaginated && isLast) {
                label = segment; // e.g. "2"
            }

            if (isLast && pathSegments[0] === "blog" && postTitle && pathSegments[1] !== "page") {
                label = postTitle;
            }

            // Use a more unique key: index + segment (or index + href if you prefer)
            const uniqueKey = `${index}-${segment}`;

            return (
                <React.Fragment key={uniqueKey}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                        {isLast ? (
                            <BreadcrumbPage>{label}</BreadcrumbPage>
                        ) : (
                            <BreadcrumbLink asChild>
                                <TransitionLink href={href}>{label}</TransitionLink>
                            </BreadcrumbLink>
                        )}
                    </BreadcrumbItem>
                </React.Fragment>
            );
        })
        .filter(Boolean);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <TransitionLink href="/">
                            <Home className="h-4 w-4" />
                            <span className="sr-only">Home</span>
                        </TransitionLink>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {items.length > 0 && <BreadcrumbSeparator />}
                {items}
            </BreadcrumbList>
        </Breadcrumb>
    );
}