"use client";

import { useState, useRef, useEffect } from "react";
import {
	Send,
	Upload,
	History,
	ChevronDown,
	ChevronRight,
	User,
	Bot,
	FileText,
	X,
	Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { useSendMessage } from "@/features/chat/hooks/useSendMessage";
import { useChats } from "@/features/chat/hooks/useChats";
import { usePersonas } from "@/features/personas/hooks/usePersonas";
import { Persona } from "@/features/personas/types";

interface Message {
	id: string;
	content: string;
	role: "user" | "assistant";
	isLoading?: boolean;
}

interface ChatSidebarProps {
	isOpen: boolean;
	onToggle: () => void;
	onUploadClick: () => void;
}

export function ChatSidebar({
	isOpen,
	onToggle,
	onUploadClick,
}: ChatSidebarProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
	const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
	const [showHistory, setShowHistory] = useState(false);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const sendMessage = useSendMessage();
	const { data: personasData } = usePersonas();
	const { data: chatsData } = useChats();

	const personas = personasData?.personas || [];
	const chatHistory = chatsData?.chats || [];

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSend = async () => {
		if (!input.trim() || sendMessage.isPending) return;

		const userMessage: Message = {
			id: `user-${Date.now()}`,
			content: input.trim(),
			role: "user",
		};
		setMessages((prev) => [...prev, userMessage]);
		setInput("");

		const loadingId = `loading-${Date.now()}`;
		setMessages((prev) => [
			...prev,
			{ id: loadingId, content: "", role: "assistant", isLoading: true },
		]);

		try {
			const response = await sendMessage.mutateAsync({
				message: input.trim(),
				persona_id: selectedPersona?.id || null,
			});

			setMessages((prev) =>
				prev.map((m) =>
					m.id === loadingId
						? {
								id: `ai-${Date.now()}`,
								content: response.response,
								role: "assistant",
						  }
						: m
				)
			);
		} catch {
			setMessages((prev) => prev.filter((m) => m.id !== loadingId));
		}
	};

	const startNewChat = () => {
		setMessages([]);
		setShowHistory(false);
	};

	if (!isOpen) {
		return (
			<button
				onClick={onToggle}
				className='fixed right-0 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-2 rounded-l-lg shadow-md hover:bg-primary-hover transition-colors'
				aria-label='Open chat'
			>
				<ChevronRight className='h-5 w-5 rotate-180' />
			</button>
		);
	}

	return (
		<aside className='w-80 h-full bg-background-surface border-l border-border flex flex-col animate-slide-in-right'>
			{/* Header */}
			<div className='p-3 border-b border-border flex items-center justify-between'>
				<span className='font-semibold text-foreground'>AI Assistant</span>
				<button
					onClick={onToggle}
					className='p-1 rounded hover:bg-background-muted transition-colors'
					aria-label='Close sidebar'
				>
					<ChevronRight className='h-4 w-4' />
				</button>
			</div>

			{/* Toolbar */}
			<div className='p-2 border-b border-border space-y-2'>
				{/* Persona Selector */}
				<div className='relative'>
					<button
						onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
						className='w-full flex items-center justify-between px-3 py-2 rounded-lg bg-background hover:bg-background-muted border border-border transition-colors text-sm'
					>
						<div className='flex items-center gap-2'>
							<User className='h-4 w-4 text-foreground-muted' />
							<span className='text-foreground truncate'>
								{selectedPersona?.name || "No persona selected"}
							</span>
						</div>
						<ChevronDown
							className={cn(
								"h-4 w-4 text-foreground-muted transition-transform",
								showPersonaDropdown && "rotate-180"
							)}
						/>
					</button>

					{showPersonaDropdown && (
						<div className='absolute top-full left-0 right-0 mt-1 bg-background-surface border border-border rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto'>
							<button
								onClick={() => {
									setSelectedPersona(null);
									setShowPersonaDropdown(false);
								}}
								className={cn(
									"w-full text-left px-3 py-2 text-sm hover:bg-background-muted transition-colors",
									!selectedPersona && "text-primary font-medium"
								)}
							>
								No persona (default)
							</button>
							{personas.map((p) => (
								<button
									key={p.id}
									onClick={() => {
										setSelectedPersona(p);
										setShowPersonaDropdown(false);
									}}
									className={cn(
										"w-full text-left px-3 py-2 text-sm hover:bg-background-muted transition-colors",
										selectedPersona?.id === p.id && "text-primary font-medium"
									)}
								>
									{p.name}
								</button>
							))}
						</div>
					)}
				</div>

				{/* Action Buttons */}
				<div className='flex gap-2'>
					<button
						onClick={onUploadClick}
						className='flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-background hover:bg-background-muted border border-border transition-colors text-sm text-foreground'
					>
						<Upload className='h-4 w-4' />
						<span>Upload</span>
					</button>
					<button
						onClick={() => setShowHistory(!showHistory)}
						className={cn(
							"flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border transition-colors text-sm",
							showHistory
								? "bg-primary text-primary-foreground border-primary"
								: "bg-background hover:bg-background-muted border-border text-foreground"
						)}
					>
						<History className='h-4 w-4' />
						<span>History</span>
					</button>
				</div>
			</div>

			{/* Content Area - Either History or Chat */}
			{showHistory ? (
				<div className='flex-1 overflow-y-auto p-2'>
					<div className='flex items-center justify-between mb-2 px-2'>
						<span className='text-xs font-medium text-foreground-muted uppercase'>
							Recent Chats
						</span>
						<button
							onClick={startNewChat}
							className='text-xs text-primary hover:underline flex items-center gap-1'
						>
							<Plus className='h-3 w-3' />
							New
						</button>
					</div>
					{chatHistory.length === 0 ? (
						<p className='text-sm text-foreground-muted text-center py-4'>
							No chat history yet
						</p>
					) : (
						<div className='space-y-1'>
							{chatHistory.slice(0, 10).map((chat) => (
								<button
									key={chat.id}
									onClick={() => setShowHistory(false)}
									className='w-full text-left p-2 rounded-lg hover:bg-background-muted transition-colors'
								>
									<p className='text-sm font-medium text-foreground truncate'>
										{chat.title || "Untitled"}
									</p>
									<p className='text-xs text-foreground-muted truncate'>
										{chat.last_message}
									</p>
								</button>
							))}
						</div>
					)}
				</div>
			) : (
				<>
					{/* Messages */}
					<div className='flex-1 overflow-y-auto p-3 space-y-3'>
						{messages.length === 0 ? (
							<div className='text-center text-foreground-muted text-sm py-8'>
								<Bot className='h-10 w-10 mx-auto mb-3 opacity-40' />
								<p className='font-medium'>How can I help?</p>
								<p className='text-xs mt-1'>
									Ask me to brainstorm, edit, or expand your writing.
								</p>
							</div>
						) : (
							messages.map((msg) => (
								<div
									key={msg.id}
									className={cn(
										"flex gap-2",
										msg.role === "user" && "flex-row-reverse"
									)}
								>
									<div
										className={cn(
											"w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
											msg.role === "user" ? "bg-primary" : "bg-background-muted"
										)}
									>
										{msg.role === "user" ? (
											<User className='h-3 w-3 text-primary-foreground' />
										) : (
											<Bot className='h-3 w-3 text-foreground-muted' />
										)}
									</div>
									<div
										className={cn(
											"max-w-[85%] px-3 py-2 rounded-lg text-sm",
											msg.role === "user"
												? "bg-primary text-primary-foreground rounded-tr-sm"
												: "bg-background-muted text-foreground rounded-tl-sm"
										)}
									>
										{msg.isLoading ? (
											<div className='flex gap-1 py-1'>
												<span className='w-1.5 h-1.5 rounded-full bg-foreground-muted animate-pulse' />
												<span className='w-1.5 h-1.5 rounded-full bg-foreground-muted animate-pulse [animation-delay:150ms]' />
												<span className='w-1.5 h-1.5 rounded-full bg-foreground-muted animate-pulse [animation-delay:300ms]' />
											</div>
										) : (
											<p className='whitespace-pre-wrap'>{msg.content}</p>
										)}
									</div>
								</div>
							))
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Input */}
					<div className='p-3 border-t border-border'>
						<div className='flex gap-2'>
							<input
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) =>
									e.key === "Enter" && !e.shiftKey && handleSend()
								}
								placeholder='Ask anything...'
								className='flex-1 h-9 px-3 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
							/>
							<Button
								onClick={handleSend}
								disabled={!input.trim() || sendMessage.isPending}
								size='sm'
								className='px-3'
							>
								<Send className='h-4 w-4' />
							</Button>
						</div>
					</div>
				</>
			)}
		</aside>
	);
}
