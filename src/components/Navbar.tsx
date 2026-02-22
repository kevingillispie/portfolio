"use client";

import {
    Menubar,
    MenubarContent,
    MenubarGroup,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { House, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-3"> {/* ← flex row + gap */}
            {/* Home icon as standalone Menubar (or just a button) */}
            <Menubar className="rounded-lg border bg-zinc-100/90 backdrop-blur-md shadow-lg px-3 py-2">
                <Link
                    href="/"
                    className={cn(
                        "flex items-center gap-2 cursor-pointer",
                        isActive("/") && "bg-accent font-medium"
                    )}
                >
                    <House width={18} height={18} />
                </Link>
            </Menubar>

            {/* Menu dropdown */}
            <Menubar className="rounded-lg border bg-zinc-100/90 backdrop-blur-md shadow-lg py-2">
                <MenubarMenu>
                    <MenubarTrigger className="flex items-center gap-2 cursor-pointer">
                        <Menu width={18} height={18} />
                        Menu
                    </MenubarTrigger>
                    <MenubarContent className="min-w-[180px]">
                        <MenubarGroup>
                            <MenubarItem asChild>
                                <Link
                                    href="/blog"
                                    className={cn(
                                        "flex items-center gap-2 cursor-pointer",
                                        isActive("/blog") && "bg-accent font-medium"
                                    )}
                                >
                                    Plain Text <MenubarShortcut className="text-zinc-400">/blog</MenubarShortcut>
                                </Link>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem asChild>
                                <Link
                                    href="/contact"
                                    className={cn(
                                        "flex items-center gap-2 cursor-pointer",
                                        isActive("/contact") && "bg-accent font-medium"
                                    )}
                                >
                                    Contact <MenubarShortcut className="text-zinc-400">/contact</MenubarShortcut>
                                </Link>
                            </MenubarItem>
                        </MenubarGroup>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    );
}