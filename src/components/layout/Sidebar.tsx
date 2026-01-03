"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Users, FileText, LogOut, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth";

const navItems = [
	{ href: "/chat", label: "Chat", icon: MessageSquare },
	{ href: "/personas", label: "Personas", icon: Users },
	{ href: "/documents", label: "Documents", icon: FileText },
];

export function Sidebar() {
	const pathname = usePathname();
	const { logout } = useAuth();

	return (
		<aside className='fixed left-0 top-0 h-full w-64 bg-background-surface border-r border-border flex flex-col'>
			{/* Logo */}
			<div className='p-6 border-b border-border'>
				<Link href='/chat' className='flex items-center gap-2'>
					<div className='w-8 h-8 rounded-lg bg-primary flex items-center justify-center'>
						<PenTool className='h-4 w-4 text-primary-foreground' />
					</div>
					<span className='text-lg font-semibold text-foreground'>
						AI Writer
					</span>
				</Link>
			</div>

			{/* Navigation */}
			<nav className='flex-1 p-4 space-y-1'>
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = pathname.startsWith(item.href);

					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
								isActive
									? "bg-primary-light text-primary"
									: "text-foreground-secondary hover:bg-background-muted hover:text-foreground"
							)}
						>
							<Icon className='h-5 w-5' />
							{item.label}
						</Link>
					);
				})}
			</nav>

			{/* Logout */}
			<div className='p-4 border-t border-border'>
				<button
					onClick={logout}
					className='flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-foreground-secondary hover:bg-background-muted hover:text-foreground transition-colors'
				>
					<LogOut className='h-5 w-5' />
					Sign Out
				</button>
			</div>
		</aside>
	);
}
