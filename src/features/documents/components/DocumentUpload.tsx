"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
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
		} catch (err) {
			showToast("error", getErrorMessage(err));
		}
	};

	const clearSelection = () => {
		setSelectedFile(null);
		setValidationError(null);
	};

	return (
		<div className='space-y-4'>
			{/* Drop Zone */}
			<div
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				className={cn(
					"relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
					isDragOver
						? "border-primary bg-primary-light"
						: "border-border hover:border-primary hover:bg-primary-light/50",
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
							"w-12 h-12 rounded-full flex items-center justify-center mb-4",
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
								Drag and drop a file here, or click to browse
							</p>
							<p className='text-xs text-foreground-muted mt-1'>
								Supports: {VALIDATION.ALLOWED_FILE_TYPES.join(", ")} (max{" "}
								{formatFileSize(VALIDATION.MAX_FILE_SIZE)})
							</p>
						</>
					)}
				</div>
			</div>

			{/* Selected File Preview */}
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

			{/* Upload Button */}
			{selectedFile && (
				<Button
					onClick={handleUpload}
					isLoading={uploadDocument.isPending}
					className='w-full'
				>
					Upload Document
				</Button>
			)}
		</div>
	);
}
