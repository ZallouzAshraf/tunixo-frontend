"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute right-1/4 top-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <Image
          src="/assets/logo.png"
          alt="Tunixo"
          width={120}
          height={32}
          className="h-8 w-auto mb-8"
        />
        <h1 className="bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-8xl font-black text-transparent">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-bold text-white">Page introuvable</h2>
        <p className="mx-auto mt-2 max-w-md text-gray-400">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            ← Retour
          </button>
          <Link
            href="/"
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
