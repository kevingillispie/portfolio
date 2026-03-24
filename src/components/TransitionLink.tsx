"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoading } from "@/components/LoadingScreen";   // ← new import
import React from "react";

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export default function TransitionLink({ href, children, className, ...props }: TransitionLinkProps) {
    const router = useRouter();
    const { startTransition } = useLoading();

    const handleTransition = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;

        // Always close dropdown immediately
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

        const isEnabled = localStorage.getItem("particles-enabled") !== "false";

        if (!isEnabled) {
            // Normal navigation (still wrapped so loading screen can show if needed)
            startTransition(() => router.push(href));
            return;
        }

        // Fancy path
        e.preventDefault();

        const { clientX, clientY } = e;

        // Trigger explosion (particles) – completely independent now
        window.dispatchEvent(new CustomEvent("trigger-explosion", {
            detail: { x: clientX, y: clientY }
        }));

        const overlay = document.getElementById("nav-overlay");
        if (overlay) {
            overlay.style.setProperty("--x", `${clientX}px`);
            overlay.style.setProperty("--y", `${clientY}px`);
            overlay.classList.add("overlay-active");
        }

        // Start the transition → loading screen appears and stays until page is ready
        startTransition(() => {
            router.push(href);

            // Clean up overlay after navigation (small delay for smoothness)
            setTimeout(() => {
                overlay?.classList.remove("overlay-active");
            }, 400);
        });
    };

    return (
        <Link {...props} href={href} onClick={handleTransition} className={className}>
            {children}
        </Link>
    );
}