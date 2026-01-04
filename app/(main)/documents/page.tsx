"use client";

import { FileText, UploadSimple, MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";
import { DocumentList, DocumentUpload } from "@/features/documents";

export default function DocumentsPage() {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div className='p-6 mx-auto space-y-8 animate-fade-up'>
			{/* Header */}
			<div>
				<h1 className='text-2xl font-bold text-foreground tracking-tight'>
					Documents
				</h1>
				<p className='text-foreground-muted mt-1'>
					Upload documents to use as context for AI-powered writing.
				</p>
			</div>

			{/* Upload Zone */}
			<div className='card-interactive rounded-xl bg-background-surface border border-border p-6'>
				<div className='flex items-start gap-4'>
					<div className='w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0'>
						<UploadSimple className='h-6 w-6 text-primary' weight='duotone' />
					</div>
					<div className='flex-1'>
						<h2 className='font-semibold text-foreground mb-1'>
							Upload Document
						</h2>
						<p className='text-sm text-foreground-muted mb-4'>
							Drag and drop files or click to browse. Supports PDF, DOC, TXT.
						</p>
						<DocumentUpload />
					</div>
				</div>
			</div>

			{/* Search */}
			<div className='relative'>
				<MagnifyingGlass className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted' />
				<input
					type='text'
					placeholder='Search documents...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='w-full pl-12 pr-4 py-3 rounded-xl bg-background-surface border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring transition-shadow'
				/>
			</div>

			{/* Documents List */}
			<div>
				<h2 className='text-lg font-semibold text-foreground mb-4'>
					Your Documents
				</h2>
				<DocumentList />
			</div>
		</div>
	);
}
