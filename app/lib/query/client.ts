import { QueryClient } from "@tanstack/react-query";
import { isDev } from "@/app/config/env";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,

      ...(isDev && {
        onError: (error: any) => {
          console.error("Query Error:", error);
        },
      }),
    },
  },
});
