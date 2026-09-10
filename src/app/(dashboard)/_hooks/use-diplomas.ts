"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getDiplomas } from "@/lib/services/diplomas.service";
import { DiplomasPayload } from "@/lib/types/diplomas";

export default function useDiplomas() {
  return useInfiniteQuery<ApiResponse<DiplomasPayload>, Error>({
    queryKey: ["diplomas"],
    queryFn: ({ pageParam = 1 }) => getDiplomas({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.status) return undefined;
      const { page, totalPages } = lastPage?.payload?.metadata;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}
