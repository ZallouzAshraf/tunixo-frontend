import { Skeleton } from './SkeletonBase'

interface TableSkeletonProps {
  rows?: number
  cols?: number
}

export default function TableSkeleton({ rows = 5, cols = 5 }: TableSkeletonProps) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <div className="flex gap-4 border-b border-white/10 p-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1 min-w-[60px]" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1 min-w-[60px]" />
          ))}
        </div>
      ))}
    </div>
  )
}
