"use client";

import { FileText, Trash, File, FileCode } from "@phosphor-icons/react";
import { Button, Badge, useToast } from "@/components/ui";
import { formatFileSize, formatRelativeTime } from "@/lib/utils";
import { useDocuments, useDeleteDocument } from "../hooks/useDocuments";
import { Document } from "../types";

export function DocumentList() {
	const { data, isLoading, error } = useDocuments();
	const deleteDocument = useDeleteDocument();
	const { showToast } = useToast();

	const handleDelete = async (id: number) => {
		if (!confirm("Are you sure you want to delete this document?")) return;

		try {
			await deleteDocument.mutateAsync(id);
			showToast("success", "Document deleted successfully");
		} catch {
			showToast("error", "Failed to delete document");
		}
	};

	if (isLoading) {
		return <DocumentListSkeleton />;
	}

	if (error) {
		return (
			<div className='text-center py-12'>
				<p className='text-error font-medium'>
					Failed to load documents. Please try again.
				</p>
			</div>
		);
	}

	if (!data?.documents || data.documents.length === 0) {
		return <EmptyState />;
	}

	return (
		<div className='bg-background-surface rounded-xl border border-border overflow-hidden shadow-sm animate-fade-in'>
			<table className='w-full text-left'>
				<thead>
					<tr className='border-b border-border bg-background-surface'>
						<th className='text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4'>
							Name
						</th>
						<th className='text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4'>
							Type
						</th>
						<th className='text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4'>
							Size
						</th>
						<th className='text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4'>
							Status
						</th>
						<th className='text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4'>
							Uploaded
						</th>
						<th className='px-6 py-4'></th>
					</tr>
				</thead>
				<tbody className='divide-y divide-border'>
					{data.documents.map((doc: Document) => (
						<DocumentRow
							key={doc.id}
							document={doc}
							onDelete={handleDelete}
							isDeleting={deleteDocument.isPending}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}

interface DocumentRowProps {
	document: Document;
	onDelete: (id: number) => void;
	isDeleting: boolean;
}

function DocumentRow({ document, onDelete, isDeleting }: DocumentRowProps) {
	const getFileIcon = (type: string) => {
		switch (type) {
			case ".pdf":
				return <File className='h-5 w-5 text-red-500' weight='duotone' />;
			case ".md":
				return <FileCode className='h-5 w-5 text-blue-500' weight='duotone' />;
			default:
				return (
					<FileText
						className='h-5 w-5 text-foreground-muted'
						weight='duotone'
					/>
				);
		}
	};

	return (
		<tr className='hover:bg-background-surface/50 transition-colors group'>
			<td className='px-6 py-4'>
				<div className='flex items-center gap-3'>
					<div className='w-8 h-8 rounded-lg bg-background flex items-center justify-center border border-border group-hover:bg-white transition-colors'>
						{getFileIcon(document.file_type)}
					</div>
					<span className='text-sm font-medium text-foreground truncate max-w-[200px]'>
						{document.filename}
					</span>
				</div>
			</td>
			<td className='px-6 py-4'>
				<span className='text-xs font-semibold text-foreground-muted uppercase bg-background px-2 py-1 rounded'>
					{document.file_type.replace(".", "")}
				</span>
			</td>
			<td className='px-6 py-4'>
				<span className='text-sm text-foreground-muted'>
					{formatFileSize(document.file_size)}
				</span>
			</td>
			<td className='px-6 py-4'>
				{document.status === "indexed" ? (
					<Badge variant='success'>Indexed</Badge>
				) : document.status === "processing" ? (
					<Badge variant='warning'>Processing</Badge>
				) : (
					<Badge>{document.status}</Badge>
				)}
			</td>
			<td className='px-6 py-4'>
				<span className='text-sm text-foreground-muted'>
					{formatRelativeTime(document.created_at)}
				</span>
			</td>
			<td className='px-6 py-4 text-right'>
				<button
					onClick={() => onDelete(document.id)}
					disabled={isDeleting}
					className='p-2 rounded-lg text-foreground-muted hover:text-error hover:bg-error-light transition-all opacity-0 group-hover:opacity-100'
				>
					<Trash className='h-4 w-4' />
				</button>
			</td>
		</tr>
	);
}

function DocumentListSkeleton() {
	return (
		<div className='bg-background-surface rounded-xl border border-border overflow-hidden'>
			<div className='animate-pulse'>
				<div className='h-12 bg-background-muted' />
				{[...Array(5)].map((_, i) => (
					<div
						key={i}
						className='flex items-center gap-4 px-6 py-4 border-t border-border'
					>
						<div className='w-8 h-8 bg-border rounded-lg' />
						<div className='flex-1 h-4 bg-border rounded' />
						<div className='w-12 h-4 bg-border rounded' />
						<div className='w-16 h-4 bg-border rounded' />
						<div className='w-20 h-6 bg-border rounded-full' />
						<div className='w-24 h-4 bg-border rounded' />
					</div>
				))}
			</div>
		</div>
	);
}

function EmptyState() {
	return (
		<div className='text-center py-16 bg-background-surface rounded-xl border border-border border-dashed'>
			<div className='w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-6'>
				<FileText className='h-8 w-8 text-primary' weight='duotone' />
			</div>
			<h3 className='text-lg font-semibold text-foreground mb-2'>
				No documents yet
			</h3>
			<p className='text-foreground-muted max-w-sm mx-auto'>
				Upload your first document to use for context-aware writing.
			</p>
		</div>
	);
}
