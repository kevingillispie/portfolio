/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

    async rewrites() {
        return [
            {
                source: '/media/:path*',
                destination: 'https://api.kevingillispie.com/wp-content/uploads/:path*',
            },
        ];
    },

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.kevingillispie.com',
                pathname: '/wp-content/uploads/**',
            },
        ],
        deviceSizes: [640, 750, 828, 1080],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 473, 512, 768],
    },

    trailingSlash: false,
    poweredByHeader: false,

    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=31536000; includeSubDomains; preload",
                    },
                    {
                        key: "Content-Security-Policy",
                        value: `
                        default-src 'self';
                        script-src 'self' 'unsafe-inline' 'unsafe-eval' https: blob: use.typekit.net;
                        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com use.typekit.net;
                        img-src 'self' data: blob: https: https://api.kevingillispie.com p.typekit.net;
                        font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com use.typekit.net;
                        connect-src 'self' https: wss: https://api.kevingillispie.com;
                        frame-src 'self';
                        frame-ancestors 'none';
                        object-src 'none';
                        base-uri 'self';
                        form-action 'self';
                        upgrade-insecure-requests;
                        `.replace(/\s{2,}/g, " ").trim(),
                    },
                ],
            },
        ];
    },
};

export default nextConfig;