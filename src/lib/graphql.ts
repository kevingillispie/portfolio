import { GraphQLClient } from 'graphql-request';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://api.kevingillispie.com/graphql';

if (!WORDPRESS_API_URL) {
    throw new Error('Missing WORDPRESS_API_URL in environment variables');
}

export const wpClient = new GraphQLClient(WORDPRESS_API_URL);

export async function wpQuery<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
    try {
        return await wpClient.request<T>(query, variables);
    } catch (err) {
        console.error('[WPGraphQL Error]', err);
        return {} as T; // or throw / return fallback
    }
}