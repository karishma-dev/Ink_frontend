import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { ChatRequest, ChatResponse } from "../types";

/**
 * Hook to send a message and get AI response
 */
export function useSendMessage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: ChatRequest) => {
			const response = await api.post<ChatResponse>(API_ENDPOINTS.CHAT, data);
			return response.data;
		},
		onSuccess: (data) => {
			// Invalidate chat list to show new/updated chat
			queryClient.invalidateQueries({ queryKey: ["chats"] });

			// If we have a chat_id, invalidate that specific chat
			if (data.chat_id) {
				queryClient.invalidateQueries({ queryKey: ["chat", data.chat_id] });
			}
		},
	});
}
