'use client';

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

// Dynamically import react-quill-new to prevent SSR 'document is not defined' error
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new');
    return function ForwardedQuill(props: any) {
      return <RQ {...props} />;
    };
  },
  { ssr: false, loading: () => <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faf9', border: '1px solid #e2e8f0', borderRadius: '8px' }}>Loading Editor...</div> }
);

import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Write your description here...' }: RichTextEditorProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const quillRef = useRef<any>(null);

  // Define the custom modules and formats for React Quill
  // We specify an explicit toolbar.
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link'],
      ]
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link',
  ];

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (quillRef.current && quillRef.current.getEditor) {
      const editor = quillRef.current.getEditor();
      const cursorPosition = editor.getSelection()?.index || 0;
      editor.insertText(cursorPosition, emojiData.emoji);
      editor.setSelection(cursorPosition + emojiData.emoji.length);
    } else {
      // Fallback if ref isn't cleanly resolved dynamically
      onChange(value + emojiData.emoji);
    }
    setShowEmojiPicker(false);
  };

  return (
    <div className="rich-text-editor-container" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <ReactQuill 
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ background: '#fff', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}
      />
      
      {/* Custom integrated toolbar append */}
      <div style={{ position: 'absolute', top: '5px', right: '1rem', zIndex: 10 }}>
         <button 
           type="button" 
           onClick={(e) => { e.preventDefault(); setShowEmojiPicker(!showEmojiPicker); }}
           style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'pointer', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink)', transition: '0.2s' }}
         >
            <span style={{ fontSize: '1rem' }}>😀</span> Emoji
         </button>
      </div>

      {showEmojiPicker && (
         <div style={{ position: 'absolute', top: '2.5rem', right: '1rem', zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
            <EmojiPicker onEmojiClick={handleEmojiClick} autoFocusSearch={false} theme={'light' as any} />
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }} onClick={() => setShowEmojiPicker(false)}></div>
         </div>
      )}
      
      <style dangerouslySetInnerHTML={{ __html: `
        .ql-container {
           font-family: inherit !important;
           font-size: 1rem;
           min-height: 250px;
           border-bottom-left-radius: 8px;
           border-bottom-right-radius: 8px;
        }
        .ql-toolbar {
           border-top-left-radius: 8px;
           border-top-right-radius: 8px;
           background: #f8faf9;
        }
        .ql-editor {
           min-height: 250px;
        }
      `}} />
    </div>
  );
}
