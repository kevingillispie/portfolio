import createMDX from '@next/mdx'

const withMDX = createMDX({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [],
        rehypePlugins: [],
    },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

    async headers() {
        return [
            {
                // Match all routes (including static files, API routes, pages, etc.)
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin',
                    },
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'require-corp',
                    },
                ],
            },
        ]
    },
    // Optional: if you want to loosen it later (e.g. for Stripe iframes or other third-party embeds that break)
    // you can change to 'credentialless' for COEP or add exceptions with more specific sources.
}

export default withMDX(nextConfig)