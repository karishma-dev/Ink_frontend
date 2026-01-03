"use client";

import { useEffect, useRef } from "react";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "../types";

interface ChatMessagesProps {
	messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	if (messages.length === 0) {
		return <EmptyChat />;
	}

	return (
		<div className='flex-1 overflow-y-auto p-6'>
			<div className='max-w-3xl mx-auto space-y-6'>
				{messages.map((message) => (
					<MessageBubble key={message.id} message={message} />
				))}
				<div ref={bottomRef} />
			</div>
		</div>
	);
}

interface MessageBubbleProps {
	message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
	const isUser = message.role === "user";

	return (
		<div className={cn("flex gap-4", isUser && "flex-row-reverse")}>
			{/* Avatar */}
			<div
				className={cn(
					"w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
					isUser ? "bg-primary" : "bg-accent"
				)}
			>
				{isUser ? (
					<User className='h-4 w-4 text-primary-foreground' />
				) : (
					<Bot className='h-4 w-4 text-accent-foreground' />
				)}
			</div>

			{/* Message Content */}
			<div className={cn("flex-1 max-w-[80%]", isUser && "flex justify-end")}>
				<div
					className={cn(
						"px-4 py-3 rounded-2xl",
						isUser
							? "bg-primary text-primary-foreground rounded-tr-sm"
							: "bg-background-muted text-foreground rounded-tl-sm"
					)}
				>
					{message.isLoading ? (
						<TypingIndicator />
					) : (
						<p className='text-sm whitespace-pre-wrap'>{message.content}</p>
					)}
				</div>
			</div>
		</div>
	);
}

function TypingIndicator() {
	return (
		<div className='flex items-center gap-1 py-1 px-2'>
			<span className='w-2 h-2 rounded-full bg-foreground-muted animate-pulse' />
			<span className='w-2 h-2 rounded-full bg-foreground-muted animate-pulse [animation-delay:150ms]' />
			<span className='w-2 h-2 rounded-full bg-foreground-muted animate-pulse [animation-delay:300ms]' />
		</div>
	);
}

function EmptyChat() {
	return (
		<div className='flex-1 flex items-center justify-center p-8'>
			<div className='text-center max-w-md'>
				<div className='w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-6'>
					<Bot className='h-8 w-8 text-primary' />
				</div>
				<h2 className='text-xl font-semibold text-foreground mb-2'>
					Start a conversation
				</h2>
				<p className='text-foreground-secondary'>
					Ask me anything or select a persona to get personalized writing
					assistance.
				</p>
			</div>
		</div>
	);
}
