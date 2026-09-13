"use client";

import { ChevronDown } from "lucide-react";
import useDiplomas from "../_hooks/use-diplomas";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import Loading from "../loading";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import ErrorAlert from "@/app/(auth)/_components/error-alert";
import { DiplomaCardSkeleton } from "./diplomas-skeleton";
import { useContext } from "react";
import { ExamNameContext } from "@/components/providers/app/components/exam-name-context";

export default function Diplomas() {
  const {
    data: diplomas,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    error,
  } = useDiplomas();
  const { setDiplomaName } = useContext(ExamNameContext);

  if (error)
    return (
      <div className="mt-3 px-4">
        <ErrorAlert message={error?.message} />
      </div>
    );

  if (isLoading) {
    return (
      <div className="px-4 xl:px-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <DiplomaCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  const flatDiplomas =
    diplomas?.pages.flatMap((page) =>
      page?.status ? page?.payload?.data : [],
    ) || [];

  // save diploma title in local storage
  const saveDiplomaTitle = (title: string) =>
    localStorage.setItem("diploma-title", title);

  const handleDiplomaClick = (title: string) => {
    setDiplomaName(title);
  };

  return (
    <>
      <InfiniteScroll
        dataLength={flatDiplomas.length}
        next={() => fetchNextPage()}
        hasMore={!!hasNextPage}
        loader={null}
      >
        <section className="px-4 xl:px-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          {flatDiplomas.map((item) => (
            <Link
              onClick={() => handleDiplomaClick(item?.title)}
              key={item?.id}
              href={ROUTES.EXAMS_DIPLOMA?.replace(":id", item?.id)}
            >
              <figure className="relative w-full h-[448px] overflow-hidden">
                {item?.image ? (
                  <Image
                    quality={100}
                    src={item.image}
                    alt={item?.title || "Diploma Image"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover hover:scale-105 transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    {item?.title} exam
                  </div>
                )}

                <div className="max-h-64 overflow-auto absolute bottom-2 left-2 right-2 px-4 py-5 bg-blue-600/75 text-white backdrop-blur">
                  <h2 className="font-semibold">{item?.title}</h2>
                  <span>{item?.description}</span>
                </div>
              </figure>
            </Link>
          ))}
        </section>
        {hasNextPage === true ? (
          <div className="text-center py-4 flex flex-col items-center gap-2 text-gray-600">
            {<span>Scroll to view more</span>}
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </div>
        ) : (
          <p className="text-center text-sm lg:text-lg mt-8 text-gray-600 font-medium border-t pt-4">
            No more diplomas
          </p>
        )}
      </InfiniteScroll>
      {/* loader when fetch new data */}
      <div>{isFetching && hasNextPage && <Loading />}</div>
    </>
  );
}
