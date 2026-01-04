"use client";

import { useState } from "react";
import { ChevronDown, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePersonas } from "@/features/personas/hooks/usePersonas";
import { Persona } from "@/features/personas/types";

interface PersonaSelectorProps {
	selectedPersona: Persona | null;
	onSelect: (persona: Persona | null) => void;
}

export function PersonaSelector({
	selectedPersona,
	onSelect,
}: PersonaSelectorProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { data: personasData } = usePersonas();
	const personas = personasData?.personas || [];

	return (
		<div className='relative'>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background-surface border border-border hover:border-border-hover transition-colors'
			>
				<User className='h-4 w-4 text-foreground-muted' />
				<span className='text-sm text-foreground'>
					{selectedPersona ? selectedPersona.name : "Select Persona"}
				</span>
				<ChevronDown
					className={cn(
						"h-4 w-4 text-foreground-muted transition-transform",
						isOpen && "rotate-180"
					)}
				/>
			</button>

			{isOpen && (
				<div className='absolute top-full left-0 mt-2 w-64 bg-background-surface border border-border rounded-lg shadow-lg z-20 animate-fade-in'>
					<div className='p-2 space-y-1'>
						<button
							onClick={() => {
								onSelect(null);
								setIsOpen(false);
							}}
							className={cn(
								"w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
								!selectedPersona
									? "bg-accent-light text-accent"
									: "hover:bg-background-elevated text-foreground-secondary"
							)}
						>
							No persona (default voice)
						</button>
						{personas.map((persona: Persona) => (
							<button
								key={persona.id}
								onClick={() => {
									onSelect(persona);
									setIsOpen(false);
								}}
								className={cn(
									"w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
									selectedPersona?.id === persona.id
										? "bg-accent-light text-accent"
										: "hover:bg-background-elevated"
								)}
							>
								<p className='font-medium text-foreground'>{persona.name}</p>
								<p className='text-xs text-foreground-muted truncate'>
									{persona.description}
								</p>
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
