"use client";

import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
	value: string;
	label: string;
}

export interface SelectProps
	extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
	label?: string;
	error?: string;
	options: SelectOption[];
	placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ className, label, error, options, placeholder, id, ...props }, ref) => {
		const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

		return (
			<div className='w-full'>
				{label && (
					<label
						htmlFor={selectId}
						className='block text-sm font-medium text-foreground mb-1.5'
					>
						{label}
					</label>
				)}
				<div className='relative'>
					<select
						ref={ref}
						id={selectId}
						className={cn(
							`w-full h-10 px-3 pr-10 rounded-lg border bg-background-surface
              text-foreground appearance-none cursor-pointer
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed`,
							error
								? "border-error focus:ring-error"
								: "border-border hover:border-border-hover",
							className
						)}
						{...props}
					>
						{placeholder && (
							<option value='' disabled>
								{placeholder}
							</option>
						)}
						{options.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted pointer-events-none' />
				</div>
				{error && <p className='mt-1.5 text-xs text-error'>{error}</p>}
			</div>
		);
	}
);

Select.displayName = "Select";

export { Select };
