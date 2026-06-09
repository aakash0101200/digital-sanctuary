import React, { useState, useEffect, useRef } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from '../firebase';

export default function AuthModal({ isOpen, onClose }) {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const emailInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            // Reset fields
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setErrorMsg('');
            setMode('login');
            setTimeout(() => emailInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleAuth = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!email || !password) {
            setErrorMsg("Email and passphrase are required.");
            return;
        }

        setLoading(true);

        if (mode === 'login') {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                onClose();
            } catch (error) {
                // If on localhost, auto-register the account if login fails (emulator database starts empty)
                if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
                    try {
                        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                        await setDoc(doc(db, 'users', userCredential.user.uid), {
                            uid: userCredential.user.uid,
                            email: userCredential.user.email,
                            role: 'pending',
                            approved: false,
                            createdAt: serverTimestamp()
                        });
                        onClose();
                        return;
                    } catch (regError) {
                        console.error("Auto-registration failed:", regError);
                    }
                }
                setErrorMsg("Awakening failed. Check your passphrase.");
            } finally {
                setLoading(false);
            }
        } else {
            // Register
            if (password !== confirmPassword) {
                setErrorMsg("Passphrases do not match.");
                setLoading(false);
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, 'users', userCredential.user.uid), {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    role: 'pending',
                    approved: false,
                    createdAt: serverTimestamp()
                });
                setErrorMsg("Identity forged. Awaiting awakening by the Sanctuary Elder.");
                setMode('login');
            } catch (error) {
                setErrorMsg(`Forging failed: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-sanctuary-linen bg-opacity-98 z-50 overflow-y-auto p-6 transition-all duration-300">
            <div className="w-full max-w-sm mx-auto min-h-screen flex flex-col justify-center py-12 text-center relative">
                <h2 className="font-heading text-3xl mb-8">
                    {mode === 'login' ? 'Awaken' : 'Forge Identity'}
                </h2>
                <form onSubmit={handleAuth} className="flex flex-col">
                    <input
                        type="email"
                        ref={emailInputRef}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="w-full bg-transparent border-b border-sanctuary-stone outline-none mb-6 text-sanctuary-ink font-body p-2 placeholder-opacity-40 text-center"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Passphrase"
                        required
                        className="w-full bg-transparent border-b border-sanctuary-stone outline-none mb-10 text-sanctuary-ink font-body p-2 placeholder-opacity-40 text-center"
                    />

                    {mode === 'register' && (
                        <div>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Passphrase"
                                required
                                className="w-full bg-transparent border-b border-sanctuary-stone outline-none mb-10 text-sanctuary-ink font-body p-2 placeholder-opacity-40 text-center"
                            />
                        </div>
                    )}

                    <div className="flex gap-4 justify-center">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100 focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 border border-sanctuary-stone text-xs tracking-widest uppercase opacity-70 hover:opacity-100 hover:bg-sanctuary-ink hover:text-sanctuary-linen transition-all duration-300 focus:outline-none disabled:opacity-30"
                        >
                            {loading
                                ? (mode === 'login' ? 'Awakening...' : 'Forging...')
                                : (mode === 'login' ? 'Enter' : 'Create Sanctuary')}
                        </button>
                    </div>
                </form>

                <p className="text-xs opacity-50 mt-4">
                    <span>{mode === 'login' ? 'New here?' : 'Already have a digital footprint?'}</span>{' '}
                    <button
                        type="button"
                        onClick={() => {
                            setMode(mode === 'login' ? 'register' : 'login');
                            setErrorMsg('');
                        }}
                        className="text-sanctuary-sage hover:underline focus:outline-none"
                    >
                        {mode === 'login' ? 'Register' : 'Awaken'}
                    </button>
                </p>

                {errorMsg && (
                    <p className="text-xs text-red-800 opacity-60 mt-6">{errorMsg}</p>
                )}
            </div>
        </div>
    );
}
