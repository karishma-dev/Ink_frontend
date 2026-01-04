"use client";

import { use } from "react";
import { Card } from "@/components/ui";
import { PersonaForm, usePersona } from "@/features/personas";

interface EditPersonaPageProps {
	params: Promise<{ id: string }>;
}

export default function EditPersonaPage({ params }: EditPersonaPageProps) {
	const { id } = use(params);
	const { data: persona, isLoading, error } = usePersona(id);

	if (isLoading) {
		return (
			<div className='p-6 max-w-3xl mx-auto'>
				<div className='animate-pulse'>
					<div className='h-8 bg-border rounded w-48 mb-2' />
					<div className='h-4 bg-border rounded w-64 mb-6' />
					<div className='h-96 bg-border rounded' />
				</div>
			</div>
		);
	}

	if (error || !persona) {
		return (
			<div className='p-6 text-center'>
				<p className='text-error'>Failed to load persona. Please try again.</p>
			</div>
		);
	}

	return (
		<div className='p-6 mx-auto'>
			<div className='mb-6'>
				<h1 className='text-2xl font-bold text-foreground'>Edit Persona</h1>
				<p className='text-foreground-secondary mt-1'>
					Update your persona settings
				</p>
			</div>

			<Card padding='lg'>
				<PersonaForm mode='edit' persona={persona} />
			</Card>
		</div>
	);
}
