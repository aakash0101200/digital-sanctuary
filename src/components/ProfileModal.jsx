import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Emblem from './Emblem';

export default function ProfileModal({ isOpen, onClose, user, userProfile, ADMIN_EMAIL, onProfileUpdate }) {
    const [displayName, setDisplayName] = useState('');
    const [postsCount, setPostsCount] = useState(0);
    const [avatarId, setAvatarId] = useState('default');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            setDisplayName(userProfile?.displayName || user.email.split('@')[0]);
            setAvatarId(userProfile?.avatarId || 'default');
            fetchStatsAndMilestone();
        }
    }, [isOpen, user, userProfile]);

    const fetchStatsAndMilestone = async () => {
        if (!user) return;
        try {
            const q = query(collection(db, 'posts'), where("authorId", "==", user.uid), where("status", "==", "published"));
            const querySnapshot = await getDocs(q);
            setPostsCount(querySnapshot.size);
        } catch (e) {
            console.error("Error fetching stats:", e);
        }
    };

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

    if (!isOpen || !user) return null;

    const isElder = user.email === ADMIN_EMAIL;
    const isAdminRole = userProfile?.role === 'admin';
    const isApproved = userProfile?.approved === true;
    const hasLoyalty = postsCount >= 3;
    const isAvatarUnlocked = isElder || isAdminRole || isApproved || hasLoyalty;

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        const finalDisplayName = displayName.trim() || user.email.split('@')[0];

        try {
            // Save to users collection
            await updateDoc(doc(db, 'users', user.uid), {
                displayName: finalDisplayName,
                avatarId: avatarId
            });

            // Call parent callback to update local state immediately
            onProfileUpdate(finalDisplayName, avatarId);

            // Update existing posts asynchronously to reflect new profile display
            try {
                const postsQuery = query(collection(db, 'posts'), where("authorId", "==", user.uid));
                const postsSnapshot = await getDocs(postsQuery);
                const batchPromises = [];
                postsSnapshot.forEach((postDoc) => {
                    batchPromises.push(updateDoc(doc(db, 'posts', postDoc.id), {
                        authorName: finalDisplayName,
                        authorAvatar: avatarId
                      }));
                });
                await Promise.all(batchPromises);
            } catch (postsErr) {
                console.warn("Could not update some of seeker's past posts:", postsErr);
            }

            onClose();
        } catch (err) {
            console.error("Failed to save profile:", err);
            alert("The sanctuary resisted your profile update.");
        } finally {
            setLoading(false);
        }
    };

    const premiumAvatars = [
        { id: 'lotus', name: 'Lotus' },
        { id: 'crescent', name: 'Crescent' },
        { id: 'ripple', name: 'Ripple' },
        { id: 'sol', name: 'Sol' },
        { id: 'breath', name: 'Breath' }
    ];

    return (
        <div className="fixed inset-0 bg-sanctuary-linen bg-opacity-98 z-50 overflow-y-auto p-6 transition-all duration-300">
            <div className="w-full max-w-md mx-auto min-h-screen flex flex-col justify-center py-12 relative">
                <div className="w-full bg-white p-8 md:p-12 shadow-sm border border-sanctuary-stone text-center relative animate-fade-in">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="font-heading text-3xl">Your Presence</h2>
                        <button
                            onClick={onClose}
                            className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100 focus:outline-none"
                        >
                            Close [Esc]
                        </button>
                    </div>

                    <div className="mb-6 flex justify-center">
                        <Emblem
                            avatarId={avatarId}
                            initials={displayName}
                            sizeClass="w-20 h-20"
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="profile-display-name"
                            className="block text-[10px] tracking-widest uppercase opacity-50 mb-2 text-left"
                        >
                            Display Name
                        </label>
                        <input
                            type="text"
                            id="profile-display-name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Anonymous Seeker"
                            className="w-full bg-transparent border-b border-sanctuary-stone outline-none text-sanctuary-ink font-body p-2 placeholder-opacity-30"
                        />
                    </div>

                    <div className="mb-8 p-4 bg-sanctuary-linen bg-opacity-40 border border-sanctuary-stone border-opacity-30 rounded-sm text-xs space-y-2 text-left">
                        <div className="flex justify-between">
                            <span className="opacity-50">Email:</span>
                            <span className="font-medium">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="opacity-50">Role:</span>
                            <span className="font-medium uppercase tracking-wider">
                                {userProfile?.role || 'pending'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="opacity-50">Thoughts Shared:</span>
                            <span className="font-medium">{postsCount} / 3 published</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="opacity-50">Sanctuary Status:</span>
                            <span className="font-medium text-right">
                                {isElder || isAdminRole
                                    ? 'Sanctuary Elder (All Emblems Unlocked)'
                                    : isApproved
                                    ? 'Approved Seeker (All Emblems Unlocked)'
                                    : hasLoyalty
                                    ? 'Loyal Seeker (All Emblems Unlocked)'
                                    : 'Pending Approval (Share 3 thoughts to unlock)'}
                            </span>
                        </div>
                    </div>

                    {/* Avatar Selector Section */}
                    <div className="mb-8 text-left">
                        <h3 className="block text-[10px] tracking-widest uppercase opacity-50 mb-4">
                            Choose Emblem
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            {/* Option 1: Default */}
                            <div
                                onClick={() => setAvatarId('default')}
                                className={`cursor-pointer p-2 flex flex-col items-center justify-center border ${
                                    avatarId === 'default'
                                        ? 'border-sanctuary-sage bg-sanctuary-linen bg-opacity-40'
                                        : 'border-transparent hover:border-sanctuary-stone'
                                } rounded-md transition-all duration-300`}
                            >
                                <Emblem avatarId="default" initials={displayName} sizeClass="w-12 h-12" />
                                <span className="text-[9px] tracking-widest uppercase opacity-50 mt-2">
                                    Default
                                </span>
                            </div>

                            {/* Premium emblems options */}
                            {premiumAvatars.map((av) => {
                                const isSelected = avatarId === av.id;
                                const isLocked = !isAvatarUnlocked;

                                if (isLocked) {
                                    return (
                                        <div
                                            key={av.id}
                                            className="relative p-2 flex flex-col items-center justify-center border border-transparent opacity-40 select-none cursor-not-allowed"
                                        >
                                            <div className="relative w-12 h-12">
                                                <Emblem avatarId={av.id} initials="" sizeClass="w-full h-full" />
                                                <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm border border-sanctuary-stone">
                                                    <svg
                                                        className="w-2.5 h-2.5 text-sanctuary-ink opacity-70"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                    >
                                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <span className="text-[9px] tracking-widest uppercase opacity-40 mt-2">
                                                {av.name}
                                            </span>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={av.id}
                                        onClick={() => setAvatarId(av.id)}
                                        className={`cursor-pointer p-2 flex flex-col items-center justify-center border ${
                                            isSelected
                                                ? 'border-sanctuary-sage bg-sanctuary-linen bg-opacity-40'
                                                : 'border-transparent hover:border-sanctuary-stone'
                                        } rounded-md transition-all duration-300`}
                                    >
                                        <Emblem avatarId={av.id} initials="" sizeClass="w-12 h-12" />
                                        <span className="text-[9px] tracking-widest uppercase opacity-60 mt-2">
                                            {av.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {isAvatarUnlocked ? (
                            <p className="text-[10px] text-sanctuary-sage mt-4 font-medium text-center">
                                Premium emblems are unlocked! Your presence is felt.
                            </p>
                        ) : (
                            <p className="text-[10px] text-red-800 opacity-60 mt-4 italic text-center">
                                Premium emblems unlock after Elder approval or publishing 3 thoughts (Need{' '}
                                {Math.max(0, 3 - postsCount)} more).
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-2 border border-sanctuary-stone text-xs tracking-widest uppercase opacity-50 hover:opacity-100 transition-all duration-300 focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={loading}
                            className="px-6 py-2 border border-sanctuary-stone text-xs tracking-widest uppercase opacity-70 hover:opacity-100 hover:bg-sanctuary-sage hover:text-sanctuary-linen hover:border-sanctuary-sage transition-all duration-300 focus:outline-none disabled:opacity-30"
                        >
                            {loading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
