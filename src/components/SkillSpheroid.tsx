'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const baseSkills = [
    { name: "Security+", cat: "cyber" }, { name: "Network+", cat: "cyber" },
    { name: "Full-Stack Dev", cat: "dev" }, { name: "SOC Level 1", cat: "cyber" },
    { name: "OverPhish", cat: "project" }, { name: "Schema Scalpel", cat: "project" },
    { name: "AI Integration", cat: "dev" }, { name: "Digital Art", cat: "creative" },
    { name: "Google Cyber", cat: "cyber" }, { name: "React", cat: "dev" },
    { name: "Photography", cat: "creative" }, { name: "WordPress", cat: "dev" },
    { name: "CompTIA Certified", cat: "cyber" }, { name: "PHP", cat: "dev" },
    { name: "Classical Ed", cat: "teaching" }, { name: "Browser Addons", cat: "dev" },
    { name: "Linux", cat: "cyber" }, { name: "Adobe CC", cat: "creative" },
    { name: "Python", cat: "cyber" }, { name: "English Comp", cat: "creative" },
    { name: "WP Plugins", cat: "dev" },
];

const multipliedSkills = [...baseSkills, ...baseSkills, ...baseSkills];

const catColors: Record<string, string> = {
    cyber: "border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500",
    dev: "border-cyan-500/40 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500",
    project: "border-purple-500/40 bg-purple-500/10 text-purple-400 hover:bg-purple-500",
    creative: "border-pink-500/20 bg-pink-500/5 text-pink-500/60 hover:bg-pink-500",
    teaching: "border-emerald-500/20 bg-emerald-500/5 text-emerald-500/60 hover:bg-emerald-500",
};

const lineColors: Record<string, string> = {
    cyber: "#3b82f6", dev: "#06b6d4", project: "#a855f7", creative: "#ec4899", teaching: "#10b981",
};

function Word({ children, category, onHover, ...props }: { children: string; category: string; onHover: (cat: string | null) => void;[key: string]: any }) {
    const ref = useRef<THREE.Group>(null!);
    const isPriority = ['cyber', 'dev', 'project'].includes(category);

    useFrame((state) => {
        ref.current.quaternion.copy(state.camera.quaternion);
    });

    return (
        <group ref={ref} {...props}>
            <Html distanceFactor={10}>
                <div
                    onPointerOver={() => onHover(category)}
                    onPointerOut={() => onHover(null)}
                    className={cn(
                        "transition-all duration-300 ease-out select-none cursor-grab active:cursor-grabbing",
                        isPriority ? "scale-[1.1]" : "scale-90 opacity-60",
                        "hover:scale-125 hover:z-50 hover:opacity-100"
                    )}
                >
                    <Badge variant="outline" className={cn(
                        "whitespace-nowrap px-2 py-0.5 text-[8px] font-bold uppercase tracking-tighter -translate-x-1/2",
                        catColors[category],
                        "hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:border-white hover:text-white"
                    )}>
                        {children}
                    </Badge>
                </div>
            </Html>
        </group>
    );
}

function Cloud({ radius = 6.4 }) {
    const groupRef = useRef<THREE.Group>(null!);
    const [activeCat, setActiveCat] = useState<string | null>(null);

    const { words, connections } = useMemo(() => {
        const wordArr = [];
        const connMap: Record<string, THREE.Vector3[]> = {};
        const phiSpan = Math.PI * (3 - Math.sqrt(5));

        for (let i = 0; i < multipliedSkills.length; i++) {
            const y = 1 - (i / (multipliedSkills.length - 1)) * 2;
            const r = Math.sqrt(1 - y * y);
            const theta = phiSpan * i;
            const pos = new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius);
            const cat = multipliedSkills[i].cat;
            wordArr.push({ pos, name: multipliedSkills[i].name, cat });
            if (!connMap[cat]) connMap[cat] = [];
            connMap[cat].push(pos);
        }
        return { words: wordArr, connections: connMap };
    }, [radius]);

    const rotationRef = useRef({ velX: 0, velY: 0 });
    const pointerRef = useRef({ x: 0, y: 0, isDown: false });

    useFrame(() => {
        if (!pointerRef.current.isDown) {
            rotationRef.current.velX *= 0.95;
            rotationRef.current.velY *= 0.95;
            groupRef.current.rotation.y += 0.0015 + rotationRef.current.velX;
            groupRef.current.rotation.x += rotationRef.current.velY;
        } else {
            groupRef.current.rotation.y += rotationRef.current.velX;
            groupRef.current.rotation.x += rotationRef.current.velY;
        }
    });

    const handlePointerDown = (e: any) => { e.stopPropagation(); pointerRef.current.isDown = true; pointerRef.current.x = e.clientX; pointerRef.current.y = e.clientY; };
    const handlePointerUp = () => { pointerRef.current.isDown = false; };
    const handlePointerMove = (e: any) => {
        if (!pointerRef.current.isDown) return;
        rotationRef.current.velX = (e.clientX - pointerRef.current.x) * 0.005;
        rotationRef.current.velY = (e.clientY - pointerRef.current.y) * 0.005;
        pointerRef.current.x = e.clientX; pointerRef.current.y = e.clientY;
    };

    return (
        <group
            ref={groupRef}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerUp}
            rotation={[-0.6, 0, -0.6]} // <--- CHANGE AXIS HERE (X, Y, Z in radians)
        >
            {Object.entries(connections).map(([cat, points]) => (
                <Line
                    key={cat}
                    points={points}
                    color={lineColors[cat]}
                    lineWidth={activeCat === cat ? 1.5 : 1} // Glow effect on width
                    transparent
                    opacity={activeCat === cat ? 0.6 : 0.1} // Glow effect on opacity
                />
            ))}

            <mesh visible={false}><sphereGeometry args={[radius * 1.2, 16, 16]} /><meshBasicMaterial /></mesh>

            {words.map((item, index) => (
                <Word
                    key={index}
                    position={item.pos}
                    category={item.cat}
                    onHover={setActiveCat}
                >
                    {item.name}
                </Word>
            ))}
        </group>
    );
}

export default function SkillSpheroid() {
    return (
        <div className="relative z-0 w-full h-[355px] bg-background rounded-xl border relative overflow-hidden flex items-center justify-center">
            <div className="absolute z-1 top-[1rem] left-[1rem] pointer-events-none select-none">
                <Badge variant="default" className="px-4 py-2 shadow-xl border-white/20">
                    <h3 className="text-sm tracking-[0.3em] uppercase">Skill Nexus</h3>
                </Badge>
            </div>
            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 16], fov: 35 }} className='z-0'>
                <ambientLight intensity={1.5} />
                <React.Suspense fallback={null}>
                    <Cloud radius={6.2} />
                </React.Suspense>
            </Canvas>

        </div>
    );
}