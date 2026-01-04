"use client";

import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui";

interface TagInputProps {
	values: string[];
	onChange: (values: string[]) => void;
	placeholder: string;
	isTextArea?: boolean;
}

export function TagInput({
	values,
	onChange,
	placeholder,
	isTextArea,
}: TagInputProps) {
	const [input, setInput] = useState("");

	const handleKeyDown = (
		e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		if (e.key === "Enter") {
			if (!isTextArea) {
				e.preventDefault();
				addSample();
			}
		}
	};

	const addSample = () => {
		if (input.trim()) {
			if (!values.includes(input.trim())) {
				onChange([...values, input.trim()]);
			}
			setInput("");
		}
	};

	const removeTag = (index: number) => {
		onChange(values.filter((_, i) => i !== index));
	};

	return (
		<div className='space-y-2'>
			<div className='relative'>
				{isTextArea ? (
					<div className='space-y-3'>
						<textarea
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder={placeholder}
							className='w-full px-4 py-3 rounded-xl border border-border bg-background-surface
                text-foreground placeholder:text-foreground-muted min-h-[120px] resize-y
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
						/>
						<div className='flex justify-end'>
							<Button
								type='button'
								variant='secondary'
								size='sm'
								onClick={addSample}
								disabled={!input.trim()}
								className='gap-2'
							>
								<Plus className='h-4 w-4' />
								Add Sample
							</Button>
						</div>
					</div>
				) : (
					<div className='flex gap-2 font-mono'>
						<input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder={placeholder}
							className='flex-1 h-11 px-4 rounded-xl border border-border bg-background-surface
                text-foreground placeholder:text-foreground-muted
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
						/>
						<Button
							type='button'
							variant='secondary'
							onClick={addSample}
							disabled={!input.trim()}
						>
							Add
						</Button>
					</div>
				)}
			</div>
			{values.length > 0 && (
				<div
					className={
						isTextArea ? "space-y-3 pt-2" : "flex flex-wrap gap-2 pt-1"
					}
				>
					{values.map((value, index) => (
						<div
							key={index}
							className={
								isTextArea
									? "group flex items-start gap-3 p-4 rounded-xl bg-background-muted border border-border/50 hover:border-border transition-all"
									: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
							}
						>
							<div className='flex-1 min-w-0'>
								{isTextArea ? (
									<div className='space-y-1'>
										<p className='text-xs font-semibold text-primary uppercase tracking-wider'>
											Sample {index + 1}
										</p>
										<p className='text-sm text-foreground line-clamp-3 leading-relaxed'>
											{value}
										</p>
									</div>
								) : (
									<span className='truncate'>{value}</span>
								)}
							</div>
							<button
								type='button'
								onClick={() => removeTag(index)}
								className='p-1 rounded-lg hover:bg-error/10 text-foreground-muted hover:text-error transition-colors shrink-0'
								title='Remove'
							>
								<X className='h-4 w-4' />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
