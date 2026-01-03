"use client";

import { useState, FormEvent, KeyboardEvent } from "react";
import { Send, ChevronDown, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { usePersonas } from "@/features/personas/hooks/usePersonas";
import { Persona } from "@/features/personas/types";

interface ChatInputProps {
	onSend: (message: string, personaId: string | null) => void;
	isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
	const [message, setMessage] = useState("");
	const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
	const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);

	const { data: personasData } = usePersonas();
	const personas = personasData?.personas || [];

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (message.trim() && !isLoading) {
			onSend(message.trim(), selectedPersona?.id || null);
			setMessage("");
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	return (
		<div className='border-t border-border bg-background-surface p-4'>
			<div className='max-w-3xl mx-auto'>
				{/* Persona Selector */}
				<div className='mb-3 relative'>
					<button
						type='button'
						onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
						className='flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-background-muted hover:bg-border transition-colors'
					>
						<User className='h-4 w-4 text-foreground-muted' />
						<span className='text-foreground-secondary'>
							{selectedPersona ? selectedPersona.name : "No persona"}
						</span>
						<ChevronDown
							className={cn(
								"h-4 w-4 text-foreground-muted transition-transform",
								showPersonaDropdown && "rotate-180"
							)}
						/>
					</button>

					{/* Dropdown */}
					{showPersonaDropdown && (
						<div className='absolute bottom-full left-0 mb-2 w-64 bg-background-surface rounded-lg border border-border shadow-lg z-10 animate-fade-in'>
							<div className='p-2'>
								<button
									type='button'
									onClick={() => {
										setSelectedPersona(null);
										setShowPersonaDropdown(false);
									}}
									className={cn(
										"w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
										!selectedPersona
											? "bg-primary-light text-primary"
											: "hover:bg-background-muted"
									)}
								>
									No persona (default)
								</button>
								{personas.map((persona) => (
									<button
										key={persona.id}
										type='button'
										onClick={() => {
											setSelectedPersona(persona);
											setShowPersonaDropdown(false);
										}}
										className={cn(
											"w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
											selectedPersona?.id === persona.id
												? "bg-primary-light text-primary"
												: "hover:bg-background-muted"
										)}
									>
										<p className='font-medium'>{persona.name}</p>
										<p className='text-xs text-foreground-muted truncate'>
											{persona.description}
										</p>
									</button>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Input Form */}
				<form onSubmit={handleSubmit} className='flex gap-3'>
					<div className='flex-1 relative'>
						<textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder='Type your message...'
							rows={1}
							className='w-full px-4 py-3 rounded-xl border border-border bg-background resize-none
                text-foreground placeholder:text-foreground-muted
                focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                min-h-[48px] max-h-[200px]'
							style={{ height: "auto" }}
							disabled={isLoading}
						/>
					</div>
					<Button
						type='submit'
						size='lg'
						disabled={!message.trim() || isLoading}
						className='px-4'
					>
						<Send className='h-5 w-5' />
					</Button>
				</form>

				<p className='text-xs text-foreground-muted text-center mt-3'>
					Press Enter to send, Shift+Enter for new line
				</p>
			</div>
		</div>
	);
}
