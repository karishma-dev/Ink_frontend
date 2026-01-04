"use client";

import Link from "next/link";
import { Plus, UserCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui";
import { PersonaList } from "@/features/personas";

export default function PersonasPage() {
	return (
		<div className='p-6 mx-auto space-y-6 animate-fade-up'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-bold text-foreground tracking-tight'>
						Personas
					</h1>
					<p className='text-foreground-muted mt-1'>
						Define your unique writing voices
					</p>
				</div>
				<Link href='/personas/new'>
					<Button>
						<Plus className='h-4 w-4' weight='bold' />
						<span className='ml-1.5'>Create Persona</span>
					</Button>
				</Link>
			</div>

			{/* Persona List */}
			<PersonaList />
		</div>
	);
}
