import axios from "axios";
import { config, isDev } from "@/app/config/env";

export const apiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: config.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// 개발 환경에서만 요청/응답 로깅
if (isDev) {
  apiClient.interceptors.request.use(
    (config) => {
      console.log("🚀 API 요청:", config.url, config.data);
      return config;
    },
    (error) => {
      console.error("❌ 요청 에러:", error);
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response) => {
      console.log("✅ API 응답:", response.data);
      return response;
    },
    (error) => {
      console.error("❌ 응답 에러:", error.response?.data);
      return Promise.reject(error);
    }
  );
}
