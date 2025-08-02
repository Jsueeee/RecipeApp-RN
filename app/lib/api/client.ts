import axios from "axios";
import { authStorage } from "../storage/auth";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
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
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401 에러 시 토큰 만료로 처리
    if (error.response?.status === 401) {
      // 토큰 리프레시 로직 또는 로그아웃 처리
    }
    return Promise.reject(error);
  }
);

// 개발 환경에서만 요청/응답 로깅
if (process.env.EXPO_PUBLIC_ENV === "dev") {
  apiClient.interceptors.request.use(
    (config) => {
      console.log(
        "🚀 API 요청:",
        config.method,
        config.url,
        config.data,
        config.params
      );
      return config;
    },
    (error) => {
      console.error("❌ 요청 에러:", error);
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response) => {
      console.log("✅ API 응답:", JSON.stringify(response.data));
      return response;
    },
    (error) => {
      console.error("❌ 응답 에러:", JSON.stringify(error.response?.data));
      return Promise.reject(error);
    }
  );
}
