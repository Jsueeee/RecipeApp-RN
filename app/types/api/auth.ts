export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
}

export interface AutoLoginResponse {
  userId: number;
}
