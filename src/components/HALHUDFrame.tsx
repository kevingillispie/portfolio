"use client";

export default function HALHUDFrame() {
    return (
        /* Changed to -z-1 and added a temporary red border to debug positioning */
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden font-mono text-[10px] uppercase tracking-widest text-white/40 min-h-screen">

            {/* 1. Left Ruler - Boosted opacity */}
            <div className="absolute left-8 top-1/4 bottom-1/4 w-[1px] bg-white/20 flex flex-col justify-between items-start py-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-[1px] bg-white/60" />
                        <span className="hidden md:block">REF_0{i * 2}</span>
                    </div>
                ))}
            </div>

            {/* 2. Top Navigation Bar - Solidified lines */}
            <div className="absolute top-10 left-16 right-16 flex justify-between border-t border-white/30 pt-3">
                <div className="flex gap-10">
                    <span className="text-red-500/80 font-bold tracking-normal">● LIVE_STREAM</span>
                    <span>SYS_CORE: 04</span>
                </div>
                <div className="flex gap-10">
                    <span>SCAN_HZ: 60.00</span>
                    <span>BUFFER: NOMINAL</span>
                </div>
            </div>

            {/* 3. Corner Brackets - Using Divs instead of SVG for guaranteed rendering */}
            {/* Top Left */}
            <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-white/20" />
            {/* Top Right */}
            <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-white/20" />
            {/* Bottom Left */}
            <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-white/20" />
            {/* Bottom Right */}
            <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-white/20" />

            {/* 4. Bottom Right Data Block */}
            <div className="absolute bottom-10 right-16 text-right leading-tight">
                <p className="text-white/60">LN_PROC: 0x44F2</p>
                <p>SEQ_ID: 88102-B</p>
            </div>
        </div>
    );
}