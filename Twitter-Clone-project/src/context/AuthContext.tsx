"use client";

import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import axios from "axios";

export interface User {
  _id?: string;
  username: string;
  displayName: string;
  avatar: string;
  banner?: string;
  email?: string;
  bio?: string;
  joinedDate?: string;
  location?: string;
  website?: string;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  checkedAuth: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    username: string,
    displayName: string,
    email: string,
    password: string
  ) => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<User | null>;
  logout: () => Promise<void>;
  isLoading: boolean;
  googlesignin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkedAuth, setCheckedAuth] = useState(false);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  // -------------------------------
  // Listen for Firebase auth state
  // -------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser?.email) {
        setUser(null);
        setIsLoading(false);
        setCheckedAuth(true);
        localStorage.removeItem("twiller-user");
        return;
      }

      try {
        const res = await axiosInstance.get("/loggedinuser", {
          params: { email: firebaseUser.email },
        });
        const backendUser: User = res.data.user || res.data;
        setUser(backendUser);
        localStorage.setItem("twiller-user", JSON.stringify(backendUser));
      } catch (err) {
        setUser(null);
        localStorage.removeItem("twiller-user");
      } finally {
        setIsLoading(false);
        setCheckedAuth(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // -------------------------------
  // Login
  // -------------------------------
  const login = async (email: string, password: string) => {
    if (!email || !password)
      throw new Error("Email and password are required");
    setIsLoading(true);
    try {
      const usercred = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = usercred.user;
      if (!firebaseUser?.email)
        throw new Error("No email found on Firebase user");

      const res = await axiosInstance.get("/loggedinuser", {
        params: { email: firebaseUser.email },
      });
      const backendUser: User = res.data.user || res.data;
      setUser(backendUser);
      localStorage.setItem("twiller-user", JSON.stringify(backendUser));
    } catch (error: any) {
      console.error("Login error:", error.response?.data?.message || error.message);
      throw new Error(
        error.response?.data?.message || error.message || "Login failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------
  // Signup
  // -------------------------------
  const signup = async (
    username: string,
    displayName: string,
    email: string,
    password: string
  ) => {
    if (!username || !displayName || !email || !password) {
      throw new Error("All fields are required");
    }
    setIsLoading(true);
    try {
      const usercred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = usercred.user;

      const payload = {
        username,
        displayName,
        email: firebaseUser.email || email,
        avatar: firebaseUser.photoURL || "",
        banner: "",
        bio: "",
        location: "",
        website: "",
        password,
        provider: "local",
      };

      const res = await axiosInstance.post("/register", payload);
      const createdUser: User = res.data.user || res.data;
      setUser(createdUser);
      localStorage.setItem("twiller-user", JSON.stringify(createdUser));
    } catch (error: any) {
      console.error("Signup error:", error.response?.data?.message || error.message);
      throw new Error(
        error.response?.data?.message || error.message || "Signup failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------
  // ✅ Fixed Google Sign-in
  // -------------------------------
  const googlesignin = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      if (!firebaseUser?.email)
        throw new Error("No email found on Google user");

      // ✅ Always send to backend /register
      const payload = {
        username: firebaseUser.email.split("@")[0],
        displayName: firebaseUser.displayName || "User",
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL || "",
        provider: "google",
      };

      const res = await axiosInstance.post("/register", payload);
      const userData = res.data.user || res.data;

      setUser(userData);
      localStorage.setItem("twiller-user", JSON.stringify(userData));
    } catch (error: any) {
      console.error(
        "Google sign-in error:",
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message || error.message || "Google Sign-in failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------
  // Logout
  // -------------------------------
  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("twiller-user");
    } catch (error: any) {
      console.error("Logout error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------
  // Update profile
  // -------------------------------
  const updateProfile = async (
    profileData: Partial<User>
  ): Promise<User | null> => {
    if (!user?._id) return null;
    setIsLoading(true);
    try {
      const res = await axiosInstance.patch(
        `/updateuser/${user._id}`,
        profileData
      );
      const updatedUser: User = res.data.user || res.data;
      setUser(updatedUser);
      localStorage.setItem("twiller-user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error("Update profile error:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        checkedAuth,
        login,
        signup,
        logout,
        updateProfile,
        isLoading,
        googlesignin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
