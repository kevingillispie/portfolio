"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Settings, Moon, Sun, Monitor, Check } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function SettingsMenu() {
    const { theme, setTheme } = useTheme();
    const [particlesEnabled, setParticlesEnabled] = useState(true);
    const [mounted, setMounted] = useState(false);

    // Prevent Hydration Mismatch
    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("particles-enabled");
        setParticlesEnabled(saved !== "false");
    }, []);

    const toggleParticles = (e: Event) => {
        e.preventDefault();
        const newState = !particlesEnabled;
        setParticlesEnabled(newState);
        localStorage.setItem("particles-enabled", String(newState));
        window.dispatchEvent(new CustomEvent("toggle-particles", { detail: newState }));
    };

    if (!mounted) return null;

    return (
        <div className="fixed top-4 right-4 z-50">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-lg bg-zinc-100/90 backdrop-blur-md shadow-lg border">
                        <Settings className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Particles Toggle */}
                    <DropdownMenuCheckboxItem
                        checked={particlesEnabled}
                        onSelect={toggleParticles}
                        className="cursor-pointer"
                    >
                        Click Animations
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuSeparator />

                    {/* Theme Submenu */}
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span>Theme</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    <Sun className="mr-2 h-4 w-4" /> Light {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    <Moon className="mr-2 h-4 w-4" /> Dark {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    <Monitor className="mr-2 h-4 w-4" /> System {theme === "system" && <Check className="ml-auto h-4 w-4" />}
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}