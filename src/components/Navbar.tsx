"use client";

import {
    Menubar,
    MenubarContent,
    MenubarGroup,
    MenubarItem,
    MenubarShortcut,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Assuming you have this from shadcn setup

export default function Navbar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed top-4 left-4 z-50">
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
                                    href="/"
                                    className={cn(
                                        "flex items-center gap-2 cursor-pointer",
                                        isActive("/") && "bg-accent font-medium"
                                    )}
                                >
                                    Home
                                </Link>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem asChild>
                                <Link
                                    href="/projects"
                                    className={cn(
                                        "flex items-center gap-2 cursor-pointer",
                                        isActive("/projects") && "bg-accent font-medium"
                                    )}
                                >
                                    Projects
                                </Link>
                            </MenubarItem>
                            <MenubarItem asChild>
                                <Link
                                    href="/blog"
                                    className={cn(
                                        "flex items-center gap-2 cursor-pointer",
                                        isActive("/blog") && "bg-accent font-medium"
                                    )}
                                >
                                    Plain Text <MenubarShortcut>Blog</MenubarShortcut>
                                </Link>
                            </MenubarItem>
                            <MenubarItem asChild>
                                <Link
                                    href="/contact"
                                    className={cn(
                                        "flex items-center gap-2 cursor-pointer",
                                        isActive("/contact") && "bg-accent font-medium"
                                    )}
                                >
                                    Contact
                                </Link>
                            </MenubarItem>
                        </MenubarGroup>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    );
}