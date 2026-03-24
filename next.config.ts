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


    trailingSlash: false,
}

export default nextConfig