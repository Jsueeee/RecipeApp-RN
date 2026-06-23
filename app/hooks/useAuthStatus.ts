import { authStorage } from "@/app/lib/storage/auth";
import { usePathname } from "expo-router";
import { useCallback, useEffect, useState } from "react";

type AuthStatus = "loading" | "authenticated" | "guest";

export const useAuthStatus = () => {
  const pathname = usePathname();
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refresh = useCallback(async () => {
    const accessToken = await authStorage.getAccessToken();
    setStatus(accessToken ? "authenticated" : "guest");
  }, []);

  useEffect(() => {
    refresh();
  }, [pathname, refresh]);

  return {
    status,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isGuest: status === "guest",
    refresh,
  };
};
