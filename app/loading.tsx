import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a]">
      <Image
        src="/assets/logo-icon.png"
        alt="Tunixo"
        width={60}
        height={60}
        className="h-16 w-16 animate-pulse mb-4"
      />
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#6366f1] border-t-transparent" />
      <p className="mt-4 text-sm text-gray-400">Chargement...</p>
    </div>
  );
}
