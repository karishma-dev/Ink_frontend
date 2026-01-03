/**
 * API Configuration Constants
 */
export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
	// Auth
	LOGIN: "/auth/login",
	REGISTER: "/auth/register",

	// Chat
	CHAT: "/chat",
	CHATS: "/chats",
	CHAT_MESSAGES: (chatId: number) => `/chat/${chatId}`,

	// Personas
	PERSONAS: "/personas",
	PERSONA: (id: string) => `/personas/${id}`,

	// Documents
	DOCUMENTS: "/documents",
	DOCUMENT: (id: number) => `/documents/${id}`,
	DOCUMENT_UPLOAD: "/documents/upload",
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
	ACCESS_TOKEN: "access_token",
	USER_ID: "user_id",
} as const;

/**
 * Validation Constants
 */
export const VALIDATION = {
	PASSWORD_MIN_LENGTH: 8,
	USERNAME_MIN_LENGTH: 3,
	USERNAME_MAX_LENGTH: 50,
	MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
	ALLOWED_FILE_TYPES: [".pdf", ".md", ".txt"],
} as const;

/**
 * Persona Configuration
 */
export const PERSONA_CONFIG = {
	FORMALITY_LEVELS: { min: 1, max: 10 },
	CREATIVITY_LEVELS: { min: 1, max: 10 },
	JARGON_LEVELS: { min: 1, max: 10 },
	SENTENCE_LENGTH_OPTIONS: ["short", "medium", "long", "varied"] as const,
	AUDIENCE_OPTIONS: [
		"general",
		"technical",
		"academic",
		"casual",
		"professional",
	] as const,
	PURPOSE_OPTIONS: [
		"blog",
		"article",
		"documentation",
		"marketing",
		"social",
		"email",
	] as const,
} as const;

/**
 * UI Constants
 */
export const UI = {
	DEBOUNCE_MS: 300,
	TOAST_DURATION: 5000,
	PAGE_SIZE: 20,
} as const;
