/**
 * Chat Service
 * Handles all chat-related API calls following tryCatchWrapper pattern
 */

import api from "@/lib/api";
import { tryCatchWrapperForService } from "@/lib/tryCatchWrapper";
import { API_ENDPOINTS } from "@/lib/constants";

export interface ChatMessage {
	id: string | number;
	content: string;
	role: "user" | "assistant";
}

export interface SendMessageParams {
	message: string;
	chat_id?: number | null;
	persona_id?: string | null;
	document_ids?: number[];
	draft_content?: string;
	selection?: {
		start: number;
		end: number;
		text: string;
	};
}

export interface ChatSSEEvent {
	type: "status" | "content" | "edits" | "citations" | "done" | "error";
	content?: string;
	edits?: Array<{
		type: string;
		start: number;
		end: number;
		original: string;
		replacement: string;
	}>;
	citations?: Array<{
		index: number;
		document_id: number;
		chunk_text: string;
	}>;
	has_edits?: boolean;
	chat_id?: number | null;
	mode?: string;
}

/**
 * Send a chat message via SSE stream
 * Returns an async generator for streaming responses
 */
export const sendChatMessageStream = async function* (
	params: SendMessageParams
): AsyncGenerator<ChatSSEEvent, void, unknown> {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/chat`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			},
			body: JSON.stringify(params),
		}
	);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const reader = response.body?.getReader();
	if (!reader) throw new Error("No response body");

	const decoder = new TextDecoder();
	let buffer = "";

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split("\n\n");
		buffer = lines.pop() || "";

		for (const line of lines) {
			if (line.startsWith("data: ")) {
				try {
					const data = JSON.parse(line.slice(6));
					yield data as ChatSSEEvent;
				} catch {
					// Skip invalid JSON
				}
			}
		}
	}
};

/**
 * Get chat history
 */
export const getChatsService = () => {
	return tryCatchWrapperForService(async () => {
		const response = await api.get("/chats");
		return response.data;
	});
};

/**
 * Get messages for a specific chat
 */
export const getChatMessagesService = (chatId: number) => {
	return tryCatchWrapperForService(async () => {
		const response = await api.get(`/chat/${chatId}`);
		return response.data;
	});
};

/**
 * Delete a chat
 */
export const deleteChatService = (chatId: number) => {
	return tryCatchWrapperForService(async () => {
		const response = await api.delete(`/chats/${chatId}`);
		return response.data;
	});
};
