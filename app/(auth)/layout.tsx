import { ReactNode } from "react";
import { FileText } from "lucide-react";

interface AuthLayoutProps {
	children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className='min-h-screen bg-background flex'>
			{/* Left side - Branding */}
			<div className='hidden lg:flex lg:w-1/2 bg-background-surface items-center justify-center p-12 border-r border-border'>
				<div className='max-w-md text-center'>
					<div className='w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6'>
						<FileText className='h-8 w-8 text-accent-foreground' />
					</div>
					<h1 className='text-3xl font-bold text-foreground mb-4'>AI Writer</h1>
					<p className='text-lg text-foreground-secondary'>
						Write with your unique voice. Build personas, brainstorm with AI,
						and create content faster.
					</p>
				</div>
			</div>

			{/* Right side - Form */}
			<div className='flex-1 flex items-center justify-center p-8'>
				<div className='w-full max-w-md'>{children}</div>
			</div>
		</div>
	);
}
