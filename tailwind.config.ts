// tailwind.config.ts
import type { Config } from "tailwindcss"
import typography from "@tailwindcss/typography"

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./content/**/*.{md,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            // your radius/colors if any
        },
    },
    plugins: [
        typography,
    ],
}

export default config