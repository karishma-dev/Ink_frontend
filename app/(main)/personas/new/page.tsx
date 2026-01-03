import { Card } from "@/components/ui";
import { PersonaForm } from "@/features/personas";

export default function NewPersonaPage() {
	return (
		<div className='p-6 max-w-3xl mx-auto'>
			<div className='mb-6'>
				<h1 className='text-2xl font-bold text-foreground'>Create Persona</h1>
				<p className='text-foreground-secondary mt-1'>
					Define a new writing style for your content
				</p>
			</div>

			<Card padding='lg'>
				<PersonaForm mode='create' />
			</Card>
		</div>
	);
}
