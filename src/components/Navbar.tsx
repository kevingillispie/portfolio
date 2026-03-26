// src/components/Navbar.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { House, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import TransitionLink from "./TransitionLink";

export default function Navbar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed top-4 left-2 lg:left-4 xl:left-10 z-50 flex items-center gap-3">
            {/* Home Button */}
            <TransitionLink
                href="/"
                className={cn(
                    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-lg bg-zinc-100/90 backdrop-blur-md shadow-lg border size-10",
                    isActive("/") && "font-medium"
                )}
                aria-label="Link to homepage"
            >
                <House className="size-5" aria-hidden="true" />
            </TransitionLink>

            {/* Menu Dropdown - styled to match the home button */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-lg bg-zinc-100/90 backdrop-blur-md shadow-lg border size-10"
                        aria-label="Menu open button"
                    >
                        <Menu className="size-5" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="start"
                    className="min-w-[200px] mt-1 rounded-lg border bg-zinc-100/90 dark:bg-zinc-800 backdrop-blur-md shadow-lg"
                >
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <TransitionLink
                                href="/blog"
                                className={cn(
                                    "flex items-center justify-between w-full cursor-pointer px-2 py-1.5 text-sm",
                                    isActive("/blog") && "bg-accent font-medium"
                                )}
                                onClick={() => {
                                    // Force close the dropdown immediately
                                    const closeEvent = new KeyboardEvent("keydown", { key: "Escape" });
                                    document.dispatchEvent(closeEvent);
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <code className="text-xs">//PlainText</code>
                                </div>
                                <span className="text-xs text-zinc-400 font-mono">/blog</span>
                            </TransitionLink>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-zinc-200/70 dark:bg-zinc-700/70" />

                        <DropdownMenuItem asChild>
                            <TransitionLink
                                href="/contact"
                                className={cn(
                                    "flex items-center justify-between w-full cursor-pointer px-2 py-1.5 text-sm",
                                    isActive("/contact") && "bg-accent font-medium"
                                )}
                                onClick={() => {
                                    const closeEvent = new KeyboardEvent("keydown", { key: "Escape" });
                                    document.dispatchEvent(closeEvent);
                                }}
                            >
                                <span>Contact</span>
                                <span className="text-xs text-zinc-400 font-mono">/contact</span>
                            </TransitionLink>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu >
        </div >
    );
}