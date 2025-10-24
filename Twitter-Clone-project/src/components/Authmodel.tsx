import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { User, X } from "lucide-react"; // removed Google
import { Button } from "./ui/button";
import Twitterlogo from "./Twitterlogo";
import { useAuth } from "@/context/AuthContext";

const Authmodel = ({ isOpen, onClose, initialMode = "login" }: any) => {
  const { isLoading, login, signup, googlesignin } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    displayName: "",
  });
  const [error, setError] = useState<{ message?: string; [key: string]: any }>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email address.";

    if (!formData.password.trim()) newErrors.password = "Password is required.";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters long.";

    if (mode === "signup") {
      if (!formData.displayName.trim()) newErrors.displayName = "Display name is required.";
      if (!formData.username.trim()) newErrors.username = "Username is required.";
      else if (!/^[a-zA-Z0-9_]{3,15}$/.test(formData.username))
        newErrors.username = "Username must be 3–15 characters (letters, numbers, underscores).";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    try {
      if (mode === "login") await login(formData.email, formData.password);
      else await signup(
  formData.username,       // username
  formData.displayName,    // displayName
  formData.email,          // email
  formData.password        // password
);

    } catch (err: any) {
      setError({ message: err.message || "Authentication failed. Please try again." });
      return;
    }

    setError({});
    setFormData({ email: "", password: "", username: "", displayName: "" });
    onClose();
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    try {
      await googlesignin();
      onClose();
    } catch (err: any) {
      setError({ message: err.message || "Google sign-in failed" });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error[field]) setError((prev) => ({ ...prev, [field]: undefined }));
  };

  const switchMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setError({});
    setFormData({ email: "", password: "", username: "", displayName: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="relative w-full max-w-md bg-black text-white border border-gray-800 rounded-2xl shadow-2xl p-6 animate-fade-in">
        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </Button>

        <CardHeader className="flex flex-col items-center space-y-4 mt-6">
          <Twitterlogo className="h-10 w-10 text-[#1d9bf0] mx-auto" />
          <CardTitle className="text-2xl font-bold text-center">
            {mode === "login" ? "Sign in to X" : "Create your account"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {error.message && (
            <div className="bg-red-500 text-white text-center py-2 px-4 rounded mb-4">
              {error.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <>
                <div className="flex flex-col">
                  <label htmlFor="displayName" className="mb-1 font-medium">Display Name</label>
                  <div className="flex items-center gap-2">
                    <User className="text-gray-400" />
                    <input
                      id="displayName"
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => handleInputChange("displayName", e.target.value)}
                      className={`w-full px-3 py-2 rounded bg-gray-900 text-white border ${
                        error.displayName ? "border-red-500" : "border-gray-700"
                      } focus:outline-none focus:border-[#1d9bf0]`}
                    />
                  </div>
                  {error.displayName && <p className="text-red-500 text-sm mt-1">{error.displayName}</p>}
                </div>

                <div className="flex flex-col">
                  <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={`w-full px-3 py-2 rounded bg-gray-900 text-white border ${
                      error.username ? "border-red-500" : "border-gray-700"
                    } focus:outline-none focus:border-[#1d9bf0]`}
                  />
                  {error.username && <p className="text-red-500 text-sm mt-1">{error.username}</p>}
                </div>
              </>
            )}

            <div className="flex flex-col">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-3 py-2 rounded bg-gray-900 text-white border ${
                  error.email ? "border-red-500" : "border-gray-700"
                } focus:outline-none focus:border-[#1d9bf0]`}
              />
              {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
            </div>

            <div className="relative flex flex-col">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full px-3 py-2 rounded bg-gray-900 text-white border ${
                  error.password ? "border-red-500" : "border-gray-700"
                } focus:outline-none focus:border-[#1d9bf0]`}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-sm text-[#1d9bf0] hover:underline"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
            </div>

            <Button
              type="submit"
              className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-semibold rounded-full py-3 transition"
            >
              {mode === "login" ? "Log in" : "Sign up"}
            </Button>

            {/* Google Sign-In with SVG */}
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              className="bg-white text-black flex items-center justify-center gap-2 rounded-full py-2 hover:bg-gray-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
                <path fill="#4285f4" d="M533.5 278.4c0-18.3-1.5-36-4.3-53.3H272v100.8h146.9c-6.4 34-25.6 62.8-54.8 82.2v68.3h88.7c51.8-47.7 81.7-118 81.7-197.9z"/>
                <path fill="#34a853" d="M272 544.3c73.6 0 135.4-24.4 180.5-66.4l-88.7-68.3c-24.7 16.6-56.2 26.3-91.8 26.3-70.6 0-130.5-47.7-151.9-111.8H30.9v70.5C75.6 484.5 168.4 544.3 272 544.3z"/>
                <path fill="#fbbc04" d="M120.1 318.9c-6.6-19.4-10.4-40-10.4-61s3.8-41.6 10.4-61v-70.5H30.9C11.1 173.2 0 223 0 256s11.1 82.8 30.9 108.6l89.2-70.5z"/>
                <path fill="#ea4335" d="M272 107.7c39.9 0 75.6 13.7 103.9 40.8l77.8-77.8C405.4 24.4 343.6 0 272 0 168.4 0 75.6 59.8 30.9 148.3l89.2 70.5c21.4-64.1 81.3-111.1 151.9-111.1z"/>
              </svg>
              Continue with Google
            </Button>

            <p className="text-gray-400 text-sm text-center mt-2">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={switchMode}
                className="text-[#1d9bf0] hover:underline font-medium"
              >
                {mode === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Authmodel;
