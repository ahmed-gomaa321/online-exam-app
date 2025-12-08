"use client";

import { ChevronDown } from "lucide-react";
import useDiplomas from "../_hooks/use-diplomas";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import Loading from "../loading";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

export default function Diplomas() {
  const {
    data: diplomas,
    isLoading,
    fetchNextPage,
    hasNextPage,
    error,
  } = useDiplomas();

  if (error)
    return (
      <p className="bg-red-50 p-4 mt-4 text-red-600 font-medium">
        Error: {error.message}
      </p>
    );

  if (isLoading) return Loading();

  const flatDiplomas = diplomas?.pages.flatMap((page) => page.subjects) || [];

  // save diploma title in local storage
  const saveDiplomaTitle = (title: string) =>
    localStorage.setItem("diploma-title", title);

  return (
    <InfiniteScroll
      dataLength={flatDiplomas.length}
      next={() => fetchNextPage()}
      hasMore={!!hasNextPage}
      loader={Loading()}
    >
      <section className="px-4 xl:px-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
        {flatDiplomas.map((item) => (
          <Link
            onClick={() => saveDiplomaTitle(item.name)}
            key={item._id}
            href={ROUTES.EXAMS}
          >
            <figure className="relative w-full h-[448px] overflow-hidden">
              <Image
                quality={80}
                src={item.icon}
                alt={item.name}
                fill
                className="object-cover hover:scale-105 transition-all duration-300"
              />
              <div className="absolute bottom-2 left-2 right-2 px-4 py-5 bg-blue-600/50 text-white backdrop-blur">
                <span>{item.name}</span>
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
  );
}
