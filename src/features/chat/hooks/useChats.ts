import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { ChatListResponse, ChatHistoryResponse } from "../types";

/**
 * Hook to fetch list of user's chats
 */
export function useChats(limit = 20, offset = 0) {
	return useQuery({
		queryKey: ["chats", limit, offset],
		queryFn: async () => {
			const response = await api.get<ChatListResponse>(API_ENDPOINTS.CHATS, {
				params: { limit, offset },
			});
			return response.data;
		},
	});
}

/**
 * Hook to fetch messages for a specific chat
 */
export function useChatMessages(chatId: number | null) {
	return useQuery({
		queryKey: ["chat", chatId],
		queryFn: async () => {
			if (!chatId) return null;
			const response = await api.get<ChatHistoryResponse>(
				API_ENDPOINTS.CHAT_MESSAGES(chatId)
			);
			return response.data;
		},
		enabled: !!chatId,
	});
}
