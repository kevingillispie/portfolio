// e.g. src/components/Simple3DCube.tsx
"use client";

export default function Simple3DCube() {
    return (
        <div
            className="relative w-[300px] h-[300px] mx-auto my-12"
            style={{
                perspective: "1000px",           // depth — lower = more dramatic
                perspectiveOrigin: "50% 50%",
            }}
        >
            <svg
                viewBox="0 0 200 200"
                className="w-full h-full"
                style={{
                    transformStyle: "preserve-3d",
                    transform: "rotateX(25deg) rotateY(35deg)", // initial isometric angle
                }}
            >
                {/* Front face */}
                <g style={{ transform: "translateZ(100px)" }}>
                    <rect width="200" height="200" fill="#e63946" stroke="#d00000" strokeWidth="4" />
                    <text x="100" y="110" fill="white" fontSize="80" textAnchor="middle">FRONT</text>
                </g>

                {/* Back face */}
                <g style={{ transform: "rotateY(180deg) translateZ(100px)" }}>
                    <rect width="200" height="200" fill="#457b9d" stroke="#1d3557" strokeWidth="4" />
                    <text x="100" y="110" fill="white" fontSize="80" textAnchor="middle">BACK</text>
                </g>

                {/* Right face */}
                <g style={{ transform: "rotateY(90deg) translateZ(100px)" }}>
                    <rect width="200" height="200" fill="#2a9d8f" stroke="#1a7065" strokeWidth="4" />
                    <text x="100" y="110" fill="white" fontSize="80" textAnchor="middle">RIGHT</text>
                </g>

                {/* Left face */}
                <g style={{ transform: "rotateY(-90deg) translateZ(100px)" }}>
                    <rect width="200" height="200" fill="#e9c46a" stroke="#d4a017" strokeWidth="4" />
                    <text x="100" y="110" fill="white" fontSize="80" textAnchor="middle">LEFT</text>
                </g>

                {/* Top face */}
                <g style={{ transform: "rotateX(90deg) translateZ(100px)" }}>
                    <rect width="200" height="200" fill="#f4a261" stroke="#e76f51" strokeWidth="4" />
                    <text x="100" y="110" fill="white" fontSize="80" textAnchor="middle">TOP</text>
                </g>

                {/* Bottom face */}
                <g style={{ transform: "rotateX(-90deg) translateZ(100px)" }}>
                    <rect width="200" height="200" fill="#606c38" stroke="#283618" strokeWidth="4" />
                    <text x="100" y="110" fill="white" fontSize="80" textAnchor="middle">BOTTOM</text>
                </g>
            </svg>
        </div>
    );
}