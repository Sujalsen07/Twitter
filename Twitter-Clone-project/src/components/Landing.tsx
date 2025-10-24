"use client";
import React, { useState } from "react";
import Twitterlogo from "./Twitterlogo";
import { FcGoogle } from "react-icons/fc";
import { Apple } from "lucide-react";
import { Button } from "./ui/button";
import Authmodel from "./Authmodel"; // Make sure this file exists (and is named exactly like this)
import { useAuth } from "@/context/AuthContext";
import Feed from "./Feed";

const Landing = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
    const { user, logout, googlesignin } = useAuth();
  
  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };
  if(user){
    return <Feed/>
  }
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white">
      {/* Left Side — Twitter Logo */}
      <div className="hidden lg:flex flex-1 items-center justify-center">
        <Twitterlogo className="h-80 w-80 text-white" />
      </div>

      {/* Right Side — Content */}
      <div className="flex flex-1 flex-col justify-center p-8 text-center lg:text-left">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">Happening now</h1>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8">Join today.</h2>

        {/* Sign-Up Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-sm mx-auto lg:mx-0">
          {/* Google */}
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition"
            onClick={() => googlesignin()}
          >
            <FcGoogle size={20} />
            Sign up with Google
          </Button>

          {/* Apple */}
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition"
           onClick={() => googlesignin()}
          >
            <Apple size={20} className="text-black" />
            Sign up with Apple
          </Button>

          {/* OR Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-600" />
            <span className="mx-3 text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-600" />
          </div>

          {/* Create Account */}
          <Button
            className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-semibold rounded-full py-3 transition"
            onClick={() => openAuthModal("signup")}
          >
            Create account
          </Button>

          {/* Terms */}
          <p className="text-gray-500 text-xs leading-5 mt-2">
            By signing up, you agree to the{" "}
            <a href="#" className="text-[#1d9bf0] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#1d9bf0] hover:underline">
              Privacy Policy
            </a>
            , including{" "}
            <a href="#" className="text-[#1d9bf0] hover:underline">
              Cookie Use
            </a>
            .
          </p>
        </div>

        {/* Already have an account */}
        <div className="mt-10 w-full max-w-sm mx-auto lg:mx-0 flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
          <h3 className="text-lg font-semibold text-white whitespace-nowrap">
            Already have an account?
          </h3>
          <Button
            variant="outline"
            className="bg-white text-black border border-gray-500 font-semibold rounded-full hover:bg-gray-200 transition w-full sm:w-auto"
            onClick={() => openAuthModal("login")}
          >
            Log in
          </Button>
        </div>
      </div>

      {/* Auth Modal */}
      <Authmodel
  isOpen={showAuthModal} 
  onClose={() => setShowAuthModal(false)} 
  initialMode={authMode}
/>

    </div>
  );
};

export default Landing;
