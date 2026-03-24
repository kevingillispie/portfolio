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
    },
    experimental: {
        useDeploymentId: true,           // Helps with static assets
        useDeploymentIdServerActions: true,   // Helps specifically with Server Actions
    },

    trailingSlash: false,
}

export default nextConfig