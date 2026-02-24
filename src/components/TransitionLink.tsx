"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export default function TransitionLink({ href, children, className, ...props }: TransitionLinkProps) {
    const router = useRouter();

    const handleTransition = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;

        // 1. Check if animations are enabled
        const isEnabled = localStorage.getItem("particles-enabled") !== "false";

        // 2. If DISABLED: Navigate immediately and exit
        if (!isEnabled) {
            return; // Let the default <Link> behavior take over or call router.push(href)
        }

        // 3. If ENABLED: Run the flashy stuff
        e.preventDefault();
        const { clientX, clientY } = e;

        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

        window.dispatchEvent(new CustomEvent("trigger-explosion", {
            detail: { x: clientX, y: clientY }
        }));

        const overlay = document.getElementById("nav-overlay");
        if (overlay) {
            overlay.style.setProperty("--x", `${clientX}px`);
            overlay.style.setProperty("--y", `${clientY}px`);
            overlay.classList.add("overlay-active");
        }

        setTimeout(() => {
            router.push(href);
            setTimeout(() => overlay?.classList.remove("overlay-active"), 500);
        }, 800);
    };

    return (
        <Link {...props} href={href} onClick={handleTransition} className={className}>
            {children}
        </Link>
    );
}