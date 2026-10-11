"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, RefreshCw, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Container } from "@/components/Container";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Successful login: session cookie is set via HttpOnly header
        router.push(redirectTo);
        router.refresh();
      } else {
        setError(data.error || "Invalid username or password.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E7E2DA] p-8 sm:p-10 shadow-xl shadow-stone-200/50">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#3B563D]/10 border border-[#3B563D]/20 flex items-center justify-center text-[#3B563D] mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#1C1917] tracking-tight">
          FLASH<span className="text-[#3B563D]">.Ai</span> Staff Portal
        </h1>
        <p className="text-xs font-mono uppercase tracking-wider text-[#6E685F] mt-1.5">
          Restricted Administrative Access
        </p>
        <p className="text-xs text-[#6E685F] mt-1">
          Authorized personnel only. All access attempts are verified.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#6E685F] mb-1.5 font-semibold">
            Admin Username
          </label>
          <input
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            className="w-full px-4 py-3 rounded-xl border border-[#E7E2DA] bg-[#FDFBF7] text-[#1C1917] placeholder-[#6E685F]/50 focus:outline-none focus:ring-2 focus:ring-[#3B563D] focus:border-transparent transition-all text-sm font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#6E685F] mb-1.5 font-semibold">
            Admin Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 pr-11 rounded-xl border border-[#E7E2DA] bg-[#FDFBF7] text-[#1C1917] placeholder-[#6E685F]/50 focus:outline-none focus:ring-2 focus:ring-[#3B563D] focus:border-transparent transition-all text-sm font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6E685F] hover:text-[#1C1917] transition-colors"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#3B563D] text-[#FDFBF7] font-medium text-sm hover:bg-[#324933] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Sign In to Dashboard</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-[#E7E2DA] text-center">
        <Link
          href="/"
          className="text-xs font-mono text-[#6E685F] hover:text-[#3B563D] transition-colors"
        >
          &larr; Return to Agency Home
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
      <Container className="max-w-md">
        <Suspense fallback={<div className="text-center text-xs text-[#6E685F]">Loading portal...</div>}>
          <AdminLoginForm />
        </Suspense>
      </Container>
    </main>
  );
}
