import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        // URL 유효성 검사
        try {
            new URL(url);
        } catch (e) {
            return NextResponse.json(
                { error: 'Invalid URL' },
                { status: 400 }
            );
        }

        // 기존 URL이 있는지 확인
        const existingLink = await prisma.shortLink.findFirst({
            where: {
                url: url,
            },
        });

        // 기존 URL이 있으면 해당 shortId 반환
        if (existingLink) {
            const shortUrl = `${request.headers.get('host')}/${existingLink.shortId}`;
            return NextResponse.json({ shortUrl });
        }

        // 새로운 단축 URL 생성
        let shortId = nanoid(5);
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            try {
                // 데이터베이스에 저장
                const shortLink = await prisma.shortLink.create({
                    data: {
                        url,
                        shortId,
                    },
                });

                // 단축된 URL 생성
                const shortUrl = `${request.headers.get('host')}/${shortId}`;
                return NextResponse.json({ shortUrl });
            } catch (error) {
                // 중복 키 에러인 경우 재시도
                if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                    attempts++;
                    if (attempts === maxAttempts) {
                        return NextResponse.json(
                            { error: '단축 URL 생성 실패. 다시 시도해주세요.' },
                            { status: 500 }
                        );
                    }
                    // 새로운 shortId 생성하여 재시도
                    shortId = nanoid(5);
                    continue;
                }
                throw error;
            }
        }

        throw new Error('Failed to create short URL');
    } catch (error) {
        console.error('Error creating short URL:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 