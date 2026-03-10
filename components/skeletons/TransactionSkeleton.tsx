import { Skeleton } from './SkeletonBase'

export default function TransactionSkeleton() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="space-y-2 text-right">
        <Skeleton className="ml-auto h-4 w-20" />
        <Skeleton className="ml-auto h-3 w-16" />
      </div>
    </div>
  )
}
