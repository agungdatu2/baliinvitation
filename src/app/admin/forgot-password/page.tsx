"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mengirim email");
      }
      setDone(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-lume-line p-8 shadow-sm">
        <p className="font-serif text-xl text-lume-ink mb-1">BaliInvitation</p>
        <p className="text-sm text-gray-400 mb-6">Lupa password admin</p>

        {done ? (
          <p className="text-sm text-gray-600 bg-gray-50 border border-lume-line rounded-md px-3 py-3">
            Kalau email itu terdaftar, link reset password sudah dikirim. Cek inbox (dan folder spam).
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
            )}
            <label className="block text-sm text-gray-600 mb-1.5">Email</label>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input mb-6"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md bg-lume-ink text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Mengirim..." : "Kirim Link Reset"}
            </button>
          </form>
        )}

        <Link href="/admin/k7xq2m9pv3" className="block text-center text-sm text-gray-400 mt-6 hover:text-lume-ink">
          Kembali ke login
        </Link>
      </div>
    </div>
  );
}
