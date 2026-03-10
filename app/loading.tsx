export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a]">
      <p className="mb-4 text-xl font-bold text-[#6366f1]">Tunixo</p>
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#6366f1] border-t-transparent" />
      <p className="mt-4 text-sm text-gray-400">Chargement...</p>
    </div>
  )
}
