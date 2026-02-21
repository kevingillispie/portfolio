"use client";

import React from "react";
import { useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";

interface BreadcrumbNavProps {
    variant?: "friendly" | "pathname";
}

export function BreadcrumbNav({ variant = "friendly" }: BreadcrumbNavProps) {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean);

    const [postTitle, setPostTitle] = useState<string | null>(null);

    // If on blog post page, fetch title
    useEffect(() => {
        if (pathSegments[0] === "blog" && pathSegments[1]) {
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

    const items = pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");
        const isLast = index === pathSegments.length - 1;

        let label = "";

        if (variant === "pathname") {
            label = segment.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        } else {
            label = segmentToLabel[segment] ||
                segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
        }

        // Override last segment with real title if fetched
        if (isLast && pathSegments[0] === "blog" && postTitle) {
            label = postTitle;
        }

        return (
            <React.Fragment key={href}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                    {isLast ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                        <BreadcrumbLink asChild>
                            <Link href={href}>{label}</Link>
                        </BreadcrumbLink>
                    )}
                </BreadcrumbItem>
            </React.Fragment>
        );
    });

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {items.length > 0 && <BreadcrumbSeparator />}
                {items}
            </BreadcrumbList>
        </Breadcrumb>
    );
}