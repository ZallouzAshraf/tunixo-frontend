import { Skeleton } from './SkeletonBase'

export default function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <Skeleton className="h-28 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-16 rounded-full" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}
