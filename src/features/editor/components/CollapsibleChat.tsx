"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, ChevronDown, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { useSendMessage } from "@/features/chat/hooks/useSendMessage";
import { usePersonas } from "@/features/personas/hooks/usePersonas";
import { getErrorMessage } from "@/lib/api";

interface Message {
	id: string;
	content: string;
	role: "user" | "assistant";
	isLoading?: boolean;
}

interface CollapsibleChatProps {
	isOpen: boolean;
	onToggle: () => void;
	editorContext?: string;
}

export function CollapsibleChat({
	isOpen,
	onToggle,
	editorContext,
}: CollapsibleChatProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(
		null
	);
	const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const sendMessage = useSendMessage();
	const { data: personasData } = usePersonas();
	const personas = personasData?.personas || [];
	const selectedPersona = personas.find((p) => p.id === selectedPersonaId);

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

		// Add loading message
		const loadingId = `loading-${Date.now()}`;
		setMessages((prev) => [
			...prev,
			{ id: loadingId, content: "", role: "assistant", isLoading: true },
		]);

		try {
			const response = await sendMessage.mutateAsync({
				message: input.trim(),
				persona_id: selectedPersonaId,
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
		} catch (err) {
			setMessages((prev) => prev.filter((m) => m.id !== loadingId));
		}
	};

	if (!isOpen) {
		return (
			<button
				onClick={onToggle}
				className='fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent hover:bg-accent-hover text-accent-foreground shadow-lg flex items-center justify-center transition-all hover:scale-105'
				aria-label='Open chat'
			>
				<MessageSquare className='h-6 w-6' />
			</button>
		);
	}

	return (
		<div className='fixed bottom-6 right-6 w-96 h-[500px] bg-background-surface border border-border rounded-xl shadow-lg flex flex-col animate-slide-in overflow-hidden'>
			{/* Header */}
			<div className='flex items-center justify-between p-4 border-b border-border'>
				<div className='flex items-center gap-2'>
					<MessageSquare className='h-5 w-5 text-accent' />
					<span className='font-medium text-foreground'>Brainstorm</span>
				</div>
				<button
					onClick={onToggle}
					className='p-1.5 rounded-lg hover:bg-background-elevated transition-colors'
					aria-label='Close chat'
				>
					<X className='h-4 w-4 text-foreground-muted' />
				</button>
			</div>

			{/* Persona Selector */}
			<div className='px-4 py-2 border-b border-border relative'>
				<button
					onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
					className='flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground transition-colors'
				>
					<User className='h-4 w-4' />
					<span>{selectedPersona?.name || "No persona"}</span>
					<ChevronDown
						className={cn(
							"h-3 w-3 transition-transform",
							showPersonaDropdown && "rotate-180"
						)}
					/>
				</button>

				{showPersonaDropdown && (
					<div className='absolute top-full left-4 right-4 mt-1 bg-background-elevated border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto'>
						<button
							onClick={() => {
								setSelectedPersonaId(null);
								setShowPersonaDropdown(false);
							}}
							className={cn(
								"w-full text-left px-3 py-2 text-sm hover:bg-background-surface transition-colors",
								!selectedPersonaId && "text-accent"
							)}
						>
							No persona
						</button>
						{personas.map((p) => (
							<button
								key={p.id}
								onClick={() => {
									setSelectedPersonaId(p.id);
									setShowPersonaDropdown(false);
								}}
								className={cn(
									"w-full text-left px-3 py-2 text-sm hover:bg-background-surface transition-colors",
									selectedPersonaId === p.id && "text-accent"
								)}
							>
								{p.name}
							</button>
						))}
					</div>
				)}
			</div>

			{/* Messages */}
			<div className='flex-1 overflow-y-auto p-4 space-y-4'>
				{messages.length === 0 ? (
					<div className='text-center text-foreground-muted text-sm py-8'>
						<Bot className='h-8 w-8 mx-auto mb-3 opacity-50' />
						<p>Ask me anything about your writing.</p>
						<p className='text-xs mt-1'>
							I can help brainstorm, edit, or expand ideas.
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
									"w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
									msg.role === "user" ? "bg-accent" : "bg-border"
								)}
							>
								{msg.role === "user" ? (
									<User className='h-3.5 w-3.5 text-accent-foreground' />
								) : (
									<Bot className='h-3.5 w-3.5 text-foreground' />
								)}
							</div>
							<div
								className={cn(
									"max-w-[80%] px-3 py-2 rounded-lg text-sm",
									msg.role === "user"
										? "bg-accent text-accent-foreground rounded-tr-sm"
										: "bg-background-elevated text-foreground rounded-tl-sm"
								)}
							>
								{msg.isLoading ? (
									<div className='flex gap-1'>
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
						onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
						placeholder='Ask anything...'
						className='flex-1 h-10 px-3 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-accent'
					/>
					<Button
						onClick={handleSend}
						disabled={!input.trim() || sendMessage.isPending}
						className='px-3'
					>
						<Send className='h-4 w-4' />
					</Button>
				</div>
			</div>
		</div>
	);
}
