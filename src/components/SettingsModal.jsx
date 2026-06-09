import React, { useState, useEffect, useRef } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function SettingsModal({ isOpen, onClose, appTitle, onSettingsUpdate }) {
    const [titleSetting, setTitleSetting] = useState('');
    const [loading, setLoading] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setTitleSetting(appTitle);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, appTitle]);

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

    const handleSave = async (e) => {
        e.preventDefault();
        const cleanTitle = titleSetting.trim();
        if (!cleanTitle) {
            alert("App Title cannot be empty.");
            return;
        }

        setLoading(true);
        try {
            const settingsRef = doc(db, 'settings', 'app_settings');
            await setDoc(settingsRef, { appTitle: cleanTitle });
            onSettingsUpdate(cleanTitle);
            onClose();
        } catch (err) {
            console.error("Failed to save settings:", err);
            alert("The sanctuary resisted your settings change.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-sanctuary-linen bg-opacity-98 z-50 overflow-y-auto p-6 transition-all duration-300">
            <div className="w-full max-w-[65ch] mx-auto min-h-screen flex flex-col justify-center py-12 relative">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="font-heading text-3xl md:text-4xl leading-tight">App Settings</h2>
                    <button
                        onClick={onClose}
                        className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100 focus:outline-none"
                    >
                        Close [Esc]
                    </button>
                </div>

                <form onSubmit={handleSave}>
                    <label
                        htmlFor="app-title-setting"
                        className="block text-sm tracking-widest uppercase opacity-70 mb-2"
                    >
                        App Title
                    </label>
                    <input
                        type="text"
                        id="app-title-setting"
                        ref={inputRef}
                        value={titleSetting}
                        onChange={(e) => setTitleSetting(e.target.value)}
                        placeholder="The Digital Sanctuary"
                        disabled={loading}
                        className="w-full bg-transparent border-b border-sanctuary-stone outline-none mb-8 text-sanctuary-ink font-body p-2 placeholder-opacity-30"
                    />

                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-2 border border-sanctuary-stone text-xs tracking-widest uppercase opacity-70 hover:opacity-100 hover:bg-sanctuary-stone hover:text-sanctuary-ink transition-all duration-300 focus:outline-none disabled:opacity-30"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="ml-4 px-6 py-2 border border-sanctuary-stone text-xs tracking-widest uppercase opacity-70 hover:opacity-100 hover:bg-sanctuary-sage hover:text-sanctuary-linen hover:border-sanctuary-sage transition-all duration-300 focus:outline-none disabled:opacity-30"
                        >
                            {loading ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
