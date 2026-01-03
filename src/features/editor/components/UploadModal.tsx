"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Upload, FileText, X, AlertCircle, ExternalLink } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";
import { Button, Modal, useToast } from "@/components/ui";
import { VALIDATION } from "@/lib/constants";
import { useUploadDocument } from "@/features/documents/hooks/useDocuments";
import { getErrorMessage } from "@/lib/api";

interface UploadModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
	const [isDragOver, setIsDragOver] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [validationError, setValidationError] = useState<string | null>(null);

	const uploadDocument = useUploadDocument();
	const { showToast } = useToast();

	const validateFile = (file: File): string | null => {
		const ext = "." + file.name.split(".").pop()?.toLowerCase();

		if (!(VALIDATION.ALLOWED_FILE_TYPES as readonly string[]).includes(ext)) {
			return `Invalid file type. Allowed: ${VALIDATION.ALLOWED_FILE_TYPES.join(
				", "
			)}`;
		}

		if (file.size > VALIDATION.MAX_FILE_SIZE) {
			return `File too large. Max size: ${formatFileSize(
				VALIDATION.MAX_FILE_SIZE
			)}`;
		}

		return null;
	};

	const handleFile = (file: File) => {
		const error = validateFile(file);
		if (error) {
			setValidationError(error);
			setSelectedFile(null);
		} else {
			setValidationError(null);
			setSelectedFile(file);
		}
	};

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
		const file = e.dataTransfer.files[0];
		if (file) handleFile(file);
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) handleFile(file);
	};

	const handleUpload = async () => {
		if (!selectedFile) return;

		try {
			await uploadDocument.mutateAsync(selectedFile);
			showToast("success", "Document uploaded successfully");
			setSelectedFile(null);
			onClose();
		} catch (err) {
			showToast("error", getErrorMessage(err));
		}
	};

	const clearSelection = () => {
		setSelectedFile(null);
		setValidationError(null);
	};

	const handleClose = () => {
		clearSelection();
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title='Upload Document'
			size='md'
		>
			<div className='space-y-4'>
				{/* Drop Zone */}
				<div
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					className={cn(
						"relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
						isDragOver
							? "border-primary bg-primary-light"
							: "border-border hover:border-primary",
						validationError && "border-error bg-error-light"
					)}
				>
					<input
						type='file'
						accept={VALIDATION.ALLOWED_FILE_TYPES.join(",")}
						onChange={handleInputChange}
						className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
					/>

					<div className='flex flex-col items-center'>
						<div
							className={cn(
								"w-12 h-12 rounded-full flex items-center justify-center mb-3",
								validationError ? "bg-error-light" : "bg-primary-light"
							)}
						>
							{validationError ? (
								<AlertCircle className='h-6 w-6 text-error' />
							) : (
								<Upload className='h-6 w-6 text-primary' />
							)}
						</div>

						{validationError ? (
							<p className='text-sm text-error'>{validationError}</p>
						) : (
							<>
								<p className='text-sm text-foreground font-medium'>
									Drag & drop or click to browse
								</p>
								<p className='text-xs text-foreground-muted mt-1'>
									{VALIDATION.ALLOWED_FILE_TYPES.join(", ")} (max{" "}
									{formatFileSize(VALIDATION.MAX_FILE_SIZE)})
								</p>
							</>
						)}
					</div>
				</div>

				{/* Selected File */}
				{selectedFile && (
					<div className='flex items-center gap-3 p-3 rounded-lg bg-background-muted'>
						<FileText className='h-5 w-5 text-primary' />
						<div className='flex-1 min-w-0'>
							<p className='text-sm font-medium text-foreground truncate'>
								{selectedFile.name}
							</p>
							<p className='text-xs text-foreground-muted'>
								{formatFileSize(selectedFile.size)}
							</p>
						</div>
						<button
							type='button'
							onClick={clearSelection}
							className='p-1 rounded hover:bg-border transition-colors'
						>
							<X className='h-4 w-4 text-foreground-muted' />
						</button>
					</div>
				)}

				{/* Actions */}
				<div className='flex items-center justify-between pt-2'>
					<Link
						href='/documents'
						className='text-sm text-primary hover:underline flex items-center gap-1'
						onClick={handleClose}
					>
						Manage Documents
						<ExternalLink className='h-3 w-3' />
					</Link>

					<div className='flex gap-2'>
						<Button variant='secondary' size='sm' onClick={handleClose}>
							Cancel
						</Button>
						{selectedFile && (
							<Button
								size='sm'
								onClick={handleUpload}
								isLoading={uploadDocument.isPending}
							>
								Upload
							</Button>
						)}
					</div>
				</div>
			</div>
		</Modal>
	);
}
