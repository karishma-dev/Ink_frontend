"use client";

import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
import { Button, Card, CardHeader, CardTitle } from "@/components/ui";
import { DocumentList, DocumentUpload } from "@/features/documents";

export default function DocumentsPage() {
	return (
		<div className='min-h-screen bg-background'>
			{/* Header */}
			<header className='bg-background-surface border-b border-border'>
				<div className='max-w-5xl mx-auto px-6 py-4 flex items-center gap-4'>
					<Link href='/write'>
						<Button variant='ghost' size='sm' className='p-2'>
							<ArrowLeft className='h-4 w-4' />
						</Button>
					</Link>
					<div className='flex items-center gap-2'>
						<FileText className='h-5 w-5 text-primary' />
						<span className='font-semibold text-foreground'>Documents</span>
					</div>
				</div>
			</header>

			{/* Content */}
			<main className='max-w-5xl mx-auto px-6 py-8'>
				<p className='text-foreground-secondary mb-6'>
					Upload documents to use as context for AI-powered writing assistance.
				</p>

				{/* Upload Section */}
				<Card className='mb-8'>
					<CardHeader>
						<CardTitle>Upload Document</CardTitle>
					</CardHeader>
					<DocumentUpload />
				</Card>

				{/* Documents List */}
				<div>
					<h2 className='text-lg font-semibold text-foreground mb-4'>
						Your Documents
					</h2>
					<DocumentList />
				</div>
			</main>
		</div>
	);
}
