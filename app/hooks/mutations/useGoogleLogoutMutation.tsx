import { queryClient } from "@/app/lib/query/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { authStorage } from "@/app/lib/storage/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

export const useGoogleLogoutMutation = () => {
  const googleLogoutMutation = useMutation({
    mutationKey: QUERY_KEYS.AUTH.GOOGLE(),
    mutationFn: async () => {
      try {
        await GoogleSignin.signOut();
      } catch (error) {
        console.warn("Logout API failed", error);
      }

      await authStorage.clear();
      queryClient.clear();
    },
    onSuccess: () => {
      router.dismissAll();
      router.replace("/(auth)");
    },
  });

  return {
    googleLogout: googleLogoutMutation.mutateAsync,
    isLoading: googleLogoutMutation.isPending,
    error: googleLogoutMutation.error,
  };
};
