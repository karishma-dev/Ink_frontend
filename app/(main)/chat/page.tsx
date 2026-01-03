"use client";

import { useState, useEffect } from "react";
import {
	ChatSidebar,
	ChatMessages,
	ChatInput,
	useChatMessages,
	useSendMessage,
	Message,
} from "@/features/chat";
import { getErrorMessage } from "@/lib/api";
import { useToast } from "@/components/ui";

export default function ChatPage() {
	const [activeChatId, setActiveChatId] = useState<number | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);

	const { data: chatHistory } = useChatMessages(activeChatId);
	const sendMessage = useSendMessage();
	const { showToast } = useToast();

	// Load messages when chat is selected
	useEffect(() => {
		if (chatHistory?.messages) {
			setMessages(
				chatHistory.messages.map((msg) => ({
					id: msg.id,
					content: msg.content,
					role: msg.role as "user" | "assistant",
				}))
			);
		} else if (!activeChatId) {
			setMessages([]);
		}
	}, [chatHistory, activeChatId]);

	const handleSendMessage = async (
		content: string,
		personaId: string | null
	) => {
		// Add user message immediately
		const userMessage: Message = {
			id: `temp-${Date.now()}`,
			content,
			role: "user",
		};
		setMessages((prev) => [...prev, userMessage]);

		// Add loading message
		const loadingMessage: Message = {
			id: `loading-${Date.now()}`,
			content: "",
			role: "assistant",
			isLoading: true,
		};
		setMessages((prev) => [...prev, loadingMessage]);

		try {
			const response = await sendMessage.mutateAsync({
				message: content,
				chat_id: activeChatId,
				persona_id: personaId,
			});

			// Replace loading message with actual response
			setMessages((prev) =>
				prev.map((msg) =>
					msg.isLoading
						? {
								id: Date.now(),
								content: response.response,
								role: "assistant" as const,
						  }
						: msg
				)
			);

			// Update active chat ID if new chat was created
			if (response.chat_id && !activeChatId) {
				setActiveChatId(response.chat_id);
			}
		} catch (err) {
			// Remove loading message on error
			setMessages((prev) => prev.filter((msg) => !msg.isLoading));
			showToast("error", getErrorMessage(err));
		}
	};

	const handleChatSelect = (chatId: number | null) => {
		setActiveChatId(chatId);
		if (!chatId) {
			setMessages([]);
		}
	};

	return (
		<div className='flex h-screen'>
			<ChatSidebar
				activeChatId={activeChatId}
				onChatSelect={handleChatSelect}
			/>

			<div className='flex-1 flex flex-col'>
				<ChatMessages messages={messages} />
				<ChatInput
					onSend={handleSendMessage}
					isLoading={sendMessage.isPending}
				/>
			</div>
		</div>
	);
}
