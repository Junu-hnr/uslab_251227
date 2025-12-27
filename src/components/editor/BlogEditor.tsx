'use client';

import { useMemo } from 'react';
import {
    EditorRoot,
    EditorContent,
    EditorCommand,
    EditorCommandEmpty,
    EditorCommandList,
    EditorCommandItem,
    useEditor,
    type JSONContent
} from 'novel';
import { handleImagePaste, handleImageDrop } from 'novel';
import { extensions as defaultExtensions, createSuggestionItemsWithUpload, createSlashCommand } from './extensions';
import { ImageResizeExtension } from './extensions/ImageResizeExtension';
import { UpdatedImage, UploadImagesPlugin, createImageUpload } from 'novel';

interface BlogEditorProps {
    content?: JSONContent;
    onChange?: (content: JSONContent) => void;
    uploadFn?: (file: File) => Promise<string>;
}

export default function BlogEditor({ content, onChange, uploadFn }: BlogEditorProps) {
    // 최종 업로드 로직 (컴포넌트 내에서 공유)
    const finalUploadFn = useMemo(() => {
        return async (file: File): Promise<string> => {
            if (uploadFn) {
                return uploadFn(file);
            }
            // 브라우저 로컬 미리보기용 (Supabase 연결 전 테스트용)
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
        };
    }, [uploadFn]);

    // 이미지 업로드 함수 생성 (Novel 전용)
    const imageUploadFn = useMemo(() => {
        return createImageUpload({
            validateFn: (file: File) => {
                if (!file.type.startsWith('image/')) {
                    alert('이미지 파일만 업로드할 수 있습니다.');
                    return false;
                }
                if (file.size > 50 * 1024 * 1024) {
                    alert('파일 크기는 50MB를 초과할 수 없습니다.');
                    return false;
                }
                return true;
            },
            onUpload: finalUploadFn,
        });
    }, [finalUploadFn]);

    // UpdatedImage 확장 사용
    const imageExtension = useMemo(() => {
        return UpdatedImage.extend({
            addProseMirrorPlugins() {
                return [
                    UploadImagesPlugin({
                        imageClass: 'opacity-40 rounded-lg border border-slate-300',
                    }),
                ];
            },
        }).configure({
            allowBase64: true,
            HTMLAttributes: {
                class: 'rounded-lg border border-slate-300',
                style: 'max-width: 100%; height: auto; max-height: 600px; object-fit: contain; cursor: pointer;',
            },
            inline: false,
        });
    }, []);



    const editorSuggestionItems = useMemo(() => {
        return createSuggestionItemsWithUpload(finalUploadFn);
    }, [finalUploadFn]);

    const editorExtensions = useMemo(() => {
        const slash = createSlashCommand(editorSuggestionItems);
        // defaultExtensions에서 이미지를 교체하고 리사이즈 확장 추가, 그리고 슬래시 명령어도 교체
        const filtered = defaultExtensions.filter(ext => ext.name !== 'image' && ext.name !== 'slash-command');
        return [...filtered, imageExtension, ImageResizeExtension, slash];
    }, [imageExtension, editorSuggestionItems]);

    return (
        <EditorRoot>
            <EditorContent
                initialContent={content}
                extensions={editorExtensions as any}
                className="min-h-[500px] border border-slate-200 rounded-lg p-8 prose prose-slate max-w-none focus:outline-none"
                editorProps={{
                    handlePaste: (view, event) => {
                        const handled = handleImagePaste(view, event, imageUploadFn);
                        if (handled) return true;

                        const text = event.clipboardData?.getData('text/plain');
                        if (!text) return false;

                        // YouTube URL detection
                        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
                        const youtubeMatch = text.match(youtubeRegex);
                        if (youtubeMatch) {
                            event.preventDefault();
                            const { state, dispatch } = view;
                            const videoId = youtubeMatch[1];
                            const youtubeNode = state.schema.nodes.youtube.create({
                                src: `https://www.youtube.com/embed/${videoId}`,
                            });
                            const transaction = state.tr.replaceSelectionWith(youtubeNode);
                            dispatch(transaction);
                            return true;
                        }

                        return false;
                    },
                    handleDrop: (view, event, slice, moved) => handleImageDrop(view, event, moved, imageUploadFn),
                    attributes: {
                        class: 'focus:outline-none'
                    }
                }}
                onUpdate={({ editor }) => {
                    if (onChange) {
                        onChange(editor.getJSON());
                    }
                }}
                slotAfter={
                    <EditorCommand className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-slate-100 bg-white px-1 py-2 shadow-md">
                        <EditorCommandEmpty className="px-2 text-sm text-slate-400">결과 없음</EditorCommandEmpty>
                        <EditorCommandList>
                            {editorSuggestionItems.map((item: any) => (
                                <EditorCommandItem
                                    value={item.title}
                                    onCommand={(editor) => {
                                        item.command(editor);
                                    }}
                                    className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-slate-50 aria-selected:bg-slate-50"
                                    key={item.title}
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-xs text-slate-500">{item.description}</p>
                                    </div>
                                </EditorCommandItem>
                            ))}
                        </EditorCommandList>
                    </EditorCommand>
                }
            >
            </EditorContent>
        </EditorRoot>
    );
}
