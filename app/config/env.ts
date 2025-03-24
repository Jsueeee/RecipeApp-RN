import { ENV, API_BASE_URL } from "@env";

export const isDev = ENV === "dev";
export const isProd = ENV === "prod";

export const config = {
  apiUrl: API_BASE_URL,
  timeout: isDev ? 30000 : 10000,
};

export const devLog = (...args: any[]) => {
  if (isDev) {
    console.log(...args);
  }
};
