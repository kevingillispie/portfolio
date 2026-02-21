import { getPostData } from '@/lib/posts';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ title: null }, { status: 400 });
    }

    const post = await getPostData(slug);
    return NextResponse.json({ title: post?.title || null });
}