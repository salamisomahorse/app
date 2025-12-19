import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { mockAuth, onAuthStateChanged, MockUser } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// FIX: Export AuthContext so it can be imported by other modules, such as `hooks/useAuth.ts`.
export const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch user profile from Firestore here
    const unsubscribe = onAuthStateChanged((firebaseUser: MockUser | null) => {
      if (firebaseUser) {
        // This is where you would fetch the user document from Firestore
        // For now, we'll use the mock role from the mock user object
        const userProfile: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          fullName: firebaseUser.displayName || "User",
          phone: "+2348012345678", // Mock data
          role: firebaseUser.role || 'client',
          createdAt: new Date(), // Mock data
        };
        setUser(userProfile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);