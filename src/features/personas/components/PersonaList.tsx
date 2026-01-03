"use client";

import { Users } from "lucide-react";
import { usePersonas, useDeletePersona } from "../hooks/usePersonas";
import { PersonaCard } from "./PersonaCard";
import { useToast } from "@/components/ui";

export function PersonaList() {
	const { data, isLoading, error } = usePersonas();
	const deletePersona = useDeletePersona();
	const { showToast } = useToast();

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this persona?")) return;

		try {
			await deletePersona.mutateAsync(id);
			showToast("success", "Persona deleted successfully");
		} catch {
			showToast("error", "Failed to delete persona");
		}
	};

	if (isLoading) {
		return <PersonaListSkeleton />;
	}

	if (error) {
		return (
			<div className='text-center py-12'>
				<p className='text-error'>Failed to load personas. Please try again.</p>
			</div>
		);
	}

	if (!data?.personas || data.personas.length === 0) {
		return <EmptyState />;
	}

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
			{data.personas.map((persona) => (
				<PersonaCard
					key={persona.id}
					persona={persona}
					onDelete={handleDelete}
					isDeleting={deletePersona.isPending}
				/>
			))}
		</div>
	);
}

function PersonaListSkeleton() {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
			{[...Array(6)].map((_, i) => (
				<div
					key={i}
					className='bg-background-surface rounded-xl border border-border p-4 animate-pulse'
				>
					<div className='flex items-start gap-3 mb-4'>
						<div className='w-10 h-10 rounded-lg bg-border' />
						<div className='flex-1'>
							<div className='h-5 bg-border rounded w-1/2 mb-2' />
							<div className='h-3 bg-border rounded w-1/3' />
						</div>
					</div>
					<div className='h-4 bg-border rounded w-full mb-2' />
					<div className='h-4 bg-border rounded w-3/4 mb-4' />
					<div className='flex gap-2'>
						<div className='h-6 bg-border rounded-full w-20' />
						<div className='h-6 bg-border rounded-full w-20' />
					</div>
				</div>
			))}
		</div>
	);
}

function EmptyState() {
	return (
		<div className='text-center py-16'>
			<div className='w-16 h-16 rounded-2xl bg-accent-light flex items-center justify-center mx-auto mb-6'>
				<Users className='h-8 w-8 text-accent' />
			</div>
			<h3 className='text-lg font-semibold text-foreground mb-2'>
				No personas yet
			</h3>
			<p className='text-foreground-secondary max-w-md mx-auto'>
				Create your first persona to start generating content with a consistent
				writing style.
			</p>
		</div>
	);
}
