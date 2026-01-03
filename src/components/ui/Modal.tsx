"use client";

import { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
	showCloseButton?: boolean;
}

export function Modal({
	isOpen,
	onClose,
	title,
	children,
	size = "md",
	showCloseButton = true,
}: ModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
			modalRef.current?.focus();
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const sizes = {
		sm: "max-w-sm",
		md: "max-w-md",
		lg: "max-w-lg",
		xl: "max-w-2xl",
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center'>
			{/* Backdrop */}
			<div
				className='absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-fade-in'
				onClick={onClose}
				aria-hidden='true'
			/>

			{/* Modal */}
			<div
				ref={modalRef}
				role='dialog'
				aria-modal='true'
				aria-labelledby={title ? "modal-title" : undefined}
				tabIndex={-1}
				className={cn(
					"relative bg-background-surface rounded-xl shadow-lg border border-border",
					"w-full mx-4 max-h-[90vh] overflow-auto animate-slide-up",
					sizes[size]
				)}
			>
				{/* Header */}
				{(title || showCloseButton) && (
					<div className='flex items-center justify-between p-4 border-b border-border'>
						{title && (
							<h2
								id='modal-title'
								className='text-lg font-semibold text-foreground'
							>
								{title}
							</h2>
						)}
						{showCloseButton && (
							<button
								onClick={onClose}
								className='p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-muted transition-colors'
								aria-label='Close modal'
							>
								<X className='h-5 w-5' />
							</button>
						)}
					</div>
				)}

				{/* Content */}
				<div className='p-4'>{children}</div>
			</div>
		</div>
	);
}
