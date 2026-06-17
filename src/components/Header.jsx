import React, { useRef } from 'react';

export default function Header({
    appTitle,
    user,
    isAdmin,
    canWrite,
    activeRoute,
    setActiveRoute,
    onOpenAuth,
    onOpenEditor,
    onOpenProfile,
    onOpenSettings,
    onOpenMembers,
    onLogout
}) {
    const clickCount = useRef(0);
    const clickTimer = useRef(null);

    const handleTitleClick = () => {
        clickCount.current++;
        clearTimeout(clickTimer.current);
        if (clickCount.current >= 5) {
            onOpenAuth();
            clickCount.current = 0;
        } else {
            clickTimer.current = setTimeout(() => {
                clickCount.current = 0;
            }, 2000);
        }
    };

    return (
        <header className="w-full max-w-5xl mx-auto px-6 py-8 md:py-20 flex flex-col md:flex-row justify-between items-center md:items-baseline gap-6">
            <h1
                onClick={handleTitleClick}
                className="font-heading text-3xl md:text-4xl tracking-wide font-medium select-none cursor-pointer text-center md:text-left active:opacity-75 transition-opacity relative group inline-flex items-center justify-center md:justify-start"
            >
                <span>{appTitle}</span>
                <span className="inline-block w-[1.5px] h-[0.95em] bg-sanctuary-sage ml-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-cursor-pulse pointer-events-none" />
            </h1>
            <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 items-center">
                {canWrite && (
                    <button
                        onClick={onOpenEditor}
                        className="text-sm tracking-widest uppercase text-sanctuary-sage font-medium hover:opacity-70 transition-opacity duration-300 cursor-pointer focus:outline-none"
                    >
                        Write
                    </button>
                )}
                {isAdmin && (
                    <button
                        onClick={onOpenMembers}
                        className="text-sm tracking-widest uppercase text-sanctuary-sage font-medium hover:opacity-70 transition-opacity duration-300 cursor-pointer focus:outline-none"
                    >
                        Seekers
                    </button>
                )}
                <button
                    onClick={() => setActiveRoute('feed')}
                    className="text-sm tracking-widest uppercase text-sanctuary-sage font-medium hover:opacity-70 transition-opacity duration-300 cursor-pointer focus:outline-none"
                >
                    Feed
                </button>
                {isAdmin && (
                    <button
                        onClick={onOpenSettings}
                        className="text-sm tracking-widest uppercase text-sanctuary-sage font-medium hover:opacity-70 transition-opacity duration-300 cursor-pointer focus:outline-none"
                    >
                        Settings
                    </button>
                )}
                {canWrite && (
                    <button
                        onClick={() => setActiveRoute('drafts')}
                        className="text-sm tracking-widest uppercase text-sanctuary-sage font-medium hover:opacity-70 transition-opacity duration-300 cursor-pointer focus:outline-none"
                    >
                        Drafts
                    </button>
                )}
                {user && (
                    <button
                        onClick={onOpenProfile}
                        className="text-sm tracking-widest uppercase text-sanctuary-sage font-medium hover:opacity-70 transition-opacity duration-300 cursor-pointer focus:outline-none"
                    >
                        Profile
                    </button>
                )}
                {user && (
                    <button
                        onClick={onLogout}
                        className="text-sm tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-pointer focus:outline-none"
                    >
                        Depart
                    </button>
                )}
                <button
                    onClick={() => setActiveRoute('resonance')}
                    className="text-sm tracking-widest uppercase text-sanctuary-sage font-medium hover:opacity-70 transition-opacity duration-300 cursor-pointer focus:outline-none"
                >
                    States of Being
                </button>
            </nav>
        </header>
    );
}
