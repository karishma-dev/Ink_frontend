"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Plus, Clock, Trash2, Edit } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";

// Mock drafts data - TODO: Connect to backend
const mockDrafts = [
	{
		id: 1,
		title: "Blog Post About AI",
		content: "Introduction to artificial intelligence...",
		updated_at: "2026-01-03T10:00:00Z",
	},
	{
		id: 2,
		title: "Marketing Copy",
		content: "Our product helps you...",
		updated_at: "2026-01-02T15:30:00Z",
	},
	{
		id: 3,
		title: "Technical Documentation",
		content: "This guide explains how to...",
		updated_at: "2026-01-01T09:00:00Z",
	},
];

export default function DraftsPage() {
	const [drafts, setDrafts] = useState(mockDrafts);

	const handleDelete = (id: number) => {
		if (confirm("Are you sure you want to delete this draft?")) {
			setDrafts((prev) => prev.filter((d) => d.id !== id));
		}
	};

	return (
		<div className='min-h-screen bg-background'>
			{/* Header */}
			<header className='bg-background-surface border-b border-border'>
				<div className='max-w-5xl mx-auto px-6 py-4 flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<Link href='/write' className='flex items-center gap-2'>
							<FileText className='h-5 w-5 text-primary' />
							<span className='font-semibold text-foreground'>AI Writer</span>
						</Link>
						<span className='text-foreground-muted'>/</span>
						<span className='text-foreground font-medium'>Drafts</span>
					</div>
					<Link href='/write'>
						<Button>
							<Plus className='h-4 w-4' />
							New Draft
						</Button>
					</Link>
				</div>
			</header>

			{/* Content */}
			<main className='max-w-5xl mx-auto px-6 py-8'>
				{drafts.length === 0 ? (
					<div className='text-center py-16'>
						<FileText className='h-12 w-12 text-foreground-muted mx-auto mb-4' />
						<h2 className='text-xl font-semibold text-foreground mb-2'>
							No drafts yet
						</h2>
						<p className='text-foreground-secondary mb-6'>
							Start writing to create your first draft.
						</p>
						<Link href='/write'>
							<Button>
								<Plus className='h-4 w-4' />
								Start Writing
							</Button>
						</Link>
					</div>
				) : (
					<div className='grid gap-4'>
						{drafts.map((draft) => (
							<Card key={draft.id} hover className='group'>
								<div className='flex items-start justify-between'>
									<div className='flex-1 min-w-0'>
										<h3 className='font-semibold text-foreground truncate'>
											{draft.title || "Untitled"}
										</h3>
										<p className='text-sm text-foreground-secondary mt-1 line-clamp-2'>
											{draft.content}
										</p>
										<div className='flex items-center gap-1 mt-2 text-xs text-foreground-muted'>
											<Clock className='h-3 w-3' />
											<span>{formatRelativeTime(draft.updated_at)}</span>
										</div>
									</div>

									<div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4'>
										<Link href={`/write?draft=${draft.id}`}>
											<Button variant='ghost' size='sm' className='p-2'>
												<Edit className='h-4 w-4' />
											</Button>
										</Link>
										<Button
											variant='ghost'
											size='sm'
											className='p-2 text-error hover:bg-error-light'
											onClick={() => handleDelete(draft.id)}
										>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>
								</div>
							</Card>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
