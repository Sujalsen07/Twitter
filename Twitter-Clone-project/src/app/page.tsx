'use client';

import Landing from "@/components/Landing";
import Mainlayout from "@/components/layout/Mainlayout";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function HomeContent() {
  const { user } = useAuth();

  return (
    <Mainlayout>
      <Landing />
      {/* Example usage of user */}
      {/* <p className="text-white">Welcome, {user ? user.name : "Guest"}</p> */} 
    </Mainlayout>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <HomeContent /> {/* ✅ useAuth() is now inside the provider */}
    </AuthProvider>
  );
}
