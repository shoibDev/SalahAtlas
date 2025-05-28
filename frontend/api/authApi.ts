/**
 * Authentication API functions
 * 
 * Note: We use authApiClient instead of apiClient for these endpoints because
 * authentication endpoints don't require an auth token and have a different base URL
 * (/auth instead of /api)
 */
import authApiClient from '@/api/authApiClient';
import { API_END_POINTS } from '@/constants/apiEndPoints';
import { RegisterRequest, LoginRequest, AuthResponse } from "@/types/auth";

/**
 * Register a new user
 * @param request - Registration request data
 */
export const signup = async (request: RegisterRequest): Promise<void> => {
  try {
    const response = await authApiClient.post(API_END_POINTS.SIGNUP, request);

    // If the response status is not OK, throw an error manually
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || "Signup failed");
    }

  } catch (error: any) {
    // Normalize error message
    const message =
        error?.response?.data?.message ||
        error.message ||
        "Signup failed: Unknown error";

    console.error("Signup error:", message);
    throw new Error(message); // so you can handle it in the UI
  }
};

/**
 * Login a user
 * @param request - Login request data
 * @returns Promise with access and refresh tokens
 */
export const login = async (request: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await authApiClient.post(API_END_POINTS.LOGIN, request);

    // If the response status is not OK, throw an error manually
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || "Login failed");
    }

    return {
      accessToken: response.data.data.accessToken,
      refreshToken: response.data.data.refreshToken,
      userId: response.data.data.userId
    };

  } catch (error: any) {
    // Normalize error message
    const message =
        error?.response?.data?.message ||
        error.message ||
        "Login failed: Unknown error";

    console.error("Login error:", message);
    throw new Error(message); // so you can handle it in the UI
  }
}
