"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getDiplomas } from "@/lib/services/diplomas.service";
import { DiplomasResponse } from "@/lib/types/diplomas";

export default function useDiplomas() {
  return useInfiniteQuery<DiplomasResponse, Error>({
    queryKey: ["diplomas"],
    queryFn: ({ pageParam = 1 }) => getDiplomas({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.metadata.currentPage < lastPage.metadata.numberOfPages) {
        return lastPage.metadata.currentPage + 1;
      }
      return undefined;
    },
  });
}
