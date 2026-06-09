import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function MembersModal({ isOpen, onClose, currentUser }) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && currentUser) {
            fetchMembers();
        }
    }, [isOpen, currentUser]);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const list = [];
            querySnapshot.forEach((docSnap) => {
                list.push({ id: docSnap.id, ...docSnap.data() });
            });
            setMembers(list);
        } catch (e) {
            console.error("Error loading members:", e);
        } finally {
            setLoading(false);
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

    const handleUpdateStatus = async (uid, isApproved) => {
        try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, {
                approved: isApproved,
                role: isApproved ? 'author' : 'pending'
            });
            fetchMembers();
        } catch (e) {
            alert("Action resisted.");
        }
    };

    const handlePromoteAdmin = async (uid) => {
        try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, {
                role: 'admin',
                approved: true
            });
            fetchMembers();
        } catch (e) {
            alert("Action resisted.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-sanctuary-linen bg-opacity-98 z-50 overflow-y-auto p-6 transition-all duration-300">
            <div className="w-full max-w-2xl mx-auto min-h-screen flex flex-col justify-center py-12 relative">
                <div className="w-full bg-white p-6 md:p-12 shadow-sm border border-sanctuary-stone relative animate-fade-in">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="font-heading text-3xl">Seekers of the Sanctuary</h2>
                        <button
                            onClick={onClose}
                            className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100 focus:outline-none"
                        >
                            Close [Esc]
                        </button>
                    </div>

                    <div className="space-y-6 text-left">
                        {loading && members.length === 0 ? (
                            <p className="text-sm italic opacity-50">Gazing into the void...</p>
                        ) : members.length === 0 ? (
                            <p className="text-sm italic opacity-50">No seekers found in the registry.</p>
                        ) : (
                            members.map((member) => {
                                const isMe = currentUser && member.uid === currentUser.uid;
                                return (
                                    <div
                                        key={member.uid}
                                        className="flex items-center justify-between border-b border-sanctuary-stone pb-4"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">{member.email}</p>
                                            <p className="text-[10px] tracking-widest uppercase opacity-40">
                                                {member.role} {member.approved ? '• Approved' : '• Pending'}
                                              </p>
                                        </div>
                                        <div className="flex gap-3">
                                            {!member.approved ? (
                                                <button
                                                    onClick={() => handleUpdateStatus(member.uid, true)}
                                                    className="text-[10px] tracking-widest uppercase text-sanctuary-sage font-medium hover:opacity-70 focus:outline-none"
                                                >
                                                    Approve
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleUpdateStatus(member.uid, false)}
                                                    className="text-[10px] tracking-widest uppercase text-red-800 font-medium hover:opacity-70 focus:outline-none"
                                                >
                                                    Revoke
                                                </button>
                                            )}
                                            {!isMe && member.role !== 'admin' && (
                                                <button
                                                    onClick={() => handlePromoteAdmin(member.uid)}
                                                    className="text-[10px] tracking-widest uppercase opacity-40 hover:opacity-100 focus:outline-none"
                                                >
                                                    Make Admin
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="mt-12 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-sanctuary-stone text-xs tracking-widest uppercase opacity-70 hover:opacity-100 hover:bg-sanctuary-ink hover:text-sanctuary-linen transition-all duration-300 focus:outline-none"
                        >
                            Return
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
