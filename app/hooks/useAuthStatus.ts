import { authStorage } from "@/app/lib/storage/auth";
import { usePathname } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

type AuthStatus = "loading" | "authenticated" | "guest";

export const useAuthStatus = () => {
  const pathname = usePathname();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const refreshIdRef = useRef(0);

  const refresh = useCallback(async () => {
    const refreshId = ++refreshIdRef.current;

    try {
      const accessToken = await authStorage.getAccessToken();
      if (refreshId !== refreshIdRef.current) return;
      setStatus(accessToken ? "authenticated" : "guest");
    } catch {
      if (refreshId !== refreshIdRef.current) return;
      setStatus("guest");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [pathname, refresh]);

  useEffect(
    () =>
      authStorage.subscribe(() => {
        setStatus("loading");
        void refresh();
      }),
    [refresh],
  );

  return {
    status,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isGuest: status === "guest",
    refresh,
  };
};
