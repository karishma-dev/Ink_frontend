"use client";

import { MessageSquare, Plus } from "lucide-react";
import { cn, formatRelativeTime, truncate } from "@/lib/utils";
import { useChats } from "../hooks/useChats";
import { ChatListItem } from "../types";

interface ChatSidebarProps {
	activeChatId: number | null;
	onChatSelect: (chatId: number | null) => void;
}

export function ChatSidebar({ activeChatId, onChatSelect }: ChatSidebarProps) {
	const { data, isLoading } = useChats();

	return (
		<div className='w-72 h-full bg-background-surface border-r border-border flex flex-col'>
			{/* Header */}
			<div className='p-4 border-b border-border'>
				<button
					onClick={() => onChatSelect(null)}
					className='w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors'
				>
					<Plus className='h-4 w-4' />
					New Chat
				</button>
			</div>

			{/* Chat List */}
			<div className='flex-1 overflow-y-auto p-2'>
				{isLoading ? (
					<ChatListSkeleton />
				) : data?.chats && data.chats.length > 0 ? (
					<div className='space-y-1'>
						{data.chats.map((chat) => (
							<ChatListItemComponent
								key={chat.id}
								chat={chat}
								isActive={chat.id === activeChatId}
								onClick={() => onChatSelect(chat.id)}
							/>
						))}
					</div>
				) : (
					<EmptyState />
				)}
			</div>
		</div>
	);
}

interface ChatListItemComponentProps {
	chat: ChatListItem;
	isActive: boolean;
	onClick: () => void;
}

function ChatListItemComponent({
	chat,
	isActive,
	onClick,
}: ChatListItemComponentProps) {
	return (
		<button
			onClick={onClick}
			className={cn(
				"w-full text-left p-3 rounded-lg transition-colors",
				isActive ? "bg-primary-light" : "hover:bg-background-muted"
			)}
		>
			<div className='flex items-start gap-3'>
				<MessageSquare
					className={cn(
						"h-5 w-5 mt-0.5 flex-shrink-0",
						isActive ? "text-primary" : "text-foreground-muted"
					)}
				/>
				<div className='flex-1 min-w-0'>
					<p
						className={cn(
							"text-sm font-medium truncate",
							isActive ? "text-primary" : "text-foreground"
						)}
					>
						{chat.title || "New Chat"}
					</p>
					<p className='text-xs text-foreground-muted mt-0.5 truncate'>
						{truncate(chat.last_message, 40)}
					</p>
					<p className='text-xs text-foreground-muted mt-1'>
						{formatRelativeTime(chat.created_at)}
					</p>
				</div>
			</div>
		</button>
	);
}

function ChatListSkeleton() {
	return (
		<div className='space-y-2'>
			{[...Array(5)].map((_, i) => (
				<div
					key={i}
					className='p-3 rounded-lg bg-background-muted animate-pulse'
				>
					<div className='flex items-start gap-3'>
						<div className='w-5 h-5 rounded bg-border' />
						<div className='flex-1'>
							<div className='h-4 bg-border rounded w-3/4 mb-2' />
							<div className='h-3 bg-border rounded w-1/2' />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

function EmptyState() {
	return (
		<div className='flex flex-col items-center justify-center h-full text-center p-4'>
			<MessageSquare className='h-10 w-10 text-foreground-muted mb-3' />
			<p className='text-sm text-foreground-secondary'>No chats yet</p>
			<p className='text-xs text-foreground-muted mt-1'>
				Start a new conversation
			</p>
		</div>
	);
}
