'use client';

import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "@/config/firebase";
import { Button } from "./ui/button";
import Link from "next/link";
import { Mail, Lock, UserPlus, CheckCircle, AlertCircle, Sparkles, Home } from "lucide-react";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const validateEmail = (email: string) => email.endsWith("@mavs.uta.edu");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setMessage({ text: "Please use your @mavs.uta.edu email.", type: "error" });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" });
      return;
    }

    if (password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);

      setMessage({
        text: "Account created! Check your UTA email for verification link.",
        type: "success"
      });

      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const msg = error.code === "auth/email-already-in-use"
        ? "An account with this email already exists."
        : error.code === "auth/weak-password"
        ? "Password is too weak."
        : error.message || "Sign up failed.";

      setMessage({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 animate-fade-in">
          <div className="relative">
            <Sparkles className="w-10 h-10 text-[#E2C3A7] animate-pulse" />
            <div className="absolute inset-0 bg-[#E2C3A7] blur-xl opacity-50 animate-ping" />
          </div>
          <h1 className="text-4xl font-bold font-['Poppins']">Meowvrick</h1>
        </div>
        <p className="text-[#4E2A17] mt-2 font-['Roboto']">Join the campus cat community</p>
      </div>

      {/* CARD: #4E2A17 */}
      <div className="bg-[#4E2A17] backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 group-focus-within:text-[#E2C3A7] transition-colors" />
              <input
                type="email"
                placeholder="your.name@mavs.uta.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#E2C3A7] focus:border-[#E2C3A7] transition-all font-['Roboto']"
                required
              />
              {email && !validateEmail(email) && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
              )}
              {email && validateEmail(email) && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
              )}
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 group-focus-within:text-[#E2C3A7] transition-colors" />
              <input
                type="password"
                placeholder="Password (6+ chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#E2C3A7] focus:border-[#E2C3A7] transition-all font-['Roboto']"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 group-focus-within:text-[#E2C3A7] transition-colors" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#E2C3A7] focus:border-[#E2C3A7] transition-all font-['Roboto']"
                required
              />
            </div>
          </div>

          {message && (
            <div className={`text-center text-sm font-medium p-3 rounded-lg flex items-center justify-center gap-2 ${
              message.type === "success" ? "bg-green-500/20 text-green-300" :
              message.type === "error" ? "bg-red-500/20 text-red-300" :
              "bg-blue-500/20 text-blue-300"
            }`}>
              {message.type === "success" && <CheckCircle className="w-4 h-4" />}
              {message.type === "error" && <AlertCircle className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          {/* BUTTON: White bg, dark text */}
          <Button
            type="submit"
            disabled={loading || !validateEmail(email) || password.length < 6}
            className="w-full bg-white hover:bg-gray-100 text-[#4E2A17] font-bold text-lg h-12 rounded-xl shadow-lg hover:shadow-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-white/70 text-sm font-['Roboto']">
            Already have an account?{" "}
            <Link href="/signin" className="text-[#E2C3A7] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <Button
            asChild
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white hover:text-[#4E2A17] bg-[#4E2A17]/70"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.8s ease-out; }
      `}</style>
    </div>
  );
};