import React from 'react';
import Emblem from './Emblem';
import { getFrequencyById } from '../constants/frequencies';

export default function Feed({
    posts,
    loading,
    isAdmin,
    currentUser,
    onEditPost,
    onDeletePost,
    activeRoute,
    hideOuterWrapper = false
}) {
    if (loading) {
        const loadingContent = (
            <div className="text-center opacity-50 text-sm tracking-widest uppercase animate-gentle-pulse py-20">
                Synchronizing with the sanctuary...
            </div>
        );
        return hideOuterWrapper ? loadingContent : (
            <main className="flex-grow w-full max-w-[65ch] mx-auto px-6 pb-24">
                {loadingContent}
            </main>
        );
    }

    if (posts.length === 0) {
        const emptyContent = (
            <div className="text-center opacity-50 text-sm tracking-widest uppercase py-20 animate-fade-in">
                {activeRoute === 'drafts' 
                    ? 'No drafts are currently written.' 
                    : activeRoute === 'journal' 
                    ? 'Your private journal is quiet.' 
                    : 'The sanctuary is quiet.'}
            </div>
        );
        return hideOuterWrapper ? emptyContent : (
            <main className="flex-grow w-full max-w-[65ch] mx-auto px-6 pb-24">
                {emptyContent}
            </main>
        );
    }

    const feedContent = (
        <>
            {posts.map(post => {
                const dateObj = post.createdAt?.toDate ? post.createdAt.toDate() : new Date(post.createdAt);
                const dateText = isNaN(dateObj.getTime())
                    ? "Just now"
                    : dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

                const isAuthor = currentUser && post.authorId === currentUser.uid;
                const canManage = isAdmin || isAuthor;

                const paragraphs = post.content.split('\n\n');
                const freq = post.frequency ? getFrequencyById(post.frequency) : null;

                return (
                    <article
                        key={post.id}
                        className="mb-24 pt-24 border-t border-sanctuary-stone border-opacity-50 first:pt-0 first:border-0 relative group"
                    >
                        {canManage && (
                            <div className="flex gap-4 mb-4 md:absolute md:top-24 md:right-0 justify-start md:justify-end">
                                <button
                                    onClick={() => onEditPost(post)}
                                    className="text-[10px] tracking-widest uppercase md:opacity-0 md:group-hover:opacity-30 hover:!opacity-100 transition-all duration-300 text-sanctuary-sage cursor-pointer focus:outline-none"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDeletePost(post.id)}
                                    className="text-[10px] tracking-widest uppercase md:opacity-0 md:group-hover:opacity-30 hover:!opacity-100 transition-all duration-300 text-red-800 cursor-pointer focus:outline-none"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                        <header className="mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Emblem
                                    avatarId={post.authorAvatar || 'default'}
                                    initials={post.authorName || '?'}
                                    sizeClass="w-9 h-9"
                                />
                                <div className="flex flex-col text-left">
                                    <span className="text-xs font-heading font-medium tracking-wide text-sanctuary-ink">
                                        {post.authorName || 'Anonymous Seeker'}
                                    </span>
                                    <div className="flex flex-wrap items-center gap-2 text-[10px] tracking-widest uppercase opacity-50">
                                        <time>{dateText}</time>
                                        {post.status === 'draft' && (
                                            <span className="text-[9px] text-sanctuary-sage border border-sanctuary-sage px-1 leading-none">
                                                Draft
                                            </span>
                                        )}
                                        {post.status === 'journal' && (
                                            <span className="text-[9px] text-sanctuary-ink border border-sanctuary-ink border-opacity-35 px-1.5 py-0.5 leading-none flex items-center gap-1 font-medium bg-sanctuary-stone bg-opacity-10 rounded-sm">
                                                <svg className="w-2.5 h-2.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                </svg>
                                                <span>Locked Journal Entry</span>
                                            </span>
                                        )}
                                        {freq && (
                                            <span
                                                style={{ color: freq.color }}
                                                className="text-[9px] font-medium tracking-wider"
                                            >
                                                • {freq.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <h2 className="font-heading text-4xl md:text-5xl leading-tight mb-6">
                                {post.title}
                            </h2>
                        </header>
                        <div className="prose prose-lg prose-p:text-sanctuary-ink prose-p:leading-relaxed prose-p:font-light article-content">
                            {paragraphs.map((p, idx) => (
                                <p key={idx} className="mb-6">{p}</p>
                            ))}
                        </div>
                    </article>
                );
            })}
        </>
    );

    return hideOuterWrapper ? feedContent : (
        <main className="flex-grow w-full max-w-[65ch] mx-auto px-6 pb-24">
            {feedContent}
        </main>
    );
}
