"use client";

import { testFrontendAPIs } from "@/lib/apiTests";
import { useState, useEffect } from "react";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";

export default function APITestPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          router.push("/");
          return;
        }

        // Fetch users list to check if current user is admin
        const response = await fetch("/api/users");
        const users = await response.json();

        const currentUserData = users.find(
          (u: any) => u.email === user.email
        );

        if (currentUserData?.role === "Admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          // Redirect non-admins
          router.push("/");
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        setIsAdmin(false);
        router.push("/");
      } finally {
        setAuthChecked(true);
      }
    };

    checkAdminAccess();
  }, [router]);

  const handleRunTests = async () => {
    setLoading(true);
    const testResults = await testFrontendAPIs();
    setResults(testResults);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3d1f0f] to-[#2a1508] p-8">
      <div className="max-w-4xl mx-auto">
        {!authChecked ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-white text-lg">⏳ Checking access...</p>
          </div>
        ) : !isAdmin ? (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-12 border border-white/20 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">🔐 Access Denied</h1>
            <p className="text-white/80 mb-6">
              This page is only accessible to administrators.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-[#847570] hover:bg-[#6B5D59] text-white font-bold rounded-lg transition-all"
            >
              ← Back to Home
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-white mb-8">🚀 Frontend API Tests</h1>

            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-white/20">
              <p className="text-white mb-6">
                Click the button below to run all frontend API integration tests
              </p>

              <button
                onClick={handleRunTests}
                disabled={loading}
                className="px-8 py-3 bg-[#847570] hover:bg-[#6B5D59] disabled:opacity-50 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                {loading ? "⏳ Running Tests..." : "▶️ Run API Tests"}
              </button>
            </div>

            {results && (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">📊 Test Results</h2>

                <div className="space-y-4">
                  {Object.entries(results).map(([testName, result]: [string, any]) => (
                    <div
                      key={testName}
                      className="bg-white/5 rounded-lg p-4 border-l-4 border-[#847570]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold">{testName}</h3>
                        <span
                          className={`px-3 py-1 rounded text-sm font-bold ${
                            result.status === "✅ PASSED"
                              ? "bg-green-500/30 text-green-300"
                              : "bg-red-500/30 text-red-300"
                          }`}
                        >
                          {result.status}
                        </span>
                      </div>

                      <pre className="bg-black/40 rounded p-3 text-xs text-green-400 overflow-x-auto max-h-64 overflow-y-auto">
                        {JSON.stringify(result.data || result.error, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">📈 Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/20 rounded p-4">
                      <p className="text-green-300 text-sm">Passed</p>
                      <p className="text-white text-2xl font-bold">
                        {Object.values(results).filter((r: any) => r.status === "✅ PASSED").length}
                      </p>
                    </div>
                    <div className="bg-red-500/20 rounded p-4">
                      <p className="text-red-300 text-sm">Failed</p>
                      <p className="text-white text-2xl font-bold">
                        {Object.values(results).filter((r: any) => r.status === "❌ FAILED").length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
