import React, { useState, useRef } from 'react';

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
    const [clicks, setClicks] = useState(0);
    const clickTimer = useRef(null);

    const handleTitleClick = () => {
        setClicks(prev => {
            const next = prev + 1;
            if (next >= 5) {
                onOpenAuth();
                return 0;
            }
            return next;
        });

        clearTimeout(clickTimer.current);
        clickTimer.current = setTimeout(() => {
            setClicks(0);
        }, 2500);
    };

    // Dynamic style definitions based on build-up sequence
    const scaleY = clicks === 0 ? 0.35 : 0.35 + clicks * 0.16;
    const animationDuration = clicks === 0 ? '1.8s' : `${1.8 - clicks * 0.35}s`;
    const opacityClass = clicks === 0 ? 'opacity-0 group-hover:opacity-40' : 'opacity-100';
    const cursorColor = clicks === 4 ? '#c9a84c' : '#8a9a86';

    const headerStyle = {
        textShadow: clicks > 0 ? `0 0 ${clicks * 4}px rgba(138, 154, 134, ${clicks * 0.18})` : 'none',
        transition: 'all 0.4s ease-out'
    };

    const cursorStyle = {
        transform: `scaleY(${scaleY})`,
        animationDuration: animationDuration,
        backgroundColor: cursorColor,
        boxShadow: clicks === 4 ? '0 0 8px #c9a84c' : 'none',
        transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.3s ease, box-shadow 0.3s ease'
    };

    return (
        <header className="w-full max-w-5xl mx-auto px-6 py-8 md:py-20 flex flex-col md:flex-row justify-between items-center md:items-baseline gap-6">
            <h1
                onClick={handleTitleClick}
                style={headerStyle}
                className="font-heading text-3xl md:text-4xl tracking-wide font-medium select-none cursor-pointer text-center md:text-left active:opacity-75 transition-all duration-300 relative group inline-flex items-center justify-center md:justify-start"
            >
                <span>{appTitle}</span>
                <span
                    style={cursorStyle}
                    className={`inline-block w-[1.5px] h-[0.95em] ml-2.5 transition-all duration-300 animate-cursor-pulse pointer-events-none ${opacityClass}`}
                />
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
                        onClick={() => setActiveRoute('journal')}
                        className="text-sm tracking-widest uppercase text-sanctuary-sage font-medium hover:opacity-70 transition-opacity duration-300 cursor-pointer focus:outline-none"
                    >
                        Journal
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
