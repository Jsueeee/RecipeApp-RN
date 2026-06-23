import type { ReissueTokenResponse } from "@/app/types/api/auth";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";
import { apiBaseUrl, isProdEnv } from "../config/env";
import { queryClient } from "../query/client";
import { authStorage } from "../storage/auth";

const AUTH_ENDPOINT_PATTERN =
  /\/users\/(auto-login|kakao-login|google-login|naver-login|apple-login|token-reissue)$/;

const isAuthEndpoint = (url?: string) =>
  url ? AUTH_ENDPOINT_PATTERN.test(url) : false;

const PUBLIC_GET_ENDPOINT_PATTERNS = [
  /^\/recipes$/,
  /^\/recipes\/blog$/,
  /^\/recipes\/youtube$/,
  /^\/recipes\/best-keywords$/,
  /^\/recipes\/public\/recommendation$/,
  /^\/recipes\/\d+$/,
];

const getPathname = (url?: string) => {
  if (!url) return "";

  try {
    return new URL(url, apiBaseUrl).pathname;
  } catch {
    return url.split("?")[0];
  }
};

const isPublicGetEndpoint = (config: InternalAxiosRequestConfig) => {
  const method = (config.method ?? "get").toLowerCase();
  if (method !== "get") return false;

  const path = getPathname(config.url);
  return PUBLIC_GET_ENDPOINT_PATTERNS.some((pattern) => pattern.test(path));
};

let isAuthRedirectSuppressed = false;

export const setAuthRedirectSuppressed = (isSuppressed: boolean) => {
  isAuthRedirectSuppressed = isSuppressed;
};

const shouldRedirectToAuth = (config: InternalAxiosRequestConfig) =>
  !isAuthRedirectSuppressed &&
  !isAuthEndpoint(config.url) &&
  !isPublicGetEndpoint(config);

const resetToAuth = () => {
  queryClient.clear();
  router.dismissAll();
  router.replace("/(auth)");
};

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await authStorage.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = (error.config ||
      {}) as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 응답이 없으면(네트워크/타임아웃) 그대로 전파
    if (!error.response) {
      return Promise.reject(error);
    }

    // 토큰 재발급 요청 자체에서의 에러는 전파 (재발급 무한루프 방지)
    const requestUrl = originalConfig.url || "";
    const isReissueEndpoint = /\/users\/token-reissue/.test(requestUrl);
    if (isReissueEndpoint) {
      return Promise.reject(error);
    }

    // 모든 API에서 401, 403 발생 시 토큰 재발급 시도
    if (
      (error.response.status === 403 || error.response.status === 401) &&
      !originalConfig._retry
    ) {
      originalConfig._retry = true;

      // 동시 다발 403 대응: 한 번만 재발급 수행, 나머지는 대기
      try {
        const refreshToken = await authStorage.getRefreshToken();
        const userId = await authStorage.getUserId();

        if (!refreshToken || !userId) {
          await authStorage.clear();

          if (shouldRedirectToAuth(originalConfig)) {
            resetToAuth();
          }

          return Promise.reject(error);
        }

        await refreshAccessTokenOnce();

        // 최신 토큰으로 헤더 갱신 후 원 요청 재시도
        const newAccessToken = await authStorage.getAccessToken();
        if (newAccessToken) {
          originalConfig.headers = originalConfig.headers ?? {};
          originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalConfig);
      } catch (refreshError) {
        // 재발급 실패 시 토큰 정리 후 로그인 화면으로 복귀
        await authStorage.clear();

        if (shouldRedirectToAuth(originalConfig)) {
          resetToAuth();
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// 토큰을 dev 로그에서 마스킹: 앞 6자 + …(<last 4>) 형태
const maskToken = (raw: unknown): string => {
  if (typeof raw !== "string" || raw.length === 0) return "undefined";
  const stripped = raw.replace(/^Bearer\s+/i, "");
  if (stripped.length <= 12) return "Bearer ***";
  return `Bearer ${stripped.slice(0, 6)}…${stripped.slice(-4)}`;
};

const maskHeaders = (headers: unknown) => {
  if (!headers || typeof headers !== "object") return headers;
  const clone: Record<string, unknown> = { ...(headers as object) };
  if (clone.Authorization) clone.Authorization = maskToken(clone.Authorization);
  if (clone.authorization) clone.authorization = maskToken(clone.authorization);
  return clone;
};

// 개발 환경에서만 요청/응답 로깅
if (!isProdEnv) {
  apiClient.interceptors.request.use(
    async (config) => {
      console.log(
        "🚀 API 요청:",
        `\nmethod: ${config.method}`,
        `\nbaseURL: ${config.baseURL}`,
        `\nurl: ${config.url}`,
        `\ndata: ${JSON.stringify(config.data)}`,
        `\nparams: ${JSON.stringify(config.params)}`,
        `\nheaders: ${JSON.stringify(maskHeaders(config.headers))}`,
        `\nAuthorization: ${maskToken(config.headers.Authorization)}`,
      );
      return config;
    },
    (error) => {
      console.error("❌ 요청 에러:", error);
      return Promise.reject(error);
    },
  );

  apiClient.interceptors.response.use(
    (response) => {
      console.log("✅ API 응답:", JSON.stringify(response.data));
      return response;
    },
    (error) => {
      console.error("❌ 응답 에러:", JSON.stringify(error.response?.data));
      return Promise.reject(error);
    },
  );
}

// ----- 재발급을 중복 없이 한 번만 수행 -----
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken(): Promise<void> {
  const refreshToken = await authStorage.getRefreshToken();
  const userId = await authStorage.getUserId();

  if (!refreshToken || !userId) {
    await authStorage.clear();

    throw new Error("Missing refresh token or userId");
  }

  // 인터셉터 영향을 받지 않는 전용 클라이언트로 호출
  const plainClient = axios.create({
    baseURL: apiBaseUrl,
    timeout: 30000,
    headers: { "Content-Type": "application/json" },
  });

  const { data } = await plainClient.post<ReissueTokenResponse>(
    "/users/token-reissue",
    {
      userId: Number(userId),
      refreshToken,
    },
  );

  await authStorage.setTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    userId: data.userId,
  });
}

function refreshAccessTokenOnce(): Promise<void> {
  if (!isRefreshing) {
    isRefreshing = true;

    refreshPromise = refreshAccessToken()
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
  }
  // refreshPromise는 null이 아님을 보장(위에서 설정)
  return refreshPromise as Promise<void>;
}
