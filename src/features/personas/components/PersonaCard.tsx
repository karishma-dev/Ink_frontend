"use client";

import Link from "next/link";
import { Edit2, Trash2, Users, Check } from "lucide-react";
import { Card, Badge, Button, useToast } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";
import { Persona } from "../types";
import {
	useActivePersona,
	useSetActivePersona,
	useClearActivePersona,
} from "../hooks/useActivePersona";

interface PersonaCardProps {
	persona: Persona;
	onDelete: (id: string) => void;
	isDeleting: boolean;
}

export function PersonaCard({
	persona,
	onDelete,
	isDeleting,
}: PersonaCardProps) {
	const { showToast } = useToast();
	const { data: activePersonaId } = useActivePersona();
	const setActivePersona = useSetActivePersona();
	const clearActivePersona = useClearActivePersona();

	const isActive = activePersonaId === persona.id;

	const handleSetActive = async () => {
		try {
			if (isActive) {
				await clearActivePersona.mutateAsync();
				showToast("success", "Active persona cleared");
			} else {
				await setActivePersona.mutateAsync(persona.id);
				showToast("success", `"${persona.name}" set as active persona`);
			}
		} catch {
			showToast("error", "Failed to update active persona");
		}
	};

	const getLevelLabel = (level: number): string => {
		if (level <= 3) return "Low";
		if (level <= 6) return "Medium";
		return "High";
	};

	return (
		<Card hover className='group relative'>
			{isActive && (
				<div className='absolute top-3 right-3'>
					<Badge variant='success' className='gap-1'>
						<Check className='h-3 w-3' />
						Active
					</Badge>
				</div>
			)}
			<div className='flex items-start justify-between mb-3'>
				<div className='flex items-center gap-3'>
					<div className='w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center'>
						<Users className='h-5 w-5 text-accent' />
					</div>
					<div>
						<h3 className='font-semibold text-foreground'>{persona.name}</h3>
						<p className='text-xs text-foreground-muted'>
							{formatRelativeTime(persona.created_at)}
						</p>
					</div>
				</div>

				<div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
					<Link href={`/personas/${persona.id}/edit`}>
						<Button variant='ghost' size='sm' className='p-2'>
							<Edit2 className='h-4 w-4' />
						</Button>
					</Link>
					<Button
						variant='ghost'
						size='sm'
						className='p-2 text-error hover:bg-error-light'
						onClick={() => onDelete(persona.id)}
						disabled={isDeleting}
					>
						<Trash2 className='h-4 w-4' />
					</Button>
				</div>
			</div>

			<p className='text-sm text-foreground-secondary mb-4 line-clamp-2'>
				{persona.description}
			</p>

			{/* Stats */}
			<div className='flex flex-wrap gap-2 mb-4'>
				<Badge variant='info'>
					Formality: {getLevelLabel(persona.formality_level)}
				</Badge>
				<Badge variant='success'>
					Creativity: {getLevelLabel(persona.creativity_level)}
				</Badge>
				<Badge>{persona.audience}</Badge>
			</div>

			{/* Topics */}
			{persona.topics.length > 0 && (
				<div className='flex flex-wrap gap-1'>
					{persona.topics.slice(0, 3).map((topic) => (
						<span
							key={topic}
							className='text-xs px-2 py-0.5 rounded bg-background-muted text-foreground-secondary'
						>
							{topic}
						</span>
					))}
					{persona.topics.length > 3 && (
						<span className='text-xs text-foreground-muted'>
							+{persona.topics.length - 3} more
						</span>
					)}
				</div>
			)}

			{/* Actions */}
			<div className='mt-4 pt-3 border-t border-border'>
				<Button
					variant={isActive ? "secondary" : "primary"}
					size='sm'
					onClick={handleSetActive}
					disabled={setActivePersona.isPending || clearActivePersona.isPending}
					className='w-full'
				>
					{isActive ? "Clear as Active" : "Set as Active"}
				</Button>
			</div>
		</Card>
	);
}
