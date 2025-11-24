'use client';

import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, Home, Sparkles } from "lucide-react";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await signOut(auth);
        setMessage({ text: "Please verify your email. Check your inbox (and spam).", type: "error" });
        return;
      }

      setMessage({ text: "Welcome back! Redirecting...", type: "success" });
      setTimeout(() => router.push("/main/map"), 1200);
    } catch (error: any) {
      const msg = error.code === "auth/user-not-found"
        ? "No account found with this email."
        : error.code === "auth/wrong-password"
        ? "Incorrect password."
        : error.code === "auth/invalid-email"
        ? "Invalid email address."
        : error.message || "Sign in failed. Try again.";

      setMessage({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setMessage({ text: "Enter your email first.", type: "error" });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({ text: "Password reset email sent! Check your inbox.", type: "success" });
    } catch {
      setMessage({ text: "Failed to send reset email.", type: "error" });
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
        <p className="text-[#4E2A17] mt-2 font-['Roboto']">Sign in to track your favorite campus cats</p>
      </div>

      {/* CARD: #4E2A17 */}
      <div className="bg-[#4E2A17] backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 group-focus-within:text-[#E2C3A7] transition-colors" />
              <input
                type="email"
                placeholder="UTA Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#E2C3A7] focus:border-[#E2C3A7] transition-all font-['Roboto']"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 group-focus-within:text-[#E2C3A7] transition-colors" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#E2C3A7] focus:border-[#E2C3A7] transition-all font-['Roboto']"
                required
              />
            </div>
          </div>

          {message && (
            <div className={`text-center text-sm font-medium p-3 rounded-lg ${
              message.type === "success" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
            }`}>
              {message.text}
            </div>
          )}

          {/* BUTTON: White bg, dark text */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-gray-100 text-[#4E2A17] font-bold text-lg h-12 rounded-xl shadow-lg hover:shadow-white/50 transition-all"
          >
            {loading ? "Signing In..." : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </>
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-sm text-white/70 hover:text-[#E2C3A7] transition-colors font-['Roboto']"
            >
              Forgot password?
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-center text-white/70 text-sm font-['Roboto']">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#E2C3A7] hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>

        <ButtonGroup className="mt-6">
          <Button
            asChild
            variant="outline"
            className="flex-1 border-white/30 text-white hover:bg-white hover:text-[#4E2A17] bg-[#4E2A17]/70"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
        </ButtonGroup>
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
}