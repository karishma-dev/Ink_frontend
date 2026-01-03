"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "ghost" | "danger";
	size?: "sm" | "md" | "lg";
	isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant = "primary",
			size = "md",
			isLoading,
			disabled,
			children,
			...props
		},
		ref
	) => {
		const baseStyles = `
      inline-flex items-center justify-center gap-2 
      font-medium rounded-lg transition-all duration-200
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

		const variants = {
			primary:
				"bg-accent text-accent-foreground hover:bg-accent-hover active:scale-[0.98]",
			secondary:
				"bg-background-surface text-foreground border border-border hover:bg-background-elevated hover:border-border-hover",
			ghost:
				"text-foreground-secondary hover:bg-background-surface hover:text-foreground",
			danger: "bg-error text-white hover:bg-red-700 active:scale-[0.98]",
		};

		const sizes = {
			sm: "h-8 px-3 text-sm",
			md: "h-10 px-4 text-sm",
			lg: "h-12 px-6 text-base",
		};

		return (
			<button
				ref={ref}
				className={cn(baseStyles, variants[variant], sizes[size], className)}
				disabled={disabled || isLoading}
				{...props}
			>
				{isLoading && (
					<svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
						<circle
							className='opacity-25'
							cx='12'
							cy='12'
							r='10'
							stroke='currentColor'
							strokeWidth='4'
							fill='none'
						/>
						<path
							className='opacity-75'
							fill='currentColor'
							d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
						/>
					</svg>
				)}
				{children}
			</button>
		);
	}
);

Button.displayName = "Button";

export { Button };
