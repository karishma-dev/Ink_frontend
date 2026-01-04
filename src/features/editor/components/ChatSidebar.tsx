"use client";

import { useState, useRef, useEffect } from "react";
import {
	PaperPlaneRight,
	User,
	Robot,
	Paperclip,
	FileText,
	X,
	ClockCounterClockwise,
	ChatCircleText,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { usePersonas } from "@/features/personas/hooks/usePersonas";
import { Persona } from "@/features/personas/types";
import {
	sendChatMessageStream,
	getChatsService,
	getChatMessagesService,
} from "@/services/chatService";
import { useAppDispatch } from "@/store/hooks";
import { setPendingEdits } from "@/store/editorSlice";
import { listDocumentsService } from "@/services/documentService";
import { Streamdown } from "streamdown";

interface Message {
	id: string;
	content: string;
	role: "user" | "assistant";
	isStreaming?: boolean;
}

interface ChatSidebarProps {
	isOpen: boolean;
	onToggle: () => void;
	onUploadClick: () => void;
	draftContent?: string;
	selection?: { start: number; end: number; text: string } | null;
}

export function ChatSidebar({
	isOpen,
	onToggle,
	onUploadClick,
	draftContent,
	selection,
}: ChatSidebarProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showMentions, setShowMentions] = useState(false);
	const [mentionQuery, setMentionQuery] = useState("");
	const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
	const [availableDocs, setAvailableDocs] = useState<any[]>([]);
	const [view, setView] = useState<"chat" | "history">("chat");
	const [history, setHistory] = useState<any[]>([]);
	const [activeChatId, setActiveChatId] = useState<number | null>(null);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const { data: personasData } = usePersonas();
	const dispatch = useAppDispatch();

	const personas = personasData?.personas || [];

	// Fetch documents for @ mentions
	useEffect(() => {
		const fetchDocs = async () => {
			const res = await listDocumentsService();
			if (res.success && res.data) {
				setAvailableDocs(res.data.documents);
			}
		};
		fetchDocs();
	}, []);

	// Fetch chat history
	useEffect(() => {
		if (view === "history") {
			const fetchHistory = async () => {
				const res = await getChatsService();
				if (res.success && res.data) {
					setHistory(res.data.chats);
				}
			};
			fetchHistory();
		}
	}, [view]);

	// Filter documents based on @ query
	const filteredDocs = availableDocs.filter((doc) =>
		doc.filename.toLowerCase().includes(mentionQuery.toLowerCase())
	);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Auto-resize textarea
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.style.height = "auto";
			inputRef.current.style.height = `${Math.min(
				inputRef.current.scrollHeight,
				120
			)}px`;
		}
	}, [input]);

	// Handle @ mentions
	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setInput(value);

		const cursorPos = e.target.selectionStart;
		const textBeforeCursor = value.slice(0, cursorPos);
		const atMatch = textBeforeCursor.match(/@(\w*)$/);

		if (atMatch) {
			setShowMentions(true);
			setMentionQuery(atMatch[1]);
		} else {
			setShowMentions(false);
			setMentionQuery("");
		}
	};

	const insertMention = (doc: { id: number; filename: string }) => {
		const cursorPos = inputRef.current?.selectionStart || input.length;
		const textBeforeCursor = input.slice(0, cursorPos);
		const textAfterCursor = input.slice(cursorPos);

		const newText =
			textBeforeCursor.replace(/@\w*$/, `@${doc.filename} `) + textAfterCursor;
		setInput(newText);
		setSelectedDocuments((prev) => [...prev, doc.id]);
		setShowMentions(false);
		inputRef.current?.focus();
	};

	const removeDocument = (docId: number) => {
		setSelectedDocuments((prev) => prev.filter((id) => id !== docId));
	};

	const handleSend = async () => {
		if (!input.trim() || isLoading) return;

		const userMessage: Message = {
			id: `user-${Date.now()}`,
			content: input.trim(),
			role: "user",
		};
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setSelectedDocuments([]);
		setIsLoading(true);
		setView("chat");

		const assistantId = `assistant-${Date.now()}`;
		setMessages((prev) => [
			...prev,
			{ id: assistantId, content: "", role: "assistant", isStreaming: true },
		]);

		try {
			const stream = sendChatMessageStream({
				message: input.trim(),
				persona_id: selectedPersona?.id || null,
				draft_content: draftContent,
				document_ids: selectedDocuments,
				selection: selection || undefined,
				chat_id: activeChatId,
			});

			let fullContent = "";

			for await (const event of stream) {
				if (event.type === "content" && event.content) {
					fullContent += event.content;
					setMessages((prev) =>
						prev.map((m) =>
							m.id === assistantId ? { ...m, content: fullContent } : m
						)
					);
				} else if (event.type === "edits" && event.edits) {
					dispatch(setPendingEdits(event.edits));
				} else if (event.type === "error" && event.content) {
					setMessages((prev) =>
						prev.map((m) =>
							m.id === assistantId
								? { ...m, content: event.content || "", isStreaming: false }
								: m
						)
					);
				} else if (event.type === "done") {
					if (event.chat_id) setActiveChatId(event.chat_id);
					setMessages((prev) =>
						prev.map((m) =>
							m.id === assistantId ? { ...m, isStreaming: false } : m
						)
					);
				}
			}
		} catch (error) {
			console.error("Chat error:", error);
			setMessages((prev) =>
				prev.map((m) =>
					m.id === assistantId
						? {
								...m,
								content: "Sorry, something went wrong.",
								isStreaming: false,
						  }
						: m
				)
			);
		} finally {
			setIsLoading(false);
		}
	};

	const loadHistorySession = async (chatId: number) => {
		setIsLoading(true);
		const res = await getChatMessagesService(chatId);
		if (res.success && res.data) {
			const formattedMessages = res.data.messages.map((m: any) => ({
				id: String(m.id),
				content: m.content,
				role: m.role as "user" | "assistant",
			}));
			setMessages(formattedMessages);
			setActiveChatId(chatId);
		}
		setIsLoading(false);
		setView("chat");
	};

	if (!isOpen) return null;

	return (
		<div className='flex flex-col h-full bg-background border-l border-border animate-slide-in'>
			{/* Header */}
			<div className='p-4 flex items-center justify-between border-b border-border'>
				<div className='flex items-center gap-2'>
					<h3 className='font-semibold text-foreground'>
						{view === "chat" ? "AI Assistant" : "Chat History"}
					</h3>
				</div>
				<div className='flex items-center gap-1'>
					<button
						onClick={() => setView(view === "chat" ? "history" : "chat")}
						className='p-1.5 rounded-lg hover:bg-background-muted transition-colors text-foreground-muted hover:text-foreground'
						title={view === "chat" ? "See history" : "Back to chat"}
					>
						{view === "chat" ? (
							<ClockCounterClockwise className='h-4 w-4' />
						) : (
							<ChatCircleText className='h-4 w-4' />
						)}
					</button>
					<button
						onClick={onToggle}
						className='p-1.5 rounded-lg hover:bg-background-muted transition-colors text-foreground-muted hover:text-foreground'
					>
						<X className='h-4 w-4' />
					</button>
				</div>
			</div>

			{/* Content */}
			<div className='flex-1 overflow-y-auto max-h-[calc(100vh-220px)]'>
				{view === "history" ? (
					<div className='p-4 space-y-2'>
						{history.length === 0 ? (
							<div className='text-center py-10'>
								<p className='text-sm text-foreground-muted'>No history yet</p>
							</div>
						) : (
							history.map((session) => (
								<button
									key={session.id}
									onClick={() => loadHistorySession(session.id)}
									className='w-full text-left p-3 rounded-xl hover:bg-background-muted transition-all border border-transparent hover:border-border group'
								>
									<p className='text-sm font-medium text-foreground truncate'>
										{session.last_message || "New Chat"}
									</p>
									<p className='text-[10px] text-foreground-muted mt-1'>
										{new Date(session.updated_at).toLocaleDateString()}
									</p>
								</button>
							))
						)}
					</div>
				) : (
					<div className='p-4 space-y-4 h-full'>
						{messages.length === 0 ? (
							<EmptyState />
						) : (
							messages.map((msg) => (
								<MessageBubble key={msg.id} message={msg} />
							))
						)}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			{/* Input Area */}
			<div className='border-t border-border bg-background-surface'>
				{selectedDocuments.length > 0 && (
					<div className='flex flex-wrap gap-2 mb-3'>
						{selectedDocuments.map((docId) => {
							const doc = availableDocs.find((d) => d.id === docId);
							return doc ? (
								<span
									key={docId}
									className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-light text-primary text-xs font-medium'
								>
									<FileText className='h-3.5 w-3.5' weight='duotone' />
									{doc.filename}
									<button
										onClick={() => removeDocument(docId)}
										className='hover:text-primary-hover'
									>
										<X className='h-3 w-3' />
									</button>
								</span>
							) : null;
						})}
					</div>
				)}

				<div className='relative'>
					{showMentions && filteredDocs.length > 0 && (
						<div className='absolute bottom-full left-0 right-0 mb-2 bg-background-surface border border-border rounded-xl shadow-lg overflow-hidden animate-scale-in z-50'>
							<div className='p-2 border-b border-border bg-background-muted'>
								<span className='text-xs font-medium text-foreground-muted'>
									Documents
								</span>
							</div>
							<div className='max-h-40 overflow-y-auto'>
								{filteredDocs.map((doc) => (
									<button
										key={doc.id}
										onClick={() => insertMention(doc)}
										className='w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-background transition-colors text-left'
									>
										<FileText
											className='h-4 w-4 text-foreground-muted'
											weight='duotone'
										/>
										{doc.filename}
									</button>
								))}
							</div>
						</div>
					)}

					<div className='flex items-start gap-2 p-2 rounded-xl bg-background-muted border border-transparent focus-within:bg-background transition-all min-h-24'>
						<button
							onClick={onUploadClick}
							className='p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background transition-colors flex-shrink-0'
							title='Attach document'
						>
							<Paperclip className='h-5 w-5' />
						</button>

						<textarea
							ref={inputRef}
							value={input}
							onChange={handleInputChange}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey && !showMentions) {
									e.preventDefault();
									handleSend();
								}
								if (e.key === "Escape" && showMentions) setShowMentions(false);
							}}
							placeholder='Ask anything... (@ to mention docs)'
							rows={1}
							className='mt-2 flex-1 bg-transparent text-foreground text-sm placeholder:text-foreground-muted focus:outline-none resize-none'
						/>

						<button
							onClick={handleSend}
							disabled={!input.trim() || isLoading}
							className={cn(
								"p-2 rounded-lg transition-all flex-shrink-0",
								input.trim() && !isLoading
									? "bg-primary text-primary-foreground hover:bg-primary-hover"
									: "text-foreground-muted cursor-not-allowed"
							)}
						>
							<PaperPlaneRight className='h-5 w-5' weight='fill' />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function EmptyState() {
	return (
		<div className='flex flex-col items-center justify-center h-full text-center px-4'>
			<div className='w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center mb-4'>
				<Robot className='h-7 w-7 text-primary' weight='duotone' />
			</div>
			<h3 className='font-semibold text-foreground mb-1'>How can I help?</h3>
			<p className='text-sm text-foreground-muted'>
				Ask me to brainstorm, edit, or improve your writing.
			</p>
		</div>
	);
}

function MessageBubble({ message }: { message: Message }) {
	const isUser = message.role === "user";
	return (
		<div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
			<div
				className={cn(
					"w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
					isUser ? "bg-primary" : "bg-secondary-light"
				)}
			>
				{isUser ? (
					<User className='h-4 w-4 text-primary-foreground' weight='fill' />
				) : (
					<Robot className='h-4 w-4 text-foreground' weight='duotone' />
				)}
			</div>
			<div
				className={cn(
					"max-w-[85%] rounded-2xl text-sm leading-relaxed",
					isUser
						? "px-4 py-3 bg-primary text-primary-foreground rounded-tr-sm"
						: "bg-background-muted text-foreground rounded-tl-sm"
				)}
			>
				{message.isStreaming && !message.content ? (
					<div className='flex gap-1.5 py-1'>
						<span className='w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-pulse' />
						<span className='w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-pulse [animation-delay:200ms]' />
						<span className='w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-pulse [animation-delay:400ms]' />
					</div>
				) : (
					<div className='streamdown-content'>
						<Streamdown>{message.content}</Streamdown>
					</div>
				)}
			</div>
		</div>
	);
}
