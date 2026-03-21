'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // Standard shadcn helper

const skills = [
    { name: "Security+", cat: "cyber" }, { name: "Network+", cat: "cyber" },
    { name: "Full-Stack Dev", cat: "dev" }, { name: "SOC Level 1", cat: "cyber" },
    { name: "MDiv Student", cat: "theology" }, { name: "OverPhish", cat: "project" },
    { name: "Schema Scalpel", cat: "project" }, { name: "Stage of Fools", cat: "creative" },
    { name: "Google Cyber", cat: "cyber" }, { name: "React", cat: "dev" },
    { name: "WordPress", cat: "dev" }, { name: "PHP", cat: "dev" },
    { name: "Classical Ed", cat: "teaching" }, { name: "Chrome Extensions", cat: "dev" },
    { name: "Biblical Greek", cat: "theology" }, { name: "Linux", cat: "cyber" },
    { name: "Python", cat: "cyber" }, { name: "English Lit", cat: "creative" }
];

// Color mapping based on your background
const catColors: Record<string, string> = {
    cyber: "border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white",
    dev: "border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white",
    theology: "border-amber-500/50 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white",
    project: "border-purple-500/50 bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white",
    creative: "border-pink-500/50 bg-pink-500/10 text-pink-400 hover:bg-pink-500 hover:text-white",
    teaching: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white",
};

function Word({ children, category, ...props }: { children: string; category: string;[key: string]: any }) {
    const [hovered, setHovered] = useState(false);
    const ref = useRef<THREE.Group>(null!);

    useFrame((state) => {
        ref.current.quaternion.copy(state.camera.quaternion);
    });

    return (
        <group ref={ref} {...props}>
            <Html distanceFactor={12}>
                <div
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    className="transition-all duration-300 hover:scale-125 cursor-pointer"
                >
                    <Badge
                        variant="outline"
                        className={cn(
                            "whitespace-nowrap px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors",
                            catColors[category] || "border-muted bg-muted/10 text-muted-foreground",
                            hovered && "shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        )}
                    >
                        {children}
                    </Badge>
                </div>
            </Html>
        </group>
    );
}

function Cloud({ radius = 15 }) { // Reduced radius for higher density
    const words = useMemo(() => {
        const temp = [];
        const phiSpan = Math.PI * (3 - Math.sqrt(5));

        for (let i = 0; i < skills.length; i++) {
            const y = 1 - (i / (skills.length - 1)) * 2;
            const r = Math.sqrt(1 - y * y);
            const theta = phiSpan * i;

            const pos = new THREE.Vector3(
                Math.cos(theta) * r * radius,
                y * radius,
                Math.sin(theta) * r * radius
            );
            temp.push({ pos, name: skills[i].name, cat: skills[i].cat });
        }
        return temp;
    }, [radius]);

    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const { x, y } = state.mouse;
        // Auto-rotation
        groupRef.current.rotation.y += 0.003;
        // Subtle mouse influence
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.3, 0.1);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.3, 0.1);
    });

    return (
        <group ref={groupRef}>
            {words.map((item, index) => (
                <Word key={index} position={item.pos} category={item.cat}>
                    {item.name}
                </Word>
            ))}
        </group>
    );
}

export default function SkillSpheroid() {
    return (
        <div className="w-full h-[500px] bg-black/5 rounded-xl border relative overflow-hidden group">
            <div className="absolute top-6 left-6 z-10 pointer-events-none">
                <h3 className="text-lg font-bold tracking-tighter uppercase opacity-50">Expertise Cluster</h3>
            </div>

            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 60 }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <React.Suspense fallback={null}>
                    <Cloud radius={4} />
                </React.Suspense>
            </Canvas>
        </div>
    );
}