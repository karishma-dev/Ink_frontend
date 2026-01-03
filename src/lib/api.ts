import axios, {
	AxiosError,
	AxiosInstance,
	InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "./constants";

/**
 * Create configured Axios instance
 */
const api: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

/**
 * Request interceptor to add auth token
 */
api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		if (typeof window !== "undefined") {
			const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
			if (token && config.headers) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error)
);

/**
 * Response interceptor for error handling
 */
api.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			// Clear auth data and redirect to login
			if (typeof window !== "undefined") {
				localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
				localStorage.removeItem(STORAGE_KEYS.USER_ID);
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	}
);

/**
 * API Error type
 */
export interface ApiError {
	message: string;
	code?: string;
	status?: number;
}

/**
 * Extract error message from API error
 */
export function getErrorMessage(error: unknown): string {
	if (axios.isAxiosError(error)) {
		const data = error.response?.data as { message?: string; detail?: string };
		return (
			data?.message || data?.detail || error.message || "An error occurred"
		);
	}
	if (error instanceof Error) {
		return error.message;
	}
	return "An unexpected error occurred";
}

export default api;
