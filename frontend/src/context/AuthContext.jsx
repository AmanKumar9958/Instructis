import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { auth, db } from '../firebase/firebase'
import { hasRequiredRole, ROLES } from '../utils/roles'
import LoadingOverlay from '../components/LoadingOverlay'
import AuthContext from './AuthContextObject'

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [authActionLoading, setAuthActionLoading] = useState(false)
    const [authActionLabel, setAuthActionLabel] = useState('')

    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    const superAdminAllowList = (import.meta.env.VITE_SUPER_ADMIN_EMAILS || '')
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)

    const resolveRoleForUser = (requestedRole, email) => {
        if (requestedRole !== ROLES.SUPER_ADMIN) {
            return requestedRole
        }

        if (!email) {
            throw new Error('Super Admin access requires a valid email address.')
        }

        if (!superAdminAllowList.includes(email.toLowerCase())) {
            throw new Error('This account is not authorized for Super Admin access.')
        }

        return requestedRole
    }

    const mapFirebaseAuthError = (error) => {
        const errorCode = error?.code || ''

        if (errorCode === 'auth/configuration-not-found') {
            return 'Google sign-in is not configured in Firebase yet. Enable Google provider in Firebase Console > Authentication > Sign-in method.'
        }

        if (errorCode === 'auth/popup-closed-by-user') {
            return 'Sign-in popup was closed before completing login.'
        }

        if (errorCode === 'auth/popup-blocked') {
            return 'Popup was blocked by the browser. Please allow popups for this site and try again.'
        }

        if (errorCode === 'auth/unauthorized-domain') {
            return 'This domain is not authorized in Firebase Authentication. Add it under Authentication > Settings > Authorized domains.'
        }

        return error?.message || 'Sign in failed. Please try again.'
    }

    const syncProfile = async (firebaseUser) => {
        if (!firebaseUser) {
            setProfile(null)
            return null
        }

        const userRef = doc(db, 'users', firebaseUser.uid)
        const profileSnapshot = await getDoc(userRef)

        if (!profileSnapshot.exists()) {
            const fallbackProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email ?? '',
                displayName: firebaseUser.displayName ?? '',
                photoURL: firebaseUser.photoURL ?? '',
                role: ROLES.STUDENT,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            }

            await setDoc(userRef, fallbackProfile)
            setProfile({ ...fallbackProfile, role: ROLES.STUDENT })
            return { ...fallbackProfile, role: ROLES.STUDENT }
        }

        const existingProfile = profileSnapshot.data()
        setProfile(existingProfile)
        return existingProfile
    }

    const loginWithGoogle = async (selectedRole) => {
        if (!selectedRole) {
            throw new Error('Please select a role before signing in.')
        }

        try {
            setAuthActionLabel('Signing you in...')
            setAuthActionLoading(true)

            const result = await signInWithPopup(auth, provider)
            const firebaseUser = result.user
            const safeRole = resolveRoleForUser(selectedRole, firebaseUser.email)
            const userRef = doc(db, 'users', firebaseUser.uid)
            const profileSnapshot = await getDoc(userRef)

            if (!profileSnapshot.exists()) {
                const newProfile = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email ?? '',
                    displayName: firebaseUser.displayName ?? '',
                    photoURL: firebaseUser.photoURL ?? '',
                    role: safeRole,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }

                await setDoc(userRef, newProfile)
                setProfile({ ...newProfile, role: safeRole })
                setUser(firebaseUser)
                return { user: firebaseUser, profile: { ...newProfile, role: safeRole } }
            }

            const existingProfile = profileSnapshot.data()
            const resolvedRole = existingProfile.role ?? selectedRole

            if (!existingProfile.role) {
                await setDoc(
                    userRef,
                    {
                        role: safeRole,
                        updatedAt: serverTimestamp(),
                    },
                    { merge: true }
                )
            }

            const mergedProfile = { ...existingProfile, role: resolvedRole }
            setProfile(mergedProfile)
            setUser(firebaseUser)

            return { user: firebaseUser, profile: mergedProfile }
        } catch (error) {
            if (error instanceof Error && !error?.code) {
                throw error
            }

            throw new Error(mapFirebaseAuthError(error))
        } finally {
            setAuthActionLoading(false)
            setAuthActionLabel('')
        }
    }

    const logout = async () => {
        try {
            setAuthActionLabel('Signing you out...')
            setAuthActionLoading(true)
            await signOut(auth)
            setProfile(null)
            setUser(null)
        } finally {
            setAuthActionLoading(false)
            setAuthActionLabel('')
        }
    }

    const userRole = profile?.role ?? null

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser)

            if (currentUser) {
                await syncProfile(currentUser)
            } else {
                setProfile(null)
            }

            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const value = {
        user,
        profile,
        role: userRole,
        isSuperAdmin: userRole === ROLES.SUPER_ADMIN,
        hasRole: (allowedRoles) => hasRequiredRole(userRole, allowedRoles),
        loginWithGoogle,
        logout,
        loading,
        authActionLoading,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
            <LoadingOverlay
                isOpen={loading || authActionLoading}
                label={loading ? 'Preparing your session...' : authActionLabel || 'Please wait...'}
            />
        </AuthContext.Provider>
    )
}