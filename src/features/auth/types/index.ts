/**
 * Auth Types - matching backend schemas
 */

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
}

export interface AuthResponse {
	user_id: number;
	access_token: string;
	token_type: string;
}

export interface User {
	id: number;
	email: string;
	username?: string;
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}
