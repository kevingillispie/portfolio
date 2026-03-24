"use client";

import { createContext, useContext, useTransition, useState, useEffect, useRef } from "react";
import { Spinner } from "@/components/ui/spinner";

const messages = [
    "GRANTING ACCESS...",
    "ALMOST THERE...",
    "HOLD ON...",
    "LOADING THE GOOD STUFF...",
    "JUST A SEC...",
    "BREWING SOMETHING NICE...",
    "WARPING REALITY...",
    "CONNECTING THE DOTS...",
];

type LoadingContextType = {
    isPending: boolean;
    startTransition: (callback: () => void) => void;
};

const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingScreen({ children }: { children: React.ReactNode }) {
    const [isPending, startTransition] = useTransition();
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    // Use a ref to track if we're currently showing the loader
    const isLoadingRef = useRef(false);

    useEffect(() => {
        if (isPending) {
            // Only reset and start cycling when loading actually starts
            if (!isLoadingRef.current) {
                isLoadingRef.current = true;
                setCurrentMessageIndex(0);   // Safe now — runs only on transition from false → true
            }

            const interval = setInterval(() => {
                setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
            }, 1500);

            return () => clearInterval(interval);
        } else {
            // Loading finished
            isLoadingRef.current = false;
            setCurrentMessageIndex(0);
        }
    }, [isPending]); // Only re-run when isPending actually changes

    const value = { isPending, startTransition };

    return (
        <LoadingContext.Provider value={value}>
            {children}

            {isPending && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/90 backdrop-blur-md">
                    <div className="flex flex-col items-center gap-6">
                        <Spinner className="size-12 text-white" />
                        <p
                            className="text-zinc-400 text-sm font-mono tracking-widest min-h-[1.25em] transition-opacity duration-300"
                            key={currentMessageIndex}
                        >
                            {messages[currentMessageIndex]}
                        </p>
                    </div>
                </div>
            )}
        </LoadingContext.Provider>
    );
}

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) throw new Error("useLoading must be used within LoadingScreen");
    return context;
};