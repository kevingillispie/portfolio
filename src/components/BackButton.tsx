"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function BackButton() {
    const router = useRouter();
    const pathname = usePathname();
    const [prevPath, setPrevPath] = useState<string | null>(null);

    useEffect(() => {
        // Very basic: store previous path on mount (won't be perfect across navigations)
        const handleRouteChange = () => {
            setPrevPath(pathname);
        };

        // Not ideal, but can help in some cases
        window.addEventListener("popstate", handleRouteChange);
        return () => window.removeEventListener("popstate", handleRouteChange);
    }, [pathname]);

    const handleClick = () => {
        router.back();
    };

    const isBlogList = prevPath?.match(/^\/blog(\/page\/\d+)?$/);
    const pageMatch = prevPath?.match(/\/page\/(\d+)/);
    const pageNum = pageMatch ? pageMatch[1] : null;

    const label = pageNum ? `Back to Page ${pageNum}` : "Back";

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleClick}
            className="text-muted-foreground rounded-md border border-zinc-400 cursor-pointer"
        >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="pr-1">{label}</span>
        </Button>
    );
}