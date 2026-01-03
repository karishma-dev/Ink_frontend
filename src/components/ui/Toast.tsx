"use client";

import {
	createContext,
	useContext,
	useState,
	useCallback,
	ReactNode,
} from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
	id: string;
	type: ToastType;
	message: string;
	duration?: number;
}

interface ToastContextType {
	showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}

interface ToastProviderProps {
	children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = useCallback(
		(type: ToastType, message: string, duration = 5000) => {
			const id = Math.random().toString(36).slice(2);
			setToasts((prev) => [...prev, { id, type, message, duration }]);

			if (duration > 0) {
				setTimeout(() => {
					setToasts((prev) => prev.filter((t) => t.id !== id));
				}, duration);
			}
		},
		[]
	);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</ToastContext.Provider>
	);
}

interface ToastContainerProps {
	toasts: Toast[];
	onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
	if (toasts.length === 0) return null;

	return (
		<div className='fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm'>
			{toasts.map((toast) => (
				<ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
			))}
		</div>
	);
}

interface ToastItemProps {
	toast: Toast;
	onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
	const icons = {
		success: <CheckCircle className='h-5 w-5 text-success' />,
		error: <AlertCircle className='h-5 w-5 text-error' />,
		warning: <AlertTriangle className='h-5 w-5 text-warning' />,
		info: <Info className='h-5 w-5 text-info' />,
	};

	const styles = {
		success: "border-success/20 bg-success-light",
		error: "border-error/20 bg-error-light",
		warning: "border-warning/20 bg-warning-light",
		info: "border-info/20 bg-info-light",
	};

	return (
		<div
			className={cn(
				"flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-up",
				styles[toast.type]
			)}
			role='alert'
		>
			{icons[toast.type]}
			<p className='flex-1 text-sm text-foreground'>{toast.message}</p>
			<button
				onClick={() => onRemove(toast.id)}
				className='p-0.5 rounded hover:bg-foreground/10 transition-colors'
				aria-label='Dismiss'
			>
				<X className='h-4 w-4 text-foreground-secondary' />
			</button>
		</div>
	);
}
