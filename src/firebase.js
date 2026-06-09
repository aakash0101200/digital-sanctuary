import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

const firebaseConfig = {
    apiKey: "AIzaSyD5a0RRcli_w8IRDofUcXFQ-1ysnv3CYrE",
    authDomain: "digital-mindfulness.firebaseapp.com",
    projectId: "digital-mindfulness",
    storageBucket: "digital-mindfulness.firebasestorage.app",
    messagingSenderId: "99797807432",
    appId: "1:99797807432:web:e283fd4d54c9b65b4f037d",
    measurementId: "G-QC95NQLDQX"
};

const app = initializeApp(firebaseConfig);

// Support App Check Debug Token locally when running on localhost/127.0.0.1
if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LcmEfUsAAAAAMSVdevUV0Ya3Jr1QkP_2CT3TDcl'),
    isTokenAutoRefreshEnabled: true
});

const auth = getAuth(app);
const db = getFirestore(app);

// Initialize AI Logic (Gemini Developer API via Firebase AI)
const ai = getAI(app, { backend: new GoogleAIBackend() });
const aiModel = getGenerativeModel(ai, {
    model: "gemini-flash-latest",
    generationConfig: {
        responseMimeType: "application/json"
    }
});

// Connect to emulators if running locally
if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
}

const ADMIN_EMAIL = "learnwithak2004@gmail.com";

export { app, appCheck, auth, db, aiModel, ADMIN_EMAIL };
