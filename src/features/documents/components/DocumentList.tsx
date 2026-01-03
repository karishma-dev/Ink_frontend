"use client";

import { FileText, Trash2, File, FileCode } from "lucide-react";
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
				<p className='text-error'>
					Failed to load documents. Please try again.
				</p>
			</div>
		);
	}

	if (!data?.documents || data.documents.length === 0) {
		return <EmptyState />;
	}

	return (
		<div className='bg-background-surface rounded-xl border border-border overflow-hidden'>
			<table className='w-full'>
				<thead>
					<tr className='border-b border-border bg-background-muted'>
						<th className='text-left text-xs font-medium text-foreground-secondary uppercase tracking-wider px-4 py-3'>
							Name
						</th>
						<th className='text-left text-xs font-medium text-foreground-secondary uppercase tracking-wider px-4 py-3'>
							Type
						</th>
						<th className='text-left text-xs font-medium text-foreground-secondary uppercase tracking-wider px-4 py-3'>
							Size
						</th>
						<th className='text-left text-xs font-medium text-foreground-secondary uppercase tracking-wider px-4 py-3'>
							Status
						</th>
						<th className='text-left text-xs font-medium text-foreground-secondary uppercase tracking-wider px-4 py-3'>
							Uploaded
						</th>
						<th className='px-4 py-3'></th>
					</tr>
				</thead>
				<tbody className='divide-y divide-border'>
					{data.documents.map((doc) => (
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
				return <File className='h-5 w-5 text-error' />;
			case ".md":
				return <FileCode className='h-5 w-5 text-info' />;
			default:
				return <FileText className='h-5 w-5 text-foreground-muted' />;
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "indexed":
				return <Badge variant='success'>Indexed</Badge>;
			case "processing":
				return <Badge variant='warning'>Processing</Badge>;
			case "pending":
				return <Badge>Pending</Badge>;
			default:
				return <Badge>{status}</Badge>;
		}
	};

	return (
		<tr className='hover:bg-background-muted/50 transition-colors'>
			<td className='px-4 py-3'>
				<div className='flex items-center gap-3'>
					{getFileIcon(document.file_type)}
					<span className='text-sm font-medium text-foreground truncate max-w-[200px]'>
						{document.filename}
					</span>
				</div>
			</td>
			<td className='px-4 py-3'>
				<span className='text-sm text-foreground-secondary uppercase'>
					{document.file_type.replace(".", "")}
				</span>
			</td>
			<td className='px-4 py-3'>
				<span className='text-sm text-foreground-secondary'>
					{formatFileSize(document.file_size)}
				</span>
			</td>
			<td className='px-4 py-3'>{getStatusBadge(document.status)}</td>
			<td className='px-4 py-3'>
				<span className='text-sm text-foreground-muted'>
					{formatRelativeTime(document.created_at)}
				</span>
			</td>
			<td className='px-4 py-3'>
				<Button
					variant='ghost'
					size='sm'
					className='text-error hover:bg-error-light'
					onClick={() => onDelete(document.id)}
					disabled={isDeleting}
				>
					<Trash2 className='h-4 w-4' />
				</Button>
			</td>
		</tr>
	);
}

function DocumentListSkeleton() {
	return (
		<div className='bg-background-surface rounded-xl border border-border overflow-hidden'>
			<div className='animate-pulse'>
				<div className='h-10 bg-background-muted' />
				{[...Array(5)].map((_, i) => (
					<div
						key={i}
						className='flex items-center gap-4 px-4 py-3 border-t border-border'
					>
						<div className='w-5 h-5 bg-border rounded' />
						<div className='flex-1 h-4 bg-border rounded' />
						<div className='w-12 h-4 bg-border rounded' />
						<div className='w-16 h-4 bg-border rounded' />
						<div className='w-16 h-6 bg-border rounded-full' />
						<div className='w-20 h-4 bg-border rounded' />
					</div>
				))}
			</div>
		</div>
	);
}

function EmptyState() {
	return (
		<div className='text-center py-16'>
			<div className='w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-6'>
				<FileText className='h-8 w-8 text-primary' />
			</div>
			<h3 className='text-lg font-semibold text-foreground mb-2'>
				No documents yet
			</h3>
			<p className='text-foreground-secondary max-w-md mx-auto'>
				Upload your first document to use for RAG-powered content generation.
			</p>
		</div>
	);
}
