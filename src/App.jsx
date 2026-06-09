import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    addDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { auth, db, aiModel, ADMIN_EMAIL } from './firebase';

import Header from './components/Header';
import Feed from './components/Feed';
import Footer from './components/Footer';

// Modals
import AuthModal from './components/AuthModal';
import EditorModal from './components/EditorModal';
import GuardianModal from './components/GuardianModal';
import ProfileModal from './components/ProfileModal';
import SettingsModal from './components/SettingsModal';
import MembersModal from './components/MembersModal';

export default function App() {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [canWrite, setCanWrite] = useState(false);

    const [appTitle, setAppTitle] = useState('The Digital Sanctuary');
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [activeRoute, setActiveRoute] = useState('feed'); // 'feed' | 'drafts'

    // Modal states
    const [authOpen, setAuthOpen] = useState(false);
    const [editorOpen, setEditorOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [membersOpen, setMembersOpen] = useState(false);
    const [guardianOpen, setGuardianOpen] = useState(false);

    // Editing thought state
    const [editingPost, setEditingPost] = useState(null);
    const [editorLoading, setEditorLoading] = useState(false);
    const [guardianMessage, setGuardianMessage] = useState('');

    // 1. App Title Loader
    useEffect(() => {
        const settingsRef = doc(db, 'settings', 'app_settings');
        const unsub = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                setAppTitle(docSnap.data().appTitle || 'The Digital Sanctuary');
            } else {
                initializeDefaultSettings();
            }
        }, (err) => {
            console.warn("Could not synchronize app settings:", err.message);
        });
        return () => unsub();
    }, [user]);

    const initializeDefaultSettings = async () => {
        if (user && user.email === ADMIN_EMAIL) {
            try {
                const settingsRef = doc(db, 'settings', 'app_settings');
                await setDoc(settingsRef, { appTitle: 'The Digital Sanctuary' });
            } catch (e) {
                console.error("Failed to initialize app settings:", e);
            }
        }
    };

    // 2. Authentication Monitor
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const isElder = currentUser.email === ADMIN_EMAIL;
                try {
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    let userDoc = await getDoc(userDocRef);
                    let profileData = null;

                    if (userDoc.exists()) {
                        profileData = userDoc.data();
                        // Upgrade admin email profile if needed
                        if (isElder && (profileData.role !== 'admin' || profileData.approved !== true)) {
                            await updateDoc(userDocRef, {
                                role: 'admin',
                                approved: true
                            });
                            profileData.role = 'admin';
                            profileData.approved = true;
                        }
                    } else {
                        profileData = {
                            uid: currentUser.uid,
                            email: currentUser.email,
                            role: isElder ? 'admin' : 'pending',
                            approved: isElder ? true : false,
                            createdAt: serverTimestamp()
                        };
                        await setDoc(userDocRef, profileData);
                    }

                    setUserProfile(profileData);
                    setIsAdmin(isElder || profileData.role === 'admin');
                    setCanWrite(isElder || profileData.role === 'admin' || profileData.approved === true);
                } catch (e) {
                    console.error("Error monitoring user profile:", e);
                    setIsAdmin(isElder);
                    setCanWrite(isElder);
                }
            } else {
                setUserProfile(null);
                setIsAdmin(false);
                setCanWrite(false);
                setActiveRoute('feed');
            }
        });
        return () => unsub();
    }, []);

    // 3. Realtime Posts Feed Monitor
    useEffect(() => {
        setLoadingPosts(true);
        const postsRef = collection(db, 'posts');
        let q;

        if (activeRoute === 'drafts' && user) {
            q = query(
                postsRef,
                where("status", "==", "draft"),
                where("authorId", "==", user.uid),
                orderBy("createdAt", "desc")
            );
        } else {
            q = query(
                postsRef,
                where("status", "==", "published"),
                orderBy("createdAt", "desc")
            );
        }

        const unsub = onSnapshot(q, (snapshot) => {
            const list = [];
            snapshot.forEach((docSnap) => {
                list.push({ id: docSnap.id, ...docSnap.data() });
            });
            setPosts(list);
            setLoadingPosts(false);
        }, (error) => {
            console.error("Error synchronizing thoughts:", error);
            setLoadingPosts(false);
        });

        return () => unsub();
    }, [activeRoute, user]);

    // Helper: AI check
    const checkContentSafety = async (title, content) => {
        const prompt = `You are the Guardian of the Digital Sanctuary. Your role is to evaluate thoughts shared by seekers.
The Sanctuary is a safe, non-judgmental space for sharing life perspectives, mindfulness, and personal insights.
Evaluate the following post against our guidelines:
1. NO HATE SPEECH OR HARASSMENT: Absolutely no slurs, personal attacks, bullying, discrimination, or hate speech.
2. PERSONAL REFLECTION: Thoughts should be personal insights, philosophies, or reflections on life. They should not be pure spam, commercial advertisements, or illegal content.
3. NO EXPLICIT CONTENT: Content must be safe for all readers (no graphic violence or sexually explicit material).
4. RESPECTFUL EXPRESSION: While we do not judge personal opinions, we do not allow posts that attack or denigrate others.

Post Title: "${title}"
Post Content:
"${content}"

Respond strictly in JSON format with two fields:
- "status": "approved" or "flagged"
- "reason": A gentle, reflective, and non-judgmental explanation of why the post was flagged (leave empty if approved). Provide advice on how they can reframe their thought to align with the Sanctuary's spirit.`;

        try {
            const result = await aiModel.generateContent(prompt);
            const responseText = result.response.text();
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const evaluation = JSON.parse(cleanJson);
            return evaluation;
        } catch (e) {
            console.error("AI Content safety check failed, allowing submission:", e);
            return { status: "approved", reason: "" };
        }
    };

    // Post Actions
    const handlePublishPost = async (title, content) => {
        if (!user) return;
        const cleanTitle = title.trim();
        const cleanContent = content.trim();

        if (!cleanTitle || !cleanContent) {
            alert("A published thought must have both a title and content.");
            return;
        }

        setEditorLoading(true);

        const evaluation = await checkContentSafety(cleanTitle, cleanContent);
        if (evaluation.status === 'flagged') {
            setGuardianMessage(evaluation.reason);
            setGuardianOpen(true);
            setEditorLoading(false);
            return;
        }

        const authorName = userProfile?.displayName || user.email.split('@')[0];
        const authorAvatar = userProfile?.avatarId || 'default';

        try {
            const postsRef = collection(db, 'posts');
            if (editingPost) {
                await updateDoc(doc(db, 'posts', editingPost.id), {
                    title: cleanTitle,
                    content: cleanContent,
                    status: 'published',
                    authorName: authorName,
                    authorAvatar: authorAvatar
                });
            } else {
                await addDoc(postsRef, {
                    title: cleanTitle,
                    content: cleanContent,
                    createdAt: serverTimestamp(),
                    authorId: user.uid,
                    status: 'published',
                    authorName: authorName,
                    authorAvatar: authorAvatar
                });
            }
            setEditorOpen(false);
            setEditingPost(null);
        } catch (err) {
            console.error("Save post failed:", err);
            alert("The sanctuary resisted your publication request.");
        } finally {
            setEditorLoading(false);
        }
    };

    const handleSaveDraft = async (title, content) => {
        if (!user) return;
        const cleanTitle = title.trim();
        const cleanContent = content.trim();

        if (!cleanTitle && !cleanContent) {
            alert("A draft must have at least a title or some content.");
            return;
        }

        setEditorLoading(true);
        const authorName = userProfile?.displayName || user.email.split('@')[0];
        const authorAvatar = userProfile?.avatarId || 'default';

        try {
            const postsRef = collection(db, 'posts');
            if (editingPost) {
                await updateDoc(doc(db, 'posts', editingPost.id), {
                    title: cleanTitle,
                    content: cleanContent,
                    status: 'draft',
                    authorName: authorName,
                    authorAvatar: authorAvatar
                });
            } else {
                await addDoc(postsRef, {
                    title: cleanTitle,
                    content: cleanContent,
                    createdAt: serverTimestamp(),
                    authorId: user.uid,
                    status: 'draft',
                    authorName: authorName,
                    authorAvatar: authorAvatar
                });
            }
            setEditorOpen(false);
            setEditingPost(null);
        } catch (err) {
            console.error("Save draft failed:", err);
            alert("The sanctuary resisted saving your draft.");
        } finally {
            setEditorLoading(false);
        }
    };

    const handleEditPost = (post) => {
        setEditingPost(post);
        setEditorOpen(true);
    };

    const handleDeletePost = async (postId) => {
        if (!user) return;
        if (!confirm("Are you sure you wish to remove this thought from existence?")) return;

        try {
            await deleteDoc(doc(db, 'posts', postId));
        } catch (err) {
            console.error("Delete post failed:", err);
            alert("The sanctuary resisted your request to remove this thought.");
        }
    };

    const handleProfileUpdateLocal = (newDisplayName, newAvatarId) => {
        setUserProfile(prev => ({
            ...prev,
            displayName: newDisplayName,
            avatarId: newAvatarId
        }));
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <div className="flex-grow flex flex-col min-h-screen">
            <Header
                appTitle={appTitle}
                user={user}
                isAdmin={isAdmin}
                canWrite={canWrite}
                activeRoute={activeRoute}
                setActiveRoute={setActiveRoute}
                onOpenAuth={() => setAuthOpen(true)}
                onOpenEditor={() => {
                    setEditingPost(null);
                    setEditorOpen(true);
                }}
                onOpenProfile={() => setProfileOpen(true)}
                onOpenSettings={() => setSettingsOpen(true)}
                onOpenMembers={() => setMembersOpen(true)}
                onLogout={handleLogout}
            />

            <Feed
                posts={posts}
                loading={loadingPosts}
                isAdmin={isAdmin}
                currentUser={user}
                onEditPost={handleEditPost}
                onDeletePost={handleDeletePost}
                activeRoute={activeRoute}
            />

            <Footer />

            {/* Overlay Modals */}
            <AuthModal
                isOpen={authOpen}
                onClose={() => setAuthOpen(false)}
            />

            <EditorModal
                isOpen={editorOpen}
                onClose={() => {
                    setEditorOpen(false);
                    setEditingPost(null);
                }}
                editingPost={editingPost}
                onPublish={handlePublishPost}
                onSaveDraft={handleSaveDraft}
                loading={editorLoading}
            />

            <GuardianModal
                isOpen={guardianOpen}
                message={guardianMessage}
                onClose={() => setGuardianOpen(false)}
            />

            <ProfileModal
                isOpen={profileOpen}
                onClose={() => setProfileOpen(false)}
                user={user}
                userProfile={userProfile}
                ADMIN_EMAIL={ADMIN_EMAIL}
                onProfileUpdate={handleProfileUpdateLocal}
            />

            <SettingsModal
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                appTitle={appTitle}
                onSettingsUpdate={(newTitle) => setAppTitle(newTitle)}
            />

            <MembersModal
                isOpen={membersOpen}
                onClose={() => setMembersOpen(false)}
                currentUser={user}
            />
        </div>
    );
}
