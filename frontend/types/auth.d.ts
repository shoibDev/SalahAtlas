export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
}
