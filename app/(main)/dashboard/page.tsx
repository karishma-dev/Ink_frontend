"use client";

import Link from "next/link";
import {
	PenNib,
	Files,
	Plus,
	Clock,
	ArrowRight,
	SpinnerGap,
} from "@phosphor-icons/react";
import { useDrafts } from "@/features/drafts/hooks/useDrafts";
import { formatRelativeTime } from "@/lib/utils";

export default function DashboardPage() {
	const { data, isLoading } = useDrafts(3, 0);
	const recentDrafts = data?.drafts || [];

	return (
		<div className='p-6 mx-auto space-y-8 animate-fade-up'>
			{/* Welcome Section */}
			<section className='space-y-2'>
				<h1 className='text-3xl font-bold text-foreground tracking-tight'>
					Welcome back
				</h1>
				<p className='text-foreground-muted font-medium'>
					Continue where you left off or start something new.
				</p>
			</section>

			{/* Quick Actions */}
			<section className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
				<Link
					href='/write'
					className='group card-interactive p-6 rounded-2xl bg-primary text-primary-foreground shadow-sm'
				>
					<div className='flex items-center gap-4'>
						<div className='w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center transition-transform group-hover:scale-110'>
							<Plus className='h-6 w-6' weight='bold' />
						</div>
						<div className='flex-1'>
							<h3 className='font-bold text-lg'>New Draft</h3>
							<p className='text-sm opacity-80 font-medium'>
								Start writing something new
							</p>
						</div>
						<ArrowRight
							className='h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all'
							weight='bold'
						/>
					</div>
				</Link>

				<Link
					href='/drafts'
					className='group card-interactive p-6 rounded-2xl bg-background-surface border border-border shadow-sm'
				>
					<div className='flex items-center gap-4'>
						<div className='w-12 h-12 rounded-xl bg-secondary-light flex items-center justify-center transition-transform group-hover:scale-110'>
							<Files className='h-6 w-6 text-foreground' weight='duotone' />
						</div>
						<div className='flex-1'>
							<h3 className='font-bold text-lg text-foreground'>
								View Library
							</h3>
							<p className='text-sm text-foreground-muted font-medium'>
								{isLoading ? "Loading..." : `${data?.total || 0} drafts saved`}
							</p>
						</div>
						<ArrowRight
							className='h-5 w-5 text-foreground-muted opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all'
							weight='bold'
						/>
					</div>
				</Link>
			</section>

			{/* Recent Drafts */}
			<section className='space-y-4'>
				<div className='flex items-center justify-between'>
					<h2 className='text-xl font-bold text-foreground'>Recent Drafts</h2>
					<Link
						href='/drafts'
						className='text-sm text-primary hover:text-primary-hover font-bold transition-colors flex items-center gap-1'
					>
						View all library <ArrowRight weight='bold' />
					</Link>
				</div>

				<div className='grid gap-3'>
					{isLoading ? (
						<div className='flex items-center justify-center py-12'>
							<SpinnerGap className='h-8 w-8 text-primary animate-spin' />
						</div>
					) : (
						recentDrafts.map((draft: any, index: number) => (
							<Link
								key={draft.id}
								href={`/write?id=${draft.id}`}
								className='group card-interactive flex items-center gap-4 p-5 rounded-2xl bg-background-surface border border-border shadow-sm hover:border-primary/50 transition-all'
								style={{ animationDelay: `${index * 50}ms` }}
							>
								<div className='w-10 h-10 rounded-lg bg-secondary-light flex items-center justify-center transition-transform group-hover:scale-110'>
									<PenNib
										className='h-5 w-5 text-foreground-secondary'
										weight='duotone'
									/>
								</div>
								<div className='flex-1 min-w-0'>
									<h3 className='font-bold text-foreground truncate group-hover:text-primary transition-colors'>
										{draft.title || "Untitled Document"}
									</h3>
									<p className='text-sm text-foreground-muted flex items-center gap-1.5 font-medium'>
										<Clock className='h-3.5 w-3.5' />
										{formatRelativeTime(draft.updated_at)}
									</p>
								</div>
								<ArrowRight
									className='h-5 w-5 text-foreground-muted opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all'
									weight='bold'
								/>
							</Link>
						))
					)}

					{!isLoading && recentDrafts.length === 0 && (
						<div className='text-center py-16 rounded-2xl border-2 border-dashed border-border bg-background-surface/50'>
							<PenNib
								className='h-12 w-12 text-foreground-muted/40 mx-auto mb-4'
								weight='duotone'
							/>
							<h3 className='text-lg font-bold text-foreground mb-1'>
								No drafts yet
							</h3>
							<p className='text-sm text-foreground-muted mb-6 font-medium'>
								Start writing your first AI-assisted document.
							</p>
							<Link
								href='/write'
								className='inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary-hover transition-all shadow-sm'
							>
								<Plus className='h-4 w-4' weight='bold' />
								Create Your First Draft
							</Link>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
