"use client";

import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextAreaProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
	hint?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	({ className, label, error, hint, id, ...props }, ref) => {
		const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

		return (
			<div className='w-full'>
				{label && (
					<label
						htmlFor={textareaId}
						className='block text-sm font-medium text-foreground mb-1.5'
					>
						{label}
					</label>
				)}
				<textarea
					ref={ref}
					id={textareaId}
					className={cn(
						`w-full min-h-[100px] px-3 py-2 rounded-lg border bg-background-surface
            text-foreground placeholder:text-foreground-muted
            transition-colors duration-200 resize-y
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

TextArea.displayName = "TextArea";

export { TextArea };
