"use client";

import { useEffect, useRef, useState } from "react";

function measureRefreshRate(callback: (fps: number) => void, durationMs = 2800) {
    let frameCount = 0;
    let startTime: number | null = null;

    function tick(time: number) {
        if (startTime === null) {
            startTime = time;
        }

        frameCount++;

        if (time - startTime >= durationMs) {
            // frames per second, rounded to nearest integer
            const fps = Math.round((frameCount * 1000) / (time - startTime));
            callback(fps);
            return;
        }

        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

function getApproximatePageTransferSize() {
    const resources = performance.getEntriesByType("resource");
    let totalTransferred = 0;
    let resourceCount = resources.length;

    // Main document (navigation entry)
    const navEntries = performance.getEntriesByType("navigation");
    if (navEntries.length > 0) {
        const nav = navEntries[0] as PerformanceNavigationTiming;
        totalTransferred += nav.transferSize || nav.encodedBodySize || 0;
        resourceCount += 1;
    }

    resources.forEach((entry) => {
        const r = entry as PerformanceResourceTiming;
        totalTransferred += r.transferSize || r.encodedBodySize || 0;
    });

    const kb = (totalTransferred / 1024);
    const display = kb < 1 ? `${(totalTransferred)} B` : kb < 1000
        ? `${kb.toFixed(1)} KB`
        : `${(kb / 1024).toFixed(2)} MB`;

    return {
        display,
        transferredBytes: totalTransferred,
        resourceCount
    };
}

async function estimatePageMemory() {
    // Modern API (preferred, requires cross-origin isolation)
    if ("measureUserAgentSpecificMemory" in performance) {
        try {
            const result = await (performance as any).measureUserAgentSpecificMemory();
            const mb = (result.bytes / 1024 / 1024).toFixed(1);
            return `${mb} MB`;
        } catch (err) {
            console.error("measureUserAgentSpecificMemory failed:", err);
        }
    }

    // Legacy fallback (Chromium only, deprecated but still works in many cases)
    // @ts-expect-error - non-standard
    if (performance.memory && typeof performance.memory.usedJSHeapSize === "number") {
        const mb = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
        return `${mb} MB (JS heap)`;
    }

    return "N/A";
}


export default function HALHUDFrame() {
    const hzRef = useRef<HTMLSpanElement>(null);
    const memoryRef = useRef<HTMLSpanElement>(null);
    const devMemRef = useRef<HTMLSpanElement>(null);
    const serverRespRef = useRef<HTMLSpanElement>(null);
    const pageLoadRef = useRef<HTMLSpanElement>(null);
    const timestampRef = useRef<HTMLSpanElement>(null);
    const sizeRef = useRef<HTMLSpanElement>(null);
    const rulerContainerRef = useRef<HTMLDivElement>(null);
    const [measuredHz, setMeasuredHz] = useState<number | null>(null);

    // Timestamp – unchanged
    useEffect(() => {
        if (timestampRef.current) {
            const now = new Date();
            const year = now.getFullYear().toString();
            const month = (now.getMonth() + 1).toString().padStart(2, "0");
            const day = now.getDate().toString().padStart(2, "0");
            const hours = now.getHours().toString().padStart(2, "0");
            const minutes = now.getMinutes().toString().padStart(2, "0");
            const seconds = now.getSeconds().toString().padStart(2, "0");

            const numericStr = year + month + day + hours + minutes + seconds;
            const grouped = numericStr.match(/.{1,4}/g)?.join(":") || "LOADING...";
            timestampRef.current.textContent = grouped;
        }
    }, []);

    // Memory estimate – unchanged
    useEffect(() => {
        if (!memoryRef.current) return;
        memoryRef.current.textContent = "MEASURING...";
        memoryRef.current.className = memoryRef.current.className.replace("text-green-500", "text-yellow-500");

        const timer = setTimeout(async () => {
            const estimate = await estimatePageMemory();
            if (memoryRef.current) {
                memoryRef.current.textContent = estimate;
                const numMatch = estimate.match(/(\d+\.?\d*)/);
                const mb = numMatch ? parseFloat(numMatch[1]) : 0;

                memoryRef.current.className = memoryRef.current.className
                    .replace("text-yellow-500", "")
                    .replace("text-orange-400", "");

                if (estimate.includes("N/A")) {
                    memoryRef.current.className += " text-zinc-500";
                } else if (mb > 400) {
                    memoryRef.current.className += " text-orange-400";
                } else {
                    memoryRef.current.className += " text-green-500";
                }
            }
        }, 1800);

        return () => clearTimeout(timer);
    }, []);

    // SCAN_HZ – unchanged
    useEffect(() => {
        if (!hzRef.current) return;

        hzRef.current.textContent = "MEASURING";
        hzRef.current.className = hzRef.current.className.replace("text-green-500", "text-yellow-500");

        measureRefreshRate((fps) => {
            setMeasuredHz(fps);
            if (hzRef.current) {
                const display = fps.toFixed(2).padStart(5, " ");
                hzRef.current.textContent = display;

                hzRef.current.className = hzRef.current.className
                    .replace("text-yellow-500", "text-green-500")
                    .replace("text-orange-400", "");

                if (fps < 50) {
                    hzRef.current.className += " text-orange-400";
                }
            }
        }, 2800);

        const timeout = setTimeout(() => {
            if (measuredHz === null && hzRef.current) {
                hzRef.current.textContent = "60.00";
                hzRef.current.className = hzRef.current.className.replace("text-yellow-500", "text-green-500");
            }
        }, 6000);

        return () => clearTimeout(timeout);
    }, [measuredHz]);

    // NET_LOAD – unchanged
    useEffect(() => {
        if (!sizeRef.current) return;

        const timer = setTimeout(() => {
            const stats = getApproximatePageTransferSize();
            if (sizeRef.current) {
                sizeRef.current.textContent = stats.display;
                if (stats.transferredBytes > 2_000_000) {
                    sizeRef.current.className += " text-orange-400";
                } else if (stats.transferredBytes > 800_000) {
                    sizeRef.current.className += " text-yellow-400";
                }
            }
        }, 2200);

        return () => clearTimeout(timer);
    }, []);

    // Live ruler update – distance from each tick to viewport top
    useEffect(() => {
        const container = rulerContainerRef.current;
        if (!container) return;

        const labels = container.querySelectorAll('span[data-ruler-label]') as NodeListOf<HTMLSpanElement>;
        if (labels.length === 0) return;

        const updateDistances = () => {
            const scrollY = window.scrollY;
            const containerRect = container.getBoundingClientRect();
            const rulerHeight = container.clientHeight;

            labels.forEach((label, i) => {
                // Approximate absolute document position of this tick mark
                const tickOffset = (i / (labels.length - 1)) * rulerHeight;
                const absoluteTop = window.scrollY + containerRect.top + tickOffset;

                const distance = Math.round(absoluteTop - scrollY);
                label.textContent = `${Math.max(0, distance).toLocaleString()} px`;

                // Visual feedback
                if (distance <= 0) {
                    label.className = "hidden md:block text-zinc-500/40 line-through";
                } else if (distance < 300) {
                    label.className = "hidden md:block text-orange-400/90";
                } else {
                    label.className = "hidden md:block text-zinc-700 dark:text-zinc-200";
                }
            });
        };

        updateDistances(); // initial
        window.addEventListener('scroll', updateDistances, { passive: true });
        window.addEventListener('resize', updateDistances);

        return () => {
            window.removeEventListener('scroll', updateDistances);
            window.removeEventListener('resize', updateDistances);
        };
    }, []);

    // All client-only diagnostics
    useEffect(() => {
        if (typeof window === "undefined") return;

        // DEV_MEM / fallback to cores
        if (devMemRef.current) {
            let text = "N/A";
            let colorClass = "text-zinc-500";

            if ("deviceMemory" in navigator) {
                const ramGB = (navigator as any).deviceMemory;
                text = `${ramGB} GB`;
                colorClass = "text-cyan-400";
                if (ramGB >= 8) text += " HIGH";
                else if (ramGB >= 4) {
                    text += " MID";
                    colorClass = "text-yellow-400";
                } else {
                    text += " LOW";
                    colorClass = "text-orange-400";
                }
            } else if ("hardwareConcurrency" in navigator) {
                const cores = navigator.hardwareConcurrency;
                text = `${cores} CORES`;
                colorClass = cores >= 8 ? "text-cyan-400" : cores >= 4 ? "text-yellow-400" : "text-orange-400";
            }

            devMemRef.current.textContent = text;
            devMemRef.current.className = colorClass;
        }

        // SER_RESP: Server response time
        if (serverRespRef.current) {
            const navEntries = performance.getEntriesByType("navigation");
            if (navEntries.length > 0) {
                const nav = navEntries[0] as PerformanceNavigationTiming;
                const serverTime = Math.round(nav.responseEnd - nav.responseStart);
                serverRespRef.current.textContent = `${serverTime} ms`;

                let color = "text-green-500";
                if (serverTime > 400) color = "text-orange-400";
                else if (serverTime > 200) color = "text-yellow-400";

                serverRespRef.current.className = color;
            } else {
                serverRespRef.current.textContent = "N/A";
                serverRespRef.current.className = "text-zinc-500";
            }
        }

        // PAGE_LOAD: Total navigation duration
        if (pageLoadRef.current) {
            const navEntries = performance.getEntriesByType("navigation");
            if (navEntries.length > 0) {
                const nav = navEntries[0] as PerformanceNavigationTiming;
                const totalDuration = Math.round(nav.duration);
                pageLoadRef.current.textContent = `${totalDuration} ms`;

                let color = "text-green-500";
                if (totalDuration > 5000) color = "text-orange-400";
                else if (totalDuration > 3000) color = "text-yellow-400";

                pageLoadRef.current.className = color;
            } else {
                pageLoadRef.current.textContent = "N/A";
                pageLoadRef.current.className = "text-zinc-500";
            }
        }
    }, []);

    return (
        <div className="absolute mt-8 inset-0 -z-[1] pointer-events-none overflow-hidden font-mono text-[10px] uppercase tracking-widest text-white/40 min-h-screen">

            {/* Left Ruler – live distance to viewport top (countdown to 0 px) */}
            <div
                ref={rulerContainerRef}
                className="absolute left-10 top-1/4 bottom-1/4 w-[1px] bg-zinc-400 dark:bg-white/20 flex flex-col justify-between items-start py-8"
            >
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-[1px] bg-zinc-400 dark:bg-white/60" />
                        <span
                            data-ruler-label
                            className="hidden md:block text-zinc-700 dark:text-zinc-200"
                        >
                            ... px
                        </span>
                    </div>
                ))}
            </div>

            {/* Top Navigation Bar */}
            <div className="absolute top-10 left-16 right-16 flex justify-between border-t border-zinc-400 dark:border-white/20 pt-3">
                <div className="leading-tight text-zinc-700 dark:text-zinc-200">
                    <p>SER_RESP: <span ref={serverRespRef} className="text-green-500">...</span></p>
                    <p>NET_LOAD: <span ref={sizeRef} id="page-size">LOADING...</span></p>
                </div>
                <div className="leading-tight text-zinc-700 dark:text-zinc-200">
                    <p>
                        DEV_MEM: <span ref={devMemRef} className="text-cyan-400">...</span>
                    </p>
                    <p>
                        SCAN_HZ: <span ref={hzRef} id="hz-rate" className="text-green-500">MEASURING</span>
                    </p>
                </div>
            </div>

            {/* Corner Brackets */}
            <div className="absolute top-10 left-10 w-6 h-8 border-t border-l border-zinc-400 dark:border-white/20" />
            <div className="absolute top-10 right-10 w-6 h-8 border-t border-r border-zinc-400 dark:border-white/20" />
            <div className="absolute bottom-32 left-10 w-8 h-8 border-b-2 border-l-2 border-zinc-400 dark:border-white/20" />
            <div className="absolute bottom-32 right-10 w-8 h-8 border-b-2 border-r-2 border-zinc-400 dark:border-white/20" />

            {/* Bottom Left – PAGE_LOAD */}
            <div className="absolute bottom-35 left-16 leading-tight text-zinc-700 dark:text-zinc-200">
                <p>PAGE_LOAD: <span ref={pageLoadRef} id="timestamp">LOADING...</span></p>
            </div>

            {/* Bottom Right – SEQ_ID */}
            <div className="absolute bottom-35 right-16 text-right leading-tight text-zinc-700 dark:text-zinc-200">
                <p>SEQ_ID: <span ref={timestampRef} id="timestamp">LOADING...</span></p>
            </div>
        </div>
    );
}