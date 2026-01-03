"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SliderProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
	label?: string;
	min?: number;
	max?: number;
	showValue?: boolean;
	valueLabel?: string;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
	(
		{
			className,
			label,
			min = 1,
			max = 10,
			showValue = true,
			valueLabel,
			value,
			id,
			...props
		},
		ref
	) => {
		const sliderId = id || label?.toLowerCase().replace(/\s+/g, "-");

		return (
			<div className='w-full'>
				<div className='flex items-center justify-between mb-2'>
					{label && (
						<label
							htmlFor={sliderId}
							className='text-sm font-medium text-foreground'
						>
							{label}
						</label>
					)}
					{showValue && (
						<span className='text-sm font-medium text-primary'>
							{value}
							{valueLabel && ` ${valueLabel}`}
						</span>
					)}
				</div>
				<input
					ref={ref}
					type='range'
					id={sliderId}
					min={min}
					max={max}
					value={value}
					className={cn(
						`w-full h-2 rounded-full appearance-none cursor-pointer
            bg-background-muted
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary
            [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`,
						className
					)}
					{...props}
				/>
				<div className='flex justify-between mt-1'>
					<span className='text-xs text-foreground-muted'>{min}</span>
					<span className='text-xs text-foreground-muted'>{max}</span>
				</div>
			</div>
		);
	}
);

Slider.displayName = "Slider";

export { Slider };
