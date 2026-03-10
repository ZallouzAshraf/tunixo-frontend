import { Skeleton } from './SkeletonBase'

export default function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 p-6">
      <div className="mb-4 flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="mb-2 h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}
