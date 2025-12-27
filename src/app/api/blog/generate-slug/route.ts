import { NextRequest, NextResponse } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const title = body.title;

        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return NextResponse.json(
                { error: '제목이 필요합니다.' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
            // Fallback slug generation if no API key
            const fallbackSlug = title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')
                .trim()
                .substring(0, 50);

            return NextResponse.json({ slug: fallbackSlug || 'untitled' });
        }

        const google = createGoogleGenerativeAI({ apiKey });

        const promptText = `Generate a URL-friendly English slug for the following blog post title.

Requirements:
- If the title is in Korean or other languages, first translate it to English, then create the slug
- Use ONLY English letters (a-z), numbers (0-9), and hyphens (-)
- Convert to lowercase
- Replace spaces with hyphens
- Remove all special characters and non-English characters
- Keep it under 50 characters
- Make it SEO-friendly and concise

Title: "${title}"

Output ONLY the slug (no explanation, no quotes, just the slug text):`;

        const { text: slug } = await generateText({
            model: google('gemini-2.0-flash-exp'),
            prompt: promptText,
        });

        const cleanedSlug = slug
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 50);

        return NextResponse.json({ slug: cleanedSlug || 'untitled' });
    } catch (error: any) {
        console.error('Error generating slug:', error);
        return NextResponse.json(
            { error: error.message || '슬러그 생성 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
