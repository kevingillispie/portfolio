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
}

export default nextConfig