"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Konfirmasi password tidak sama");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal reset password");
      }
      setDone(true);
      setTimeout(() => router.push("/admin/login"), 2000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
        Link tidak valid — token tidak ditemukan.
      </p>
    );
  }

  if (done) {
    return (
      <p className="text-sm text-gray-600 bg-gray-50 border border-lume-line rounded-md px-3 py-3">
        Password berhasil diganti. Mengarahkan ke halaman login...
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
      )}
      <label className="block text-sm text-gray-600 mb-1.5">Password Baru</label>
      <input
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input mb-4"
      />
      <label className="block text-sm text-gray-600 mb-1.5">Konfirmasi Password</label>
      <input
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="input mb-6"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-md bg-lume-ink text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : "Simpan Password Baru"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-lume-line p-8 shadow-sm">
        <p className="font-serif text-xl text-lume-ink mb-1">BaliInvitation</p>
        <p className="text-sm text-gray-400 mb-6">Atur password baru</p>
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
        <Link href="/admin/login" className="block text-center text-sm text-gray-400 mt-6 hover:text-lume-ink">
          Kembali ke login
        </Link>
      </div>
    </div>
  );
}
