import { LoginForm } from "@/features/auth";

export default function LoginPage() {
	return (
		<div>
			<div className='text-center mb-8'>
				<h2 className='text-2xl font-bold text-foreground'>Welcome back</h2>
				<p className='text-foreground-secondary mt-2'>
					Sign in to continue to AI Writer
				</p>
			</div>
			<LoginForm />
		</div>
	);
}
