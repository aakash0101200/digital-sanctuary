import React from 'react';

export default function Footer({ onOpenBreathing }) {
    return (
        <footer className="w-full max-w-5xl mx-auto px-6 py-12 border-t border-sanctuary-stone border-opacity-30 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <button
                onClick={onOpenBreathing}
                className="text-[10px] tracking-[0.2em] uppercase opacity-40 hover:opacity-80 transition-opacity flex items-center gap-2.5 focus:outline-none cursor-pointer"
            >
                <div className="w-2 h-2 rounded-full bg-sanctuary-sage animate-gentle-pulse" />
                <span>Breathing Space</span>
            </button>
            <p className="text-sm opacity-40 font-heading italic">Breathe. Read. Reflect.</p>
        </footer>
    );
}
