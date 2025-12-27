'use client';

import { useState, useEffect } from 'react';
import BlogEditor from '@/components/editor/BlogEditor';
import { useAutoSave } from '@/lib/hooks/useAutoSave';
import type { JSONContent } from 'novel';

export default function BlogWritePage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState<JSONContent | undefined>(undefined);
    const [slug, setSlug] = useState('');
    const [isGeneratingSlug, setGeneratingSlug] = useState(false);

    // Auto save hook (stubs onSave for now)
    const { saveStatus, lastSaved, triggerSave } = useAutoSave({
        docId: 'new-post',
        onSave: async (savedContent, savedTitle) => {
            console.log('Saving post...', { title: savedTitle, content: savedContent });
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
        },
    });

    // Slug generation logic
    useEffect(() => {
        if (!title || title.trim().length === 0) return;

        const timeoutId = setTimeout(async () => {
            setGeneratingSlug(true);
            try {
                const response = await fetch('/api/blog/generate-slug', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title }),
                });
                const data = await response.json();
                if (data.slug) setSlug(data.slug);
            } catch (error) {
                console.error('Slug generation error:', error);
            } finally {
                setGeneratingSlug(false);
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [title]);

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="mb-8 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">새 글 작성</h1>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        {saveStatus === 'saving' && <span>저장 중...</span>}
                        {saveStatus === 'saved' && lastSaved && (
                            <span>저장됨 {lastSaved.toLocaleTimeString()}</span>
                        )}
                        {saveStatus === 'offline' && <span>오프라인</span>}
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    className="w-full text-4xl font-bold border-none outline-none placeholder:text-slate-300"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        if (content) triggerSave(content, e.target.value);
                    }}
                />

                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="font-medium text-slate-600">URL:</span>
                    <span>/blog/{slug || '...'}</span>
                    {isGeneratingSlug && <span className="animate-pulse">슬러그 생성 중...</span>}
                </div>
            </div>

            <BlogEditor
                content={content}
                onChange={(newContent) => {
                    setContent(newContent);
                    triggerSave(newContent, title);
                }}
            />
        </div>
    );
}
