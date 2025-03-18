import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { shortId: string } }
) {
    try {
        const shortLink = await prisma.shortLink.findUnique({
            where: {
                shortId: params.shortId,
            },
        });

        if (!shortLink) {
            return new NextResponse('Not Found', { status: 404 });
        }

        // 클릭 수 증가
        await prisma.shortLink.update({
            where: {
                id: shortLink.id,
            },
            data: {
                clicks: {
                    increment: 1,
                },
            },
        });

        return NextResponse.redirect(shortLink.url);
    } catch (error) {
        console.error('Error redirecting:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
} 