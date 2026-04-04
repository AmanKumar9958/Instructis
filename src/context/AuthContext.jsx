import { useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firebase/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { AuthContext } from './AuthContextObject';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // We defer role fetching for standard users here. 
        // SuperAdmin might not be in Firebase Auth or could be stubbed locally.
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setRole(userData.role);
          setUser({ ...currentUser, ...userData });
          
          // Update lastLogin
          await updateDoc(userDocRef, {
            lastLogin: serverTimestamp() // the assignment asks to store last login
          });
        } else {
          setUser(currentUser);
        }
      } else {
        // If not logged in, wait, there's a possibility of local SuperAdmin. We check session separately if needed.
        // For standard flow, just wipe state.
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (selectedRole) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedInUser = result.user;
      
      const userRef = doc(db, 'users', loggedInUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        const newUser = {
          name: loggedInUser.displayName || 'Unknown',
          email: loggedInUser.email,
          profile_url: loggedInUser.photoURL || '',
          accountCreatedAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          coursesEnrolled: [],
          role: selectedRole
        };
        await setDoc(userRef, newUser);
        setRole(selectedRole);
        setUser({ ...loggedInUser, ...newUser });
      } else {
        const userData = userDoc.data();
        setRole(userData.role);
        setUser({ ...loggedInUser, ...userData });
      }
    } catch (error) {
      console.error("Google Auth Error", error);
      throw error;
    }
  };

  const loginSuperAdmin = async (email, password) => {
    const adminEmail = import.meta.env.VITE_SUPER_ADMIN_ID;
    const adminPass = import.meta.env.VITE_SUPER_ADMIN_PASS;
    
    if (email === adminEmail && password === adminPass) {
       // Since SuperAdmin sits outside standard Firebase Auth in this spec, we manage state manually.
       // Note: reloading page will detach SuperAdmin because it's not saved in localStorage in this basic setup.
       const adminMock = {
         uid: 'super_admin_id',
         displayName: "Super Admin",
         email: adminEmail,
         profile_url: "",
         role: 'SuperAdmin'
       };
       setUser(adminMock);
       setRole('SuperAdmin');
       return true;
    } else {
       throw new Error("Invalid SuperAdmin Credentials");
    }
  };

  const logout = async () => {
     if (role !== 'SuperAdmin') {
       await signOut(auth);
     }
     setUser(null);
     setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginWithGoogle, loginSuperAdmin, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};