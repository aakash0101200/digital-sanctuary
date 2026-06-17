import React from 'react';
import { FREQUENCIES, getFrequencyById } from '../constants/frequencies';
import Feed from './Feed';

export default function ResonancePage({
    activeFilter,
    onSelectFilter,
    onClearFilter,
    onOpenBreathing,
    // Feed props pass-through
    posts,
    loadingPosts,
    isAdmin,
    currentUser,
    onEditPost,
    onDeletePost,
}) {
    // If a filter is active, show filtered feed
    if (activeFilter) {
        const freq = getFrequencyById(activeFilter);
        return (
            <main className="flex-grow w-full max-w-[65ch] mx-auto px-6 pb-24">
                {/* Active filter header with return path */}
                <div className="pt-6 pb-8 flex items-center justify-between">
                    <button
                        onClick={onClearFilter}
                        className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase opacity-40 hover:opacity-80 transition-opacity duration-300 focus:outline-none"
                    >
                        <span className="text-base leading-none">←</span>
                        <span>All States</span>
                    </button>
                    {freq && (
                        <div className="flex items-center gap-2">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: freq.color }}
                            />
                            <span
                                className="text-[10px] tracking-[0.2em] uppercase font-medium"
                                style={{ color: freq.color }}
                            >
                                {freq.name}
                            </span>
                        </div>
                    )}
                </div>

                {/* Color accent bar */}
                {freq && (
                    <div
                        className="w-full h-[2px] mb-8 rounded-full"
                        style={{ backgroundColor: freq.color, opacity: 0.4 }}
                    />
                )}

                {/* Filtered feed */}
                <Feed
                    posts={posts}
                    loading={loadingPosts}
                    isAdmin={isAdmin}
                    currentUser={currentUser}
                    onEditPost={onEditPost}
                    onDeletePost={onDeletePost}
                    activeRoute="feed"
                    hideOuterWrapper={true}
                />
            </main>
        );
    }

    // Default: show frequency cards grid
    return (
        <main className="flex-grow w-full max-w-4xl mx-auto px-6 pb-24">
            {/* Page title */}
            <div className="text-center pt-4 pb-12">
                <h2 className="font-heading text-3xl md:text-4xl tracking-wide opacity-80 mb-3">
                    States of Being
                </h2>
                <p className="text-xs tracking-widest uppercase opacity-30">
                    Discover thoughts that resonate with your current state
                </p>
            </div>

            {/* Frequency cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {FREQUENCIES.map((freq, index) => (
                    <button
                        key={freq.id}
                        onClick={() => onSelectFilter(freq.id)}
                        className="group text-left p-8 border border-sanctuary-stone border-opacity-20 hover:border-opacity-50 transition-all duration-500 focus:outline-none relative overflow-hidden"
                        style={{
                            animationDelay: `${index * 80}ms`,
                        }}
                    >
                        {/* Top accent line */}
                        <div
                            className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                            style={{ backgroundColor: freq.color }}
                        />

                        {/* Frequency name */}
                        <h3 className="font-heading text-xl tracking-wide mb-3 transition-colors duration-300"
                            style={{ color: freq.color }}
                        >
                            {freq.name}
                        </h3>

                        {/* Poet quote */}
                        <p className="text-xs leading-relaxed opacity-60 italic mb-2">
                            {freq.quote}
                        </p>
                        <p className="text-[9px] tracking-widest uppercase opacity-30">
                            {freq.author}
                        </p>
                    </button>
                ))}
            </div>

            {/* Breathing Space entry */}
            <div className="text-center pb-12">
                <div className="w-px h-12 bg-sanctuary-stone opacity-20 mx-auto mb-8" />
                <p className="text-[10px] tracking-[0.2em] uppercase opacity-30 mb-4">
                    Before you read or write, pause.
                </p>
                <button
                    onClick={onOpenBreathing}
                    className="group inline-flex flex-col items-center gap-3 focus:outline-none"
                >
                    {/* Breathing icon — a pulsing circle */}
                    <div className="w-10 h-10 rounded-full border border-sanctuary-sage border-opacity-40 flex items-center justify-center group-hover:border-opacity-80 transition-all duration-500">
                        <div className="w-3 h-3 rounded-full bg-sanctuary-sage opacity-30 group-hover:opacity-60 transition-opacity duration-500 animate-gentle-pulse" />
                    </div>
                    <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 group-hover:opacity-70 transition-opacity duration-300">
                        Breathe
                    </span>
                </button>
            </div>
        </main>
    );
}
