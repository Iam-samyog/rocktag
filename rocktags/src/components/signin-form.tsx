"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      if(!auth.currentUser?.emailVerified) {
        setMessage("Email not verified. Please check your inbox for a verification email.");
        await signOut(auth);
        return;
      }
      else {
        // Set auth token in cookie for server-side verification
        const token = await auth.currentUser.getIdToken();
        document.cookie = `firebase-auth-token=${token}; path=/; secure; samesite=strict; max-age=3600`;
        
        setMessage("Signed in successfully!");
        setEmail("");
        setPassword("");
        // Navigate to main area after successful signin
        setTimeout(() => {
          router.push("/main/map");
        }, 1);
      }

    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Please enter your email address first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Failed to send reset email");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="w-full max-w-md bg-background/40 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome Back
          </h2>
          <p className="text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSignin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              />
            </div>
          </div>

          {message && (
            <div className={`text-center text-sm ${
              message.includes("successfully") ? "text-green-600" : "text-red-600"
            }`}>
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={handleResetPassword}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Forgot Password?
            </Button>
          </div>

          <div className="text-center pt-4">
            <Button asChild variant="outline" className="border-border hover:bg-accent/50">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
