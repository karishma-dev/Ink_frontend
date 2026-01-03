import { cn } from "@/lib/utils";

interface BadgeProps {
	children: React.ReactNode;
	variant?: "default" | "success" | "warning" | "error" | "info";
	size?: "sm" | "md";
	className?: string;
}

export function Badge({
	children,
	variant = "default",
	size = "sm",
	className,
}: BadgeProps) {
	const variants = {
		default: "bg-background-muted text-foreground-secondary",
		success: "bg-success-light text-success",
		warning: "bg-warning-light text-warning",
		error: "bg-error-light text-error",
		info: "bg-info-light text-info",
	};

	const sizes = {
		sm: "px-2 py-0.5 text-xs",
		md: "px-2.5 py-1 text-sm",
	};

	return (
		<span
			className={cn(
				"inline-flex items-center font-medium rounded-full",
				variants[variant],
				sizes[size],
				className
			)}
		>
			{children}
		</span>
	);
}
