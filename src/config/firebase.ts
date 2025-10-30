import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFunctions, Functions } from 'firebase/functions';
import { getMessaging, Messaging } from 'firebase/messaging';

const parseAliasList = (aliases?: string): string[] => {
  if (!aliases) return [];
  return aliases
    .split(',')
    .map((alias) => alias.trim())
    .filter((alias) => alias.length > 0);
};

const resolveAuthDomain = (): string | undefined => {
  const defaultDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const aliasList = parseAliasList(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_ALIASES);

  if (typeof window !== 'undefined') {
    const hostWithPort = window.location.host;
    const host = window.location.hostname;

    // Prefer exact host matches (including port) if provided
    if (aliasList.includes(hostWithPort)) {
      return hostWithPort;
    }

    if (aliasList.includes(host)) {
      return host;
    }

    // Fallback: allow Firebase hosting domains automatically if present
    if (host.endsWith('.web.app') || host.endsWith('.firebaseapp.com')) {
      return host;
    }
  }

  return defaultDomain;
};

const resolvedAuthDomain = resolveAuthDomain();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: resolvedAuthDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug: Log config in development
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase Config:', {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing',
    authDomain: resolvedAuthDomain ? `✓ Using ${resolvedAuthDomain}` : '✗ Missing',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✓ Set' : '✗ Missing',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✓ Set' : '✗ Missing',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ Set' : '✗ Missing',
  });
  console.log('Firebase Auth Domain value (resolved):', resolvedAuthDomain);
}

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const functions: Functions = getFunctions(app);

// Firebase Messaging disabled for web app
// Messaging (push notifications) reserved for native apps (Android, Google TV, Homestead OS)
// Web app uses online-only functionality
let messagingInstance: Messaging | null = null;
export const getMessagingInstance = (): Messaging | null => {
  // Messaging disabled for web platform - returns null
  // This prevents browser API errors and keeps console clean
  // Native apps will initialize messaging separately
  return null;
};

export const messaging = null;

// Export the app
export default app;