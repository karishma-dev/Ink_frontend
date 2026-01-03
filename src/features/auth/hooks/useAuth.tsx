"use client";

import {
	createContext,
	useContext,
	useState,
	useCallback,
	useEffect,
	ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api, { getErrorMessage } from "@/lib/api";
import { API_ENDPOINTS, STORAGE_KEYS } from "@/lib/constants";
import {
	AuthResponse,
	LoginRequest,
	RegisterRequest,
	User,
	AuthState,
} from "../types";

interface AuthContextType extends AuthState {
	login: (data: LoginRequest) => Promise<void>;
	register: (data: RegisterRequest) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const router = useRouter();
	const [state, setState] = useState<AuthState>({
		user: null,
		isAuthenticated: false,
		isLoading: true,
	});

	// Check for existing session on mount
	useEffect(() => {
		const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
		const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);

		if (token && userId) {
			setState({
				user: { id: parseInt(userId, 10), email: "" },
				isAuthenticated: true,
				isLoading: false,
			});
		} else {
			setState((prev) => ({ ...prev, isLoading: false }));
		}
	}, []);

	const login = useCallback(
		async (data: LoginRequest) => {
			const response = await api.post<AuthResponse>(API_ENDPOINTS.LOGIN, data);
			const { access_token, user_id } = response.data;

			localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
			localStorage.setItem(STORAGE_KEYS.USER_ID, user_id.toString());

			setState({
				user: { id: user_id, email: data.email },
				isAuthenticated: true,
				isLoading: false,
			});

			router.push("/write");
		},
		[router]
	);

	const register = useCallback(
		async (data: RegisterRequest) => {
			const response = await api.post<AuthResponse>(
				API_ENDPOINTS.REGISTER,
				data
			);
			const { access_token, user_id } = response.data;

			localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
			localStorage.setItem(STORAGE_KEYS.USER_ID, user_id.toString());

			setState({
				user: { id: user_id, email: data.email, username: data.username },
				isAuthenticated: true,
				isLoading: false,
			});

			router.push("/onboarding");
		},
		[router]
	);

	const logout = useCallback(() => {
		localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
		localStorage.removeItem(STORAGE_KEYS.USER_ID);

		setState({
			user: null,
			isAuthenticated: false,
			isLoading: false,
		});

		router.push("/login");
	}, [router]);

	return (
		<AuthContext.Provider value={{ ...state, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export { getErrorMessage };
