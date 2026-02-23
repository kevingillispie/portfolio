"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface TransitionLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export default function TransitionLink({ href, children, className }: TransitionLinkProps) {
    const router = useRouter();

    const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const { clientX, clientY } = e;

        // 1. Dispatch the custom event
        window.dispatchEvent(new CustomEvent("trigger-explosion", {
            detail: { x: clientX, y: clientY }
        }));

        // 2. Handle the Overlay
        const overlay = document.getElementById("nav-overlay");
        if (overlay) {
            overlay.style.setProperty("--x", `${clientX}px`);
            overlay.style.setProperty("--y", `${clientY}px`);
            overlay.classList.add("overlay-active");
        }

        // 3. Navigate
        setTimeout(() => {
            router.push(href);
            setTimeout(() => overlay?.classList.remove("overlay-active"), 500);
        }, 800);
    };

    return (
        <Link href={href} onClick={handleTransition} className={className}>
            {children}
        </Link>
    );
}