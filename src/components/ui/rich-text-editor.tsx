'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
    ssr: false,
    loading: () => <div className="h-[200px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded"></div>
});

import '@uiw/react-md-editor/markdown-editor.css';
// import '@uiw/react-md-editor/markdown-editor-dark.css'; // Commented out as it's not available

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = "Enter your text here...",
    className = ""
}: RichTextEditorProps) {
    return (
        <div className={`rich-text-editor ${className}`} data-color-mode="auto">
            <MDEditor
                value={value}
                onChange={(val) => onChange(val || '')}
                preview="edit"
                hideToolbar={false}
                visibleDragbar={false}
                textareaProps={{
                    placeholder: placeholder,
                }}
                height={200}
            />
        </div>
    );
}
