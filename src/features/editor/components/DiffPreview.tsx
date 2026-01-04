"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	applyEdit,
	applyAllEdits,
	clearEdits,
	Edit,
} from "@/store/editorSlice";
import { Check, X, ArrowRight } from "@phosphor-icons/react";
import { RootState } from "@/store";

export function DiffPreview() {
	const dispatch = useAppDispatch();
	const { pendingEdits } = useAppSelector((state: RootState) => state.editor);

	if (pendingEdits.length === 0) return null;

	return (
		<div className='fixed bottom-6 left-1/2 -translate-x-1/2 w-[500px] max-w-[90vw] bg-background-surface border border-border rounded-2xl shadow-xl z-50 animate-fade-up overflow-hidden'>
			<div className='p-4 border-b border-border bg-background-muted flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<div className='w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center'>
						<ArrowRight className='h-4 w-4 text-primary' weight='bold' />
					</div>
					<div>
						<h4 className='text-sm font-semibold text-foreground'>
							AI Suggestions
						</h4>
						<p className='text-xs text-foreground-muted'>
							{pendingEdits.length} changes found
						</p>
					</div>
				</div>
				<div className='flex gap-2'>
					<button
						onClick={() => dispatch(clearEdits())}
						className='p-2 rounded-lg hover:bg-background transition-colors text-foreground-muted hover:text-foreground'
						title='Dismiss all'
					>
						<X className='h-4 w-4' />
					</button>
				</div>
			</div>

			<div className='max-h-[300px] overflow-y-auto p-4 space-y-4'>
				{pendingEdits.map((edit: Edit, index: number) => (
					<div
						key={index}
						className='space-y-2 pb-4 border-b border-border last:border-0'
					>
						<div className='flex items-start gap-3'>
							<div className='flex-1 space-y-1'>
								<div className='p-2 rounded-lg bg-red-50 text-red-700 text-xs font-mono line-through opacity-70 border border-red-100'>
									{edit.original}
								</div>
								<div className='p-2 rounded-lg bg-green-50 text-green-700 text-xs font-mono border border-green-100'>
									{edit.replacement}
								</div>
							</div>
							<div className='flex flex-col gap-1'>
								<button
									onClick={() => dispatch(applyEdit(index))}
									className='p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-all'
									title='Accept change'
								>
									<Check className='h-4 w-4' weight='bold' />
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className='p-3 bg-background-muted border-t border-border flex justify-end gap-3'>
				<button
					onClick={() => dispatch(clearEdits())}
					className='px-4 py-2 rounded-lg text-sm font-medium text-foreground-muted hover:text-foreground transition-colors'
				>
					Discard All
				</button>
				<button
					onClick={() => dispatch(applyAllEdits())}
					className='px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-all shadow-sm'
				>
					Accept All
				</button>
			</div>
		</div>
	);
}
