export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
}

export interface AutoLoginResponse {
  userId: number;
}

export interface ReissueTokenResponse {
  userId: number;
  accessToken: string;
  refreshToken: string;
}

export interface ReissueTokenRequest {
  userId: number;
  refreshToken: string;
}
