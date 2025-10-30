import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFamilyCode: (familyCode: string) => Promise<void>;
  loginWithMNI: (businessId: string, accessCode: string) => Promise<void>;
  loginWithEmergencyCode: (emergencyCode: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  validateFamilyCode: (code: string) => Promise<boolean>;
  validateEmergencyCode: (code: string) => Promise<boolean>;
  getAuthLayers: () => string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Authorized family emails
const AUTHORIZED_EMAILS = process.env.NEXT_PUBLIC_AUTHORIZED_FAMILY_EMAILS?.split(',') || [
  'spiceinc@gmail.com',
  'zenzxru@gmail.com',
  'kwakhomdeni@gmail.com',
  'tina@salatiso.com',
  'mdenit21@gmail.com',
  'visasande@gmail.com',
  'mdenivisa@gmail.com',
  'sazisimdeni@gmail.com',
  'milandep.mdeni@gmail.com',
  'milamdeni@gmail.com',
  'azoramdeni@gmail.com',
  'mdeninotembac@gmail.com'
];

const AUTH_DEBUG_ENABLED = process.env.NEXT_PUBLIC_AUTH_DEBUG === 'true' || process.env.NODE_ENV === 'development';

const debugLog = (...args: unknown[]) => {
  if (AUTH_DEBUG_ENABLED) {
    console.log(...args);
  }
};

// Debug: Log authorized emails only when explicitly enabled
debugLog('Auth Debug - Environment:', process.env.NODE_ENV);
debugLog('Auth Debug - Authorized Emails:', AUTHORIZED_EMAILS);
debugLog('Auth Debug - Env Variable:', process.env.NEXT_PUBLIC_AUTHORIZED_FAMILY_EMAILS);

// Role determination based on email
const determineUserRole = (email: string): UserRole => {
  const emailLower = email.toLowerCase();
  
  if (emailLower.includes('salatiso')) return 'founder';
  if (emailLower.includes('visasande')) return 'parent_company_lead';
  if (emailLower.includes('solo')) return 'youth_member';
  if (emailLower.includes('tina') || emailLower.includes('kwakho')) return 'general_family_member';
  
  return 'guest';
};

const isAuthorizedEmail = (email: string): boolean => {
  const normalizedEmail = email.toLowerCase().trim();
  const isAuthorized = AUTHORIZED_EMAILS.some(authEmail => 
    authEmail.toLowerCase().trim() === normalizedEmail
  );
  
  // Debug logging for production troubleshooting
  debugLog('Email authorization check:', {
    email: normalizedEmail,
    authorizedEmails: AUTHORIZED_EMAILS,
    isAuthorized,
    environment: process.env.NODE_ENV
  });
  
  return isAuthorized;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user profile in Firestore
  const initializeUserProfile = async (firebaseUser: FirebaseUser): Promise<User> => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        ...userData,
        id: firebaseUser.uid,
        createdAt: userData.createdAt?.toDate() || new Date(),
        lastLogin: userData.lastLogin?.toDate() || new Date(),
        role: userData.role || determineUserRole(firebaseUser.email!),
        gamification: userData.gamification || {
          level: 1,
          experiencePoints: 0,
          pointsToNextLevel: 100,
          badges: [],
          achievements: [],
          streaks: [],
          leaderboardRank: 0,
        },
        preferences: userData.preferences || {
          theme: 'light',
          language: 'en',
          notifications: {
            email: true,
            push: true,
            projectUpdates: true,
            careerMilestones: true,
            familyAnnouncements: true,
          },
          dashboardLayout: [],
          gamificationEnabled: true,
        },
      } as User;
    } else {
      // Create new user profile
      const newUser: Omit<User, 'id'> = {
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || undefined,
        role: determineUserRole(firebaseUser.email!),
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: {
            email: true,
            push: true,
            projectUpdates: true,
            careerMilestones: true,
            familyAnnouncements: true,
          },
          dashboardLayout: [],
          gamificationEnabled: true,
        },
        gamification: {
          level: 1,
          experiencePoints: 0,
          pointsToNextLevel: 100,
          badges: [],
          achievements: [],
          streaks: [],
          leaderboardRank: 0,
          trustScore: {
            overall: 50,
            ecosystem: 50,
            family: 50,
            business: 50,
            learning: 50,
            lastUpdated: new Date(),
            factors: [],
          },
          achievementCategories: [
            {
              id: 'ecosystem',
              name: 'Ecosystem Builder',
              description: 'Contributions to the broader Salatiso ecosystem',
              dimension: 'ecosystem',
              totalPoints: 0,
              unlockedAchievements: [],
              availableAchievements: [],
              progress: 0,
            },
            {
              id: 'family',
              name: 'Family Steward',
              description: 'Family governance and relationship building',
              dimension: 'family',
              totalPoints: 0,
              unlockedAchievements: [],
              availableAchievements: [],
              progress: 0,
            },
            {
              id: 'business',
              name: 'Business Leader',
              description: 'Business development and entrepreneurial achievements',
              dimension: 'business',
              totalPoints: 0,
              unlockedAchievements: [],
              availableAchievements: [],
              progress: 0,
            },
            {
              id: 'learning',
              name: 'Lifelong Learner',
              description: 'Continuous learning and skill development',
              dimension: 'learning',
              totalPoints: 0,
              unlockedAchievements: [],
              availableAchievements: [],
              progress: 0,
            },
          ],
        },
        mniProfile: {
          userId: firebaseUser.uid,
          ownerships: [],
          contributions: [],
          eligibility: [],
          performanceMetrics: [],
          developmentPlan: {
            id: `dev-plan-${firebaseUser.uid}`,
            goals: [],
            timeline: '2025-2026',
            resources: [],
            progress: 0,
            reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          },
          lastAssessment: new Date(),
        },
      };

      await setDoc(userDocRef, {
        id: firebaseUser.uid,
        ...newUser,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      return {
        ...newUser,
        id: firebaseUser.uid,
      };
    }
  };

  // Update last login timestamp
  const updateLastLogin = async (userId: string) => {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });
  };

  const login = async (email: string, password: string) => {
    if (!isAuthorizedEmail(email)) {
      throw new Error('Unauthorized email address. Access is restricted to family members.');
    }

    setLoading(true);
    try {
      console.log('🔐 Attempting Firebase email/password sign-in for:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase auth succeeded for user:', result.user.email);
      console.log('🔄 Waiting for auth state change handler...');
      // Don't set loading to false here - let the auth state change handler handle it
    } catch (error: any) {
      setLoading(false);
      console.error('❌ Firebase auth failed:', {
        code: error.code,
        message: error.message,
        email: email,
      });
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // Use redirect method to avoid Cross-Origin-Opener-Policy (COOP) issues
      // This is more reliable than popup and avoids popup blockers
      console.log('🔐 Starting Google sign-in with redirect...');
      await signInWithRedirect(auth, googleProvider);
      // The user will be redirected to Google, then back to the app
      // The auth state change handler will process the user after redirect
    } catch (error: any) {
      setLoading(false);
      console.error('❌ Google sign-in redirect error:', error);
      console.error('   Error code:', error.code);
      console.error('   Error message:', error.message);
      alert('Sign-in failed: ' + error.message);
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    if (!isAuthorizedEmail(email)) {
      throw new Error('Unauthorized email address. Access is restricted to family members.');
    }
    
    setLoading(true);
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      // User profile will be initialized in the auth state change handler
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const loginWithFamilyCode = async (familyCode: string) => {
    setLoading(true);
    try {
      // Validate family code against Firestore
      const isValid = await validateFamilyCode(familyCode);
      if (!isValid) {
        throw new Error('Invalid family verification code');
      }

      // Create anonymous user session for family access
      // This provides limited access for family verification scenarios
      const familyUser: User = {
        id: `family_${Date.now()}`,
        email: 'family@salatiso.com',
        displayName: 'Family Member',
        role: 'general_family_member',
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: {
            email: false,
            push: false,
            projectUpdates: true,
            careerMilestones: false,
            familyAnnouncements: true,
          },
          dashboardLayout: [],
          gamificationEnabled: true,
        },
        gamification: {
          level: 1,
          experiencePoints: 0,
          pointsToNextLevel: 100,
          badges: [],
          achievements: [],
          streaks: [],
          leaderboardRank: 0,
          trustScore: {
            overall: 50,
            ecosystem: 50,
            family: 50,
            business: 50,
            learning: 50,
            lastUpdated: new Date(),
            factors: [],
          },
          achievementCategories: [
            {
              id: 'ecosystem',
              name: 'Ecosystem Builder',
              description: 'Contributions to the broader Salatiso ecosystem',
              dimension: 'ecosystem',
              totalPoints: 0,
              unlockedAchievements: [],
              availableAchievements: [],
              progress: 0,
            },
            {
              id: 'family',
              name: 'Family Steward',
              description: 'Family governance and relationship building',
              dimension: 'family',
              totalPoints: 0,
              unlockedAchievements: [],
              availableAchievements: [],
              progress: 0,
            },
            {
              id: 'business',
              name: 'Business Leader',
              description: 'Business development and entrepreneurial achievements',
              dimension: 'business',
              totalPoints: 0,
              unlockedAchievements: [],
              availableAchievements: [],
              progress: 0,
            },
            {
              id: 'learning',
              name: 'Lifelong Learner',
              description: 'Continuous learning and skill development',
              dimension: 'learning',
              totalPoints: 0,
              unlockedAchievements: [],
              availableAchievements: [],
              progress: 0,
            },
          ],
        },
        mniProfile: {
          userId: firebaseUser.uid,
          ownerships: [],
          contributions: [],
          eligibility: [],
          performanceMetrics: [],
          developmentPlan: {
            id: `dev-plan-${firebaseUser.uid}`,
            goals: [],
            timeline: '2025-2026',
            resources: [],
            progress: 0,
            reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
          lastAssessment: new Date(),
        },
        familyCode: familyCode,
        accessLevel: 'family'
      };

      setUser(familyUser);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const loginWithMNI = async (businessId: string, accessCode: string) => {
    setLoading(true);
    try {
      // Validate MNI business credentials
      const businessDocRef = doc(db, 'mni_business', businessId);
      const businessDoc = await getDoc(businessDocRef);

      if (!businessDoc.exists()) {
        throw new Error('Invalid MNI business ID');
      }

      const businessData = businessDoc.data();
      if (businessData.accessCode !== accessCode) {
        throw new Error('Invalid MNI access code');
      }

      // Create MNI business user session
      const mniUser: User = {
        id: `mni_${businessId}_${Date.now()}`,
        email: `business@${businessId}.mni.com`,
        displayName: businessData.name || 'MNI Business User',
        role: 'business_member',
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: {
            email: true,
            push: true,
            projectUpdates: true,
            careerMilestones: true,
            familyAnnouncements: false,
          },
          dashboardLayout: [],
          gamificationEnabled: false,
        },
        gamification: {
          level: 1,
          experiencePoints: 0,
          pointsToNextLevel: 100,
          badges: [],
          achievements: [],
          streaks: [],
          leaderboardRank: 0,
          trustScore: {
            overall: 50,
            ecosystem: 50,
            family: 50,
            business: 50,
            learning: 50,
            lastUpdated: new Date(),
            factors: [],
          },
          achievementCategories: [
            {
              id: 'ecosystem',
              name: 'Ecosystem Builder',
              description: 'Contributions to the broader Salatiso ecosystem',
              dimension: 'ecosystem',
              totalPoints: 0,
              unlockedAchievements: [],
              availableAchievements: [],
              progress: 0,
            },
            {
              id: 'family',
              name: 'Family Steward',
              description: 'Family governance and relationship building',
              dimension: 'family',
              totalPoints: 0,
              unlockedAchievements: [],
              availableAchievements: [],
              progress: 0,
            },
            {
              id: 'business',
              name: 'Business Leader',
              description: 'Business development and entrepreneurial achievements',
              dimension: 'business',
              totalPoints: 0,
              unlockedAchievements: [],
              availableAchievements: [],
              progress: 0,
            },
            {
              id: 'learning',
              name: 'Lifelong Learner',
              description: 'Continuous learning and skill development',
              dimension: 'learning',
              totalPoints: 0,
              unlockedAchievements: [],
              availableAchievements: [],
              progress: 0,
            },
          ],
        },
        mniProfile: {
          userId: firebaseUser.uid,
          ownerships: [],
          contributions: [],
          eligibility: [],
          performanceMetrics: [],
          developmentPlan: {
            id: `dev-plan-${firebaseUser.uid}`,
            goals: [],
            timeline: '2025-2026',
            resources: [],
            progress: 0,
            reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
          lastAssessment: new Date(),
        },
        businessId: businessId,
        accessLevel: 'business'
      };

      setUser(mniUser);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const loginWithEmergencyCode = async (emergencyCode: string) => {
    setLoading(true);
    try {
      const isValid = await validateEmergencyCode(emergencyCode);
      if (!isValid) {
        throw new Error('Invalid emergency access code');
      }

      // Create emergency access session with limited functionality
      const emergencyUser: User = {
        id: `emergency_${Date.now()}`,
        email: 'emergency@salatiso.com',
        displayName: 'Emergency Access',
        role: 'emergency_access',
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: {
            email: false,
            push: false,
            projectUpdates: false,
            careerMilestones: false,
            familyAnnouncements: false,
          },
          dashboardLayout: [],
          gamificationEnabled: false,
        },
        gamification: {
          level: 1,
          experiencePoints: 0,
          pointsToNextLevel: 100,
          badges: [],
          achievements: [],
          streaks: [],
          leaderboardRank: 0,
          trustScore: {
            overall: 50,
            ecosystem: 50,
            family: 50,
            business: 50,
            learning: 50,
            lastUpdated: new Date(),
            factors: [],
          },
          achievementCategories: [
            {
              id: 'ecosystem',
              name: 'Ecosystem Builder',
              description: 'Contributions to the broader Salatiso ecosystem',
              dimension: 'ecosystem',
              totalPoints: 0,
              unlockedAchievements: [],
              availableAchievements: [],
              progress: 0,
            },
            {
              id: 'family',
              name: 'Family Steward',
              description: 'Family governance and relationship building',
              dimension: 'family',
              totalPoints: 0,
              unlockedAchievements: [],
              availableAchievements: [],
              progress: 0,
            },
            {
              id: 'business',
              name: 'Business Leader',
              description: 'Business development and entrepreneurial achievements',
              dimension: 'business',
              totalPoints: 0,
              unlockedAchievements: [],
              availableAchievements: [],
              progress: 0,
            },
            {
              id: 'learning',
              name: 'Lifelong Learner',
              description: 'Continuous learning and skill development',
              dimension: 'learning',
              totalPoints: 0,
              unlockedAchievements: [],
              availableAchievements: [],
              progress: 0,
            },
          ],
        },
        mniProfile: {
          userId: firebaseUser.uid,
          ownerships: [],
          contributions: [],
          eligibility: [],
          performanceMetrics: [],
          developmentPlan: {
            id: `dev-plan-${firebaseUser.uid}`,
            goals: [],
            timeline: '2025-2026',
            resources: [],
            progress: 0,
            reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
          lastAssessment: new Date(),
        },
        emergencyCode: emergencyCode,
        accessLevel: 'emergency'
      };

      setUser(emergencyUser);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const validateFamilyCode = async (code: string): Promise<boolean> => {
    try {
      // Check against Firestore family codes collection
      const codesRef = doc(db, 'family_codes', code);
      const codeDoc = await getDoc(codesRef);

      if (!codeDoc.exists()) return false;

      const codeData = codeDoc.data();
      return codeData.active && (!codeData.expiresAt || codeData.expiresAt.toDate() > new Date());
    } catch (error) {
      console.error('Error validating family code:', error);
      return false;
    }
  };

  const validateEmergencyCode = async (code: string): Promise<boolean> => {
    try {
      // Check against Firestore emergency codes collection
      const codesRef = doc(db, 'emergency_codes', code);
      const codeDoc = await getDoc(codesRef);

      if (!codeDoc.exists()) return false;

      const codeData = codeDoc.data();
      return codeData.active && codeData.expiresAt.toDate() > new Date();
    } catch (error) {
      console.error('Error validating emergency code:', error);
      return false;
    }
  };

  const getAuthLayers = (): string[] => {
    const layers = ['primary']; // LifeCV SSO with family verification

    if (user?.familyCode) layers.push('family');
    if (user?.businessId) layers.push('business');
    if (user?.emergencyCode) layers.push('emergency');

    return layers;
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    const userDocRef = doc(db, 'users', user.id);
    await setDoc(userDocRef, updates, { merge: true });
    
    setUser(prevUser => ({
      ...prevUser!,
      ...updates,
    }));
  };

  useEffect(() => {
    console.log('🔍 Setting up auth state listener and redirect result handler...');
    
    // Handle redirect result from Google Sign-In
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          console.log('✅ User returned from Google redirect:', result.user.email);
          // The onAuthStateChanged listener below will process this user
        }
      })
      .catch((error) => {
        console.error('❌ Error getting redirect result:', error);
        if (error.code === 'auth/popup-closed-by-user') {
          console.log('ℹ️ User closed the sign-in popup');
        } else {
          alert('Sign-in redirect error: ' + error.message);
        }
      });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      debugLog('🔄 Auth state changed:', firebaseUser?.email || 'No user');
      console.log('🔄 Auth state changed:', firebaseUser?.email || 'No user');
      
      if (firebaseUser) {
        console.log('👤 Firebase user detected:', firebaseUser.email);
        console.log('📋 Checking against authorized emails:', AUTHORIZED_EMAILS);
        console.log('📋 Authorized emails list:', AUTHORIZED_EMAILS);
        
        const isAuth = isAuthorizedEmail(firebaseUser.email!);
        console.log('🔐 Authorization check result:', isAuth, 'for email:', firebaseUser.email);
        
        if (!isAuth) {
          debugLog('❌ User email not authorized:', firebaseUser.email);
          console.error('❌ User email not authorized:', firebaseUser.email);
          console.error('   Authorized list:', AUTHORIZED_EMAILS);
          console.error('   User tried email:', firebaseUser.email);
          await signOut(auth);
          setFirebaseUser(null);
          setUser(null);
          setLoading(false);
          alert('Your email (' + firebaseUser.email + ') is not authorized. Please contact the administrator.\n\nAuthorized emails: ' + AUTHORIZED_EMAILS.join(', '));
          return;
        }

        try {
          debugLog('✅ Email authorized, initializing user profile for:', firebaseUser.email);
          console.log('✅ Email authorized, initializing user profile for:', firebaseUser.email);
          console.log('📌 Firebase UID:', firebaseUser.uid);
          console.log('📌 Email verified:', firebaseUser.emailVerified);
          const userProfile = await initializeUserProfile(firebaseUser);
          debugLog('📝 User profile data:', userProfile);
          console.log('📝 User profile data:', userProfile);
          await updateLastLogin(firebaseUser.uid);
          setFirebaseUser(firebaseUser);
          setUser(userProfile);
          debugLog('✅ User profile initialized successfully');
          console.log('✅ User profile initialized successfully - user should be redirected to dashboard');
          setLoading(false);
        } catch (error: any) {
          console.error('❌ Error initializing user profile:', {
            message: error.message,
            code: error.code,
            stack: error.stack,
          });
          setFirebaseUser(null);
          setUser(null);
          setLoading(false);
        }
      } else {
        debugLog('👋 User signed out');
        console.log('👋 User signed out');
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    firebaseUser,
    loading,
    login,
    loginWithGoogle,
    loginWithFamilyCode,
    loginWithMNI,
    loginWithEmergencyCode,
    register,
    logout,
    updateUserProfile,
    validateFamilyCode,
    validateEmergencyCode,
    getAuthLayers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};