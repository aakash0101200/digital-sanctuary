import React from 'react';

export default function Emblem({ avatarId, initials = '?', sizeClass = 'w-10 h-10' }) {
    const safeInitials = (initials || '?')
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    if (avatarId === 'lotus') {
        return (
            <div className={`${sizeClass} flex-shrink-0 select-none`}>
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad-lotus" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8a9a86" />
                            <stop offset="100%" stopColor="#dfcfbe" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" fill="url(#grad-lotus)" fillOpacity="0.15" stroke="url(#grad-lotus)" strokeWidth="1.5" />
                    <path d="M50 25 C40 45 45 65 50 75 C55 65 60 45 50 25 Z" stroke="url(#grad-lotus)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M50 45 C35 52 32 68 45 74 C43 62 48 52 50 45 Z" stroke="url(#grad-lotus)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M50 45 C65 52 68 68 55 74 C57 62 52 52 50 45 Z" stroke="url(#grad-lotus)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M50 58 C25 60 22 72 35 75 C35 68 45 62 50 58 Z" stroke="url(#grad-lotus)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M50 58 C75 60 78 72 65 75 C65 68 55 62 50 58 Z" stroke="url(#grad-lotus)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        );
    }

    if (avatarId === 'crescent') {
        return (
            <div className={`${sizeClass} flex-shrink-0 select-none`}>
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad-crescent" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4f46e5" />
                            <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" fill="url(#grad-crescent)" fillOpacity="0.1" stroke="url(#grad-crescent)" strokeWidth="1.5" />
                    <path d="M60 35 A22 22 0 1 0 60 65 A28 28 0 1 1 60 35 Z" fill="url(#grad-crescent)" fillOpacity="0.3" stroke="url(#grad-crescent)" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M62 42 L64 47 L69 47 L65 50 L66 55 L62 52 L58 55 L59 50 L55 47 L60 47 Z" fill="url(#grad-crescent)" />
                </svg>
            </div>
        );
    }

    if (avatarId === 'ripple') {
        return (
            <div className={`${sizeClass} flex-shrink-0 select-none`}>
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad-ripple" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#0d9488" />
                            <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" fill="url(#grad-ripple)" fillOpacity="0.1" stroke="url(#grad-ripple)" strokeWidth="1.5" />
                    <circle cx="50" cy="50" r="12" stroke="url(#grad-ripple)" strokeWidth="2" />
                    <circle cx="50" cy="50" r="24" stroke="url(#grad-ripple)" strokeWidth="1.5" strokeDasharray="4 3" />
                    <circle cx="50" cy="50" r="36" stroke="url(#grad-ripple)" strokeWidth="1" />
                </svg>
            </div>
        );
    }

    if (avatarId === 'sol') {
        return (
            <div className={`${sizeClass} flex-shrink-0 select-none`}>
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad-sol" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ea580c" />
                            <stop offset="100%" stopColor="#eab308" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" fill="url(#grad-sol)" fillOpacity="0.15" stroke="url(#grad-sol)" stroke-width="1.5" />
                    <circle cx="50" cy="50" r="16" fill="url(#grad-sol)" fillOpacity="0.2" stroke="url(#grad-sol)" stroke-width="2" />
                    <path d="M50 15 L50 25 M50 75 L50 85 M15 50 L25 50 M75 50 L85 50" stroke="url(#grad-sol)" stroke-width="2" strokeLinecap="round" />
                    <path d="M25 25 L32 32 M68 68 L75 75 M25 75 L32 68 M68 32 L75 25" stroke="url(#grad-sol)" stroke-width="1.5" strokeLinecap="round" />
                </svg>
            </div>
        );
    }

    if (avatarId === 'breath') {
        return (
            <div className={`${sizeClass} flex-shrink-0 select-none`}>
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad-breath" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" fill="url(#grad-breath)" fillOpacity="0.08" stroke="url(#grad-breath)" strokeWidth="1.5" />
                    <circle cx="43" cy="50" r="20" stroke="url(#grad-breath)" strokeWidth="2.5" strokeOpacity="0.8" />
                    <circle cx="57" cy="50" r="20" stroke="url(#grad-breath)" strokeWidth="2.5" strokeOpacity="0.8" />
                </svg>
            </div>
        );
    }

    // Default monogram fallback
    return (
        <div className={`${sizeClass} flex-shrink-0 flex items-center justify-center rounded-full bg-sanctuary-stone border border-sanctuary-stone border-opacity-40 text-sanctuary-ink font-heading text-xs tracking-wider font-semibold select-none shadow-inner`}>
            {safeInitials}
        </div>
    );
}
