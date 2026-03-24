// src/lib/server/media.ts
import { wpQuery } from '@/lib/graphql';

export interface MediaItem {
    sourceUrl: string;
    altText?: string;
    mediaDetails?: {
        width: number;
        height: number;
    };
}

/**
 * Fetch a single image from WordPress Media Library by slug
 * (slug = filename without extension, e.g. "message-received")
 */
export async function getMediaBySlug(slug: string): Promise<MediaItem | null> {
    const GET_MEDIA = `
        query GetMediaBySlug($slug: ID!) {
            mediaItem(id: $slug, idType: SLUG) {
                sourceUrl
                altText
                mediaDetails {
                    width
                    height
                }
            }
        }
    `;

    try {
        const data = await wpQuery<{ mediaItem: any }>(GET_MEDIA, { slug });

        const item = data?.mediaItem;
        if (!item) return null;

        // Convert to clean /media/... path (same as your posts)
        const rawUrl = item.sourceUrl;
        const uploadPath = rawUrl.split('/wp-content/uploads/')[1];
        const cleanPath = uploadPath ? `/media/${uploadPath}` : null;

        if (!cleanPath) return null;

        return {
            sourceUrl: cleanPath,
            altText: item.altText,
            mediaDetails: item.mediaDetails,
        };
    } catch (error) {
        console.error(`Failed to fetch media "${slug}":`, error);
        return null;
    }
}