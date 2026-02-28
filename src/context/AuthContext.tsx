import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (token: string, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // <--- Bug yahan fix hoga

  useEffect(() => {
    // Firebase background mein check karega ki session zinda hai ya nahi
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Firestore se user ki baaki details (name, username) laao
          const docRef = doc(db, "profiles", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUser({ ...firebaseUser, ...docSnap.data() });
          } else {
            setUser(firebaseUser);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setUser(firebaseUser);
        }
      } else {
        setUser(null); // Koi logged in nahi hai
      }
      setLoading(false); // Checking poori ho gayi, loading band karo
    });

    return () => unsubscribe();
  }, []);

  const login = (token: string, userData: any) => {
    setUser(userData);
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };

  // Jab tak check chal raha hai, app ko wait karwao aur ek loader dikhao
  // (Is se refresh par user bahar nahi fenka jayega)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};