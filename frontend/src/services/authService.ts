/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "../config/apiClient";

type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  status?: string;
  data?: T;
  token?: string;
};

export const handleLogin = async ({
  name,
  phone,
}: {
  name: string;
  phone: string;
}): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>("/login", {
      to: phone,
      username: name,
    });

    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    return (
      error.response?.data || {
        success: false,
        message: "Failed to send verification code.",
      }
    );
  }
};

export const handleVerify = async ({
  phone,
  code,
}: {
  phone: string;
  code: string;
}): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>("/verify", {
      to: phone,
      code,
    });

    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }
    return response.data;
  } catch (error: any) {
    console.error("Verification error:", error.response?.data || error.message);
    return (
      error.response?.data || {
        success: false,
        message: "Verification failed.",
      }
    );
  }
};
