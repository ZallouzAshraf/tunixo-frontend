"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    // Log to console in dev
    if (isDev) {
      console.error(error);
    }
  }, [error, isDev]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4">
      <Image
        src="/assets/logo.png"
        alt="Tunixo"
        width={120}
        height={32}
        className="h-8 w-auto mb-8"
      />
      <h1 className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-8xl font-black text-transparent">
        500
      </h1>
      <h2 className="mt-4 text-2xl font-bold text-white">
        Une erreur est survenue
      </h2>
      {isDev && error?.message && (
        <code className="mt-4 block max-w-lg rounded-lg bg-red-500/10 px-3 py-2 text-left text-sm text-red-400">
          {error.message}
        </code>
      )}
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
        >
          Réessayer
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5"
        >
          Accueil
        </button>
      </div>
    </div>
  );
}
