"use client";

import { useState } from "react";
import Link from "next/link";
import {
	FileText,
	Plus,
	Clock,
	Trash,
	PencilSimple,
	MagnifyingGlass,
	WarningCircle,
} from "@phosphor-icons/react";
import { Button, useToast } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";
import { useDrafts, useDeleteDraft } from "@/features/drafts/hooks/useDrafts";

export default function DraftsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const { data, isLoading, error } = useDrafts();
	const deleteDraft = useDeleteDraft();
	const { showToast } = useToast();

	const drafts = data?.drafts || [];

	const filteredDrafts = drafts.filter(
		(d: any) =>
			d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(d.content && d.content.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	const handleDelete = async (id: number) => {
		if (!confirm("Are you sure you want to delete this draft?")) return;
		try {
			await deleteDraft.mutateAsync(id);
			showToast("success", "Draft deleted successfully");
		} catch (err: any) {
			showToast("error", err.message || "Failed to delete draft");
		}
	};

	if (error) {
		return (
			<div className='flex flex-col items-center justify-center py-20 animate-fade-up'>
				<WarningCircle className='h-12 w-12 text-error mb-4' />
				<h2 className='text-xl font-bold text-foreground'>
					Failed to load drafts
				</h2>
				<p className='text-foreground-muted mb-6'>
					Please check your connection and try again.
				</p>
				<Button onClick={() => window.location.reload()}>Retry</Button>
			</div>
		);
	}

	return (
		<div className='p-6 mx-auto space-y-8 animate-fade-up'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground tracking-tight'>
						Drafts
					</h1>
					<p className='text-foreground-muted mt-1 font-medium'>
						{isLoading
							? "Loading your writing..."
							: `${drafts.length} drafts saved in your library`}
					</p>
				</div>
				<Link href='/write'>
					<Button className='rounded-xl px-5 py-6 shadow-sm'>
						<Plus className='h-5 w-5' weight='bold' />
						<span className='ml-2'>Create New</span>
					</Button>
				</Link>
			</div>

			{/* Search */}
			<div className='relative group'>
				<MagnifyingGlass className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted group-focus-within:text-primary transition-colors' />
				<input
					type='text'
					placeholder='Search your drafts...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='w-full pl-12 pr-4 py-4 rounded-2xl bg-background-surface border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm'
				/>
			</div>

			{/* Drafts List */}
			{isLoading ? (
				<DraftsSkeleton />
			) : filteredDrafts.length === 0 ? (
				<div className='text-center py-20 rounded-2xl border-2 border-dashed border-border bg-background-surface/50'>
					<FileText
						className='h-16 w-16 text-foreground-muted/40 mx-auto mb-6'
						weight='duotone'
					/>
					<h2 className='text-xl font-bold text-foreground mb-2'>
						{searchQuery ? "No results found" : "Ready to start writing?"}
					</h2>
					<p className='text-foreground-muted mb-8 max-w-sm mx-auto font-medium'>
						{searchQuery
							? "We couldn't find any drafts matching your search. Try another keyword."
							: "Your library is empty. Create your first AI-assisted draft with one click."}
					</p>
					{!searchQuery && (
						<Link href='/write'>
							<Button className='rounded-xl px-8 py-6'>
								<span className='mr-2'>Start Your First Draft</span>
								<Plus className='h-5 w-5' weight='bold' />
							</Button>
						</Link>
					)}
				</div>
			) : (
				<div className='grid gap-4'>
					{filteredDrafts.map((draft: any, index: number) => (
						<div
							key={draft.id}
							className='group card-interactive flex items-start gap-5 p-6 rounded-2xl bg-background-surface border border-border hover:border-primary/50 transition-all'
							style={{ animationDelay: `${index * 50}ms` }}
						>
							<div className='w-12 h-12 rounded-xl bg-secondary-light flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110'>
								<FileText
									className='h-6 w-6 text-foreground-secondary'
									weight='duotone'
								/>
							</div>

							<div className='flex-1 min-w-0'>
								<h3 className='text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors'>
									{draft.title || "Untitled Document"}
								</h3>
								<p className='text-sm text-foreground-muted mt-1 line-clamp-2 font-medium'>
									{draft.content || "No content yet..."}
								</p>
								<div className='flex items-center gap-4 mt-4'>
									<div className='flex items-center gap-1.5 text-xs text-foreground-muted font-semibold bg-background rounded-lg'>
										<Clock className='h-4 w-4' weight='duotone' />
										<span>{formatRelativeTime(draft.updated_at)}</span>
									</div>
								</div>
							</div>

							<div className='flex gap-2 transition-all'>
								<Link href={`/write?id=${draft.id}`}>
									<Button
										variant='ghost'
										size='sm'
										className='w-10 h-10 p-0 rounded-xl hover:bg-primary-light hover:text-primary'
									>
										<PencilSimple className='h-5 w-5' weight='bold' />
									</Button>
								</Link>
								<Button
									variant='ghost'
									size='sm'
									className='w-10 h-10 p-0 rounded-xl text-error hover:bg-error-light'
									onClick={() => handleDelete(draft.id)}
									disabled={deleteDraft.isPending}
								>
									<Trash className='h-5 w-5' weight='bold' />
								</Button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function DraftsSkeleton() {
	return (
		<div className='space-y-4'>
			{[...Array(3)].map((_, i) => (
				<div
					key={i}
					className='h-32 rounded-2xl bg-background-surface border border-border animate-pulse'
				/>
			))}
		</div>
	);
}
