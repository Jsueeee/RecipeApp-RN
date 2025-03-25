import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,

      ...(process.env.EXPO_PUBLIC_ENV === "dev" && {
        onError: (error: any) => {
          console.error("Query Error:", error);
        },
      }),
    },
  },
});
