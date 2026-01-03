"use client";

import Link from "next/link";
import { Plus, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui";
import { PersonaList } from "@/features/personas";

export default function PersonasPage() {
	return (
		<div className='min-h-screen bg-background'>
			{/* Header */}
			<header className='bg-background-surface border-b border-border'>
				<div className='max-w-5xl mx-auto px-6 py-4 flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<Link href='/write'>
							<Button variant='ghost' size='sm' className='p-2'>
								<ArrowLeft className='h-4 w-4' />
							</Button>
						</Link>
						<div>
							<div className='flex items-center gap-2'>
								<FileText className='h-5 w-5 text-primary' />
								<span className='font-semibold text-foreground'>Personas</span>
							</div>
							<p className='text-sm text-foreground-secondary'>
								Manage your writing styles
							</p>
						</div>
					</div>
					<Link href='/personas/new'>
						<Button>
							<Plus className='h-4 w-4' />
							Create Persona
						</Button>
					</Link>
				</div>
			</header>

			{/* Content */}
			<main className='max-w-5xl mx-auto px-6 py-8'>
				<PersonaList />
			</main>
		</div>
	);
}
