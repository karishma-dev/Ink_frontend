import { RegisterForm } from "@/features/auth";

export default function RegisterPage() {
	return (
		<div>
			<div className='text-center mb-8'>
				<h2 className='text-2xl font-bold text-foreground'>
					Create an account
				</h2>
				<p className='text-foreground-secondary mt-2'>
					Get started with AI Writer today
				</p>
			</div>
			<RegisterForm />
		</div>
	);
}
