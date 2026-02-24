"use client";

import { useEffect, useState } from "react";
import {
    Menubar,
    MenubarContent,
    MenubarGroup,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
    MenubarCheckboxItem, // 1. Import the specific checkbox item
} from "@/components/ui/menubar";
import { House, Menu, Sparkles } from "lucide-react"; // Sparkles adds a nice touch
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import TransitionLink from "./TransitionLink";

export default function Navbar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;
    const [particlesEnabled, setParticlesEnabled] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("particles-enabled");
        setParticlesEnabled(saved !== "false");
    }, []);

    const toggleParticles = (e: Event) => {
        // Prevents the menu from closing on click
        e.preventDefault();

        const newState = !particlesEnabled;
        setParticlesEnabled(newState);
        localStorage.setItem("particles-enabled", String(newState));
        window.dispatchEvent(new CustomEvent("toggle-particles", { detail: newState }));
    };

    return (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-3">
            {/* Home Link */}
            <Menubar className="rounded-lg border bg-zinc-100/90 dark:bg-zinc-900 backdrop-blur-md shadow-lg px-3 py-2">
                <TransitionLink
                    href="/"
                    className={cn(
                        "flex items-center gap-2 cursor-pointer",
                        isActive("/") && "bg-accent font-medium"
                    )}
                >
                    <House width={18} height={18} />
                </TransitionLink>
            </Menubar>

            {/* Menu Dropdown */}
            <Menubar className="rounded-lg border bg-zinc-100/90 dark:bg-zinc-900 backdrop-blur-md shadow-lg py-2">
                <MenubarMenu>
                    <MenubarTrigger className="flex items-center gap-2 cursor-pointer">
                        <Menu width={18} height={18} />
                        Pages
                    </MenubarTrigger>
                    <MenubarContent className="min-w-[200px]">
                        <MenubarGroup>
                            <MenubarItem asChild>
                                <TransitionLink
                                    href="/blog"
                                    className={cn(
                                        "flex items-center gap-2 cursor-pointer",
                                        isActive("/blog") && "bg-accent font-medium"
                                    )}
                                >
                                    Plain Text <MenubarShortcut className="text-zinc-400">/blog</MenubarShortcut>
                                </TransitionLink>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem asChild>
                                <TransitionLink
                                    href="/contact"
                                    className={cn(
                                        "flex items-center gap-2 cursor-pointer",
                                        isActive("/contact") && "bg-accent font-medium"
                                    )}
                                >
                                    Contact <MenubarShortcut className="text-zinc-400">/contact</MenubarShortcut>
                                </TransitionLink>
                            </MenubarItem>
                        </MenubarGroup>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    );
}