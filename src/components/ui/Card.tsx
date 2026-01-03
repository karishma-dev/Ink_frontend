import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
	children: ReactNode;
	className?: string;
	padding?: "none" | "sm" | "md" | "lg";
	hover?: boolean;
}

export function Card({
	children,
	className,
	padding = "md",
	hover = false,
}: CardProps) {
	const paddingStyles = {
		none: "",
		sm: "p-3",
		md: "p-4",
		lg: "p-6",
	};

	return (
		<div
			className={cn(
				"bg-background-surface rounded-xl border border-border shadow-sm",
				paddingStyles[padding],
				hover &&
					"transition-all duration-200 hover:shadow-md hover:border-border-hover",
				className
			)}
		>
			{children}
		</div>
	);
}

interface CardHeaderProps {
	children: ReactNode;
	className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
	return <div className={cn("mb-4", className)}>{children}</div>;
}

interface CardTitleProps {
	children: ReactNode;
	className?: string;
	as?: "h1" | "h2" | "h3" | "h4";
}

export function CardTitle({
	children,
	className,
	as: Tag = "h3",
}: CardTitleProps) {
	return (
		<Tag className={cn("text-lg font-semibold text-foreground", className)}>
			{children}
		</Tag>
	);
}

interface CardDescriptionProps {
	children: ReactNode;
	className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
	return (
		<p className={cn("text-sm text-foreground-secondary mt-1", className)}>
			{children}
		</p>
	);
}

interface CardContentProps {
	children: ReactNode;
	className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
	return <div className={cn(className)}>{children}</div>;
}

interface CardFooterProps {
	children: ReactNode;
	className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
	return (
		<div
			className={cn(
				"mt-4 pt-4 border-t border-border flex items-center gap-3",
				className
			)}
		>
			{children}
		</div>
	);
}
