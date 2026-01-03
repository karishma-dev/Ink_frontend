"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, label, error, hint, id, ...props }, ref) => {
		const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

		return (
			<div className='w-full'>
				{label && (
					<label
						htmlFor={inputId}
						className='block text-sm font-medium text-foreground mb-1.5'
					>
						{label}
					</label>
				)}
				<input
					ref={ref}
					id={inputId}
					className={cn(
						`w-full h-10 px-3 rounded-lg border bg-background-surface
            text-foreground placeholder:text-foreground-muted
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed`,
						error
							? "border-error focus:ring-error"
							: "border-border hover:border-border-hover",
						className
					)}
					{...props}
				/>
				{hint && !error && (
					<p className='mt-1.5 text-xs text-foreground-muted'>{hint}</p>
				)}
				{error && <p className='mt-1.5 text-xs text-error'>{error}</p>}
			</div>
		);
	}
);

Input.displayName = "Input";

export { Input };
