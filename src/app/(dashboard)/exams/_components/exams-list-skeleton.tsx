export default function ExamsListSkeleton() {
  return (
    <section className="bg-white px-6 flex flex-col gap-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="p-4 flex items-center gap-4 bg-slate-200 rounded-lg"
        >
          {/* Skeleton Image */}
          <div className="w-[100px] h-[100px] bg-slate-100 rounded-md shrink-0" />

          <div className="flex flex-col gap-3 flex-1 mb-auto">
            {/* Skeleton Header Row (Title & Badges) */}
            <div className="flex items-center justify-between">
              <div className="h-5 bg-slate-100 rounded-md w-1/3" />
              <div className="flex items-center space-x-2">
                <div className="h-4 bg-slate-100 rounded-md w-16" />
                <div className="h-4 bg-slate-100 rounded-md w-16" />
              </div>
            </div>

            {/* Skeleton Description Lines */}
            <div className="flex flex-col gap-2">
              <div className="h-3.5 bg-slate-100 rounded-md w-full" />
              <div className="h-3.5 bg-slate-100 rounded-md w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
