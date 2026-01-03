/**
 * Chat Types - matching backend schemas
 */

export interface ChatRequest {
	message: string;
	chat_id?: number | null;
	persona_id?: string | null;
	test_mode?: boolean;
}

export interface ChatResponse {
	response: string;
	status: string;
	chat_id?: number;
	system_prompt?: string;
}

export interface ChatListItem {
	id: number;
	title: string;
	created_at: string;
	last_message: string;
}

export interface MessageResponse {
	id: number;
	content: string;
	role: "user" | "assistant" | "system";
	created_at: string;
}

export interface ChatHistoryResponse {
	chat_id: number;
	title: string;
	created_at: string;
	messages: MessageResponse[];
}

export interface ChatListResponse {
	chats: ChatListItem[];
}

// Local message type for UI
export interface Message {
	id: string | number;
	content: string;
	role: "user" | "assistant";
	isLoading?: boolean;
}
