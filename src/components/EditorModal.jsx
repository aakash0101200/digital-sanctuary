import React, { useState, useEffect, useRef } from 'react';
import { FREQUENCIES } from '../constants/frequencies';

export default function EditorModal({
    isOpen,
    onClose,
    editingPost,
    onPublish,
    onSaveDraft,
    onSaveJournal,
    loading
}) {
    const [frequency, setFrequency] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const titleInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            if (editingPost) {
                setTitle(editingPost.title);
                setContent(editingPost.content);
                setFrequency(editingPost.frequency || '');
            } else {
                setTitle('');
                setContent('');
                setFrequency('');
            }
            setTimeout(() => titleInputRef.current?.focus(), 100);
        }
    }, [isOpen, editingPost]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handlePublish = (e) => {
        e.preventDefault();
        onPublish(title, content, frequency);
    };

    const handleSaveDraft = (e) => {
        e.preventDefault();
        onSaveDraft(title, content, frequency);
    };

    const handleSaveJournal = (e) => {
        e.preventDefault();
        onSaveJournal(title, content, frequency);
    };

    return (
        <div className="fixed inset-0 bg-sanctuary-linen bg-opacity-98 z-50 overflow-y-auto p-6 transition-all duration-300">
            <div className="w-full max-w-[65ch] mx-auto min-h-screen flex flex-col justify-center py-12 relative">
                <div className="flex justify-between items-center mb-8">
                    <span className="text-xs tracking-widest uppercase opacity-40 font-heading italic">
                        Sanctuary Editor
                    </span>
                    <button
                        onClick={onClose}
                        className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100 focus:outline-none"
                    >
                        Close [Esc]
                    </button>
                </div>
                <input
                    type="text"
                    ref={titleInputRef}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="A new thought..."
                    disabled={loading}
                    className="w-full bg-transparent font-heading text-4xl md:text-5xl border-none outline-none mb-8 text-sanctuary-ink placeholder-sanctuary-ink placeholder-opacity-30 animate-fade-in"
                />
                <textarea
                    rows="12"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Let the mind wander here..."
                    disabled={loading}
                    className="w-full bg-transparent font-body text-lg border-none outline-none resize-none text-sanctuary-ink placeholder-sanctuary-ink placeholder-opacity-30 leading-relaxed"
                />

                {/* Frequency selector */}
                <div className="mt-8 mb-2">
                    <p className="text-[10px] tracking-widest uppercase opacity-30 mb-3">
                        Emotional Frequency <span className="opacity-60">(optional)</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {FREQUENCIES.map(freq => (
                            <button
                                key={freq.id}
                                type="button"
                                onClick={() => setFrequency(frequency === freq.id ? '' : freq.id)}
                                disabled={loading}
                                className={`px-3 py-1.5 text-[10px] tracking-widest uppercase border transition-all duration-300 focus:outline-none ${
                                    frequency === freq.id
                                        ? 'opacity-90 text-white'
                                        : 'border-sanctuary-stone border-opacity-30 opacity-40 hover:opacity-70'
                                }`}
                                style={frequency === freq.id ? {
                                    backgroundColor: freq.color,
                                    borderColor: freq.color,
                                } : {}}
                            >
                                {freq.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    {editingPost && editingPost.status === 'journal' ? (
                        <button
                            onClick={handleSaveJournal}
                            disabled={loading}
                            className="px-6 py-2 border border-sanctuary-stone text-xs tracking-widest uppercase opacity-70 hover:opacity-100 hover:bg-sanctuary-ink hover:text-sanctuary-linen hover:border-sanctuary-ink transition-all duration-300 focus:outline-none disabled:opacity-30 flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Update Entry</span>
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handlePublish}
                                disabled={loading}
                                className="px-6 py-2 border border-sanctuary-stone text-xs tracking-widest uppercase opacity-70 hover:opacity-100 hover:bg-sanctuary-sage hover:text-sanctuary-linen hover:border-sanctuary-sage transition-all duration-300 focus:outline-none disabled:opacity-30"
                            >
                                {loading ? 'Reflecting...' : (editingPost ? 'Update thought' : 'Breathe into Existence')}
                            </button>
                            <button
                                onClick={handleSaveJournal}
                                disabled={loading}
                                className="ml-4 px-6 py-2 border border-sanctuary-stone text-xs tracking-widest uppercase opacity-70 hover:opacity-100 hover:bg-sanctuary-ink hover:text-sanctuary-linen hover:border-sanctuary-ink transition-all duration-300 focus:outline-none disabled:opacity-30 flex items-center gap-1.5"
                            >
                                <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>Lock in Journal</span>
                            </button>
                            <button
                                onClick={handleSaveDraft}
                                disabled={loading}
                                className="ml-4 px-6 py-2 border border-sanctuary-stone text-xs tracking-widest uppercase opacity-70 hover:opacity-100 hover:bg-sanctuary-stone hover:text-sanctuary-ink transition-all duration-300 focus:outline-none disabled:opacity-30"
                            >
                                Save Draft
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
