// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';

// Document type for blog posts
export const Post = defineDocumentType(() => ({
    name: 'Post',
    filePathPattern: `posts/**/*.mdx`,   // or .md if you prefer plain markdown
    contentType: 'mdx',
    fields: {
        title: { type: 'string', required: true },
        date: { type: 'date', required: true },
        description: { type: 'string', required: true },
        tags: { type: 'list', of: { type: 'string' }, default: [] },
        featured: { type: 'boolean', default: false },
    },
    computedFields: {
        slug: {
            type: 'string',
            resolve: (post) => post._raw.flattenedPath.replace(/^posts\//, ''),
        },
        url: {
            type: 'string',
            resolve: (post) => `/blog/${post._raw.flattenedPath.replace(/^posts\//, '')}`,
        },
    },
}));

export default makeSource({
    contentDirPath: 'content',
    documentTypes: [Post],
    mdx: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            rehypeSlug,
            [rehypePrettyCode, { theme: 'github-dark' }],
            [
                rehypeAutolinkHeadings,
                {
                    properties: {
                        className: ['subheading-anchor'],
                        ariaLabel: 'Link to section',
                    },
                },
            ],
        ],
        // Add this: Provide webpack resolve aliases to mdx-bundler
        provider: {
            resolve: {
                alias: {
                    '@': './src',
                },
            },
        },
    },
});