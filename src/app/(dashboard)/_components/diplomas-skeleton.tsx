import { Skeleton } from "@/components/ui/skeleton";

export function DiplomaCardSkeleton() {
  return (
    <div className="w-full h-[448px] bg-slate-200  rounded-0 p-4 flex flex-col justify-end gap-3 animate-pulse">
      {/* Simulated Title Skeleton */}
      <Skeleton className="h-3 w-full rounded-0 bg-slate-300" />

      {/* Simulated Description Paragraph Skeletons */}
      <div className="space-y-2 w-full">
        <Skeleton className="h-6 w-full bg-slate-300" />
      </div>
    </div>
  );
}
