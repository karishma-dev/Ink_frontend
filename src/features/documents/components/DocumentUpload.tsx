"use client";

import { useCallback, useState } from "react";
import {
	UploadSimple,
	FileText,
	X,
	WarningCircle,
} from "@phosphor-icons/react";
import { cn, formatFileSize } from "@/lib/utils";
import { Button, useToast } from "@/components/ui";
import { VALIDATION } from "@/lib/constants";
import { useUploadDocument } from "../hooks/useDocuments";
import { getErrorMessage } from "@/lib/api";

export function DocumentUpload() {
	const [isDragOver, setIsDragOver] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [validationError, setValidationError] = useState<string | null>(null);

	const uploadDocument = useUploadDocument();
	const { showToast } = useToast();

	const validateFile = (file: File): string | null => {
		const ext = "." + file.name.split(".").pop()?.toLowerCase();
		if (![".pdf", ".md", ".txt"].includes(ext)) {
			return "Invalid file type. Allowed: .pdf, .md, .txt";
		}
		if (file.size > 10 * 1024 * 1024) {
			return "File too large. Max size: 10MB";
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
		} catch (err) {
			showToast("error", getErrorMessage(err));
		}
	};

	return (
		<div className='space-y-4'>
			<div
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				className={cn(
					"relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300",
					isDragOver
						? "border-primary bg-primary-light/30 scale-[1.01]"
						: "border-border hover:border-primary/50 hover:bg-background-muted",
					validationError && "border-error bg-error-light/10"
				)}
			>
				<input
					type='file'
					accept='.pdf,.md,.txt'
					onChange={handleInputChange}
					className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
				/>

				<div className='flex flex-col items-center'>
					<div
						className={cn(
							"w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300",
							isDragOver && "scale-110",
							validationError
								? "bg-error-light text-error"
								: "bg-primary-light text-primary"
						)}
					>
						{validationError ? (
							<WarningCircle className='h-7 w-7' weight='duotone' />
						) : (
							<UploadSimple className='h-7 w-7' weight='duotone' />
						)}
					</div>

					{validationError ? (
						<p className='text-sm text-error font-medium'>{validationError}</p>
					) : (
						<>
							<p className='text-sm text-foreground font-semibold'>
								Drag and drop or click to upload
							</p>
							<p className='text-xs text-foreground-muted mt-2 font-medium'>
								Supports PDF, MD, TXT (Max 10MB)
							</p>
						</>
					)}
				</div>
			</div>

			{selectedFile && (
				<div className='flex items-center gap-3 p-3 rounded-xl bg-background-surface border border-border animate-scale-in'>
					<div className='w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center'>
						<FileText className='h-6 w-6 text-primary' weight='duotone' />
					</div>
					<div className='flex-1 min-w-0'>
						<p className='text-sm font-semibold text-foreground truncate'>
							{selectedFile.name}
						</p>
						<p className='text-xs text-foreground-muted font-medium'>
							{formatFileSize(selectedFile.size)}
						</p>
					</div>
					<button
						onClick={() => setSelectedFile(null)}
						className='p-2 rounded-lg hover:bg-background transition-colors'
					>
						<X className='h-4 w-4 text-foreground-muted' />
					</button>
				</div>
			)}

			{selectedFile && (
				<Button
					onClick={handleUpload}
					isLoading={uploadDocument.isPending}
					className='w-full py-6 rounded-xl shadow-sm'
				>
					Upload Document
				</Button>
			)}
		</div>
	);
}
