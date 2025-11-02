import { queryClient } from "@/app/lib/query/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { authStorage } from "@/app/lib/storage/auth";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

/**
 * AppleAuthentication.signOutAsync(options)
 * It is not recommended to use this method to sign out the user as it works counterintuitively.
 * Instead of using this method it is recommended to simply clear all the user's data collected from using signInAsync or refreshAsync methods.
 */
export const useAppleLogoutMutation = () => {
  const appleLogoutMutation = useMutation({
    mutationKey: QUERY_KEYS.AUTH.APPLE(),
    mutationFn: async () => {
      try {
        await queryClient.resetQueries({
          queryKey: QUERY_KEYS.AUTH.APPLE(),
        });

        await authStorage.clear();
      } catch (error) {
        console.warn("Logout API failed", error);
      }
    },
    onSuccess: () => {
      router.dismissAll();
      router.replace("/(auth)");
    },
  });

  return {
    appleLogout: appleLogoutMutation.mutateAsync,
    isLoading: appleLogoutMutation.isPending,
    error: appleLogoutMutation.error,
  };
};
