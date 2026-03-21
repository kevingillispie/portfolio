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
            <Button
                variant="outline"
                size="icon"
                className="rounded-lg bg-zinc-100/90 backdrop-blur-md shadow-lg border size-10"
                aria-label="Home button"
            >
                <TransitionLink
                    href="/"
                    className={cn(
                        "flex items-center justify-center",
                        isActive("/") && "font-medium"
                    )}
                    aria-label="Link to homepage."
                >
                    <House className="size-5" />
                </TransitionLink>
            </Button>

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
                            >
                                <span>Contact</span>
                                <span className="text-xs text-zinc-400 font-mono">/contact</span>
                            </TransitionLink>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}