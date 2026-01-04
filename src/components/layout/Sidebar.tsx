"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	PenNib,
	ChatCircle,
	Files,
	Users,
	Gear,
	SignOut,
	House,
	FileText,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth";

const navItems = [
	{ href: "/dashboard", label: "Home", icon: House },
	{ href: "/write", label: "Write", icon: PenNib },
	{ href: "/drafts", label: "Drafts", icon: Files },
	{ href: "/documents", label: "Documents", icon: FileText },
	{ href: "/personas", label: "Personas", icon: Users },
];

export function Sidebar() {
	const pathname = usePathname();
	const { logout } = useAuth();

	return (
		<aside className='fixed left-0 top-0 h-full w-60 bg-background-sidebar border-r border-border flex flex-col animate-slide-in-left'>
			{/* Logo */}
			<div className='px-5 py-3 border-b border-border'>
				<Link href='/dashboard' className='flex items-center gap-2.5 group'>
					<div className='w-9 h-9 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105'>
						<PenNib className='h-5 w-5 text-primary-foreground' weight='fill' />
					</div>
					<span className='text-lg font-semibold text-foreground tracking-tight'>
						AI Writer
					</span>
				</Link>
			</div>

			{/* Navigation */}
			<nav className='flex-1 p-3 space-y-1'>
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive =
						pathname === item.href || pathname.startsWith(item.href + "/");

					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
								isActive
									? "bg-primary text-primary-foreground shadow-sm"
									: "text-foreground-secondary hover:bg-background-muted hover:text-foreground"
							)}
						>
							<Icon
								className='h-5 w-5'
								weight={isActive ? "fill" : "regular"}
							/>
							{item.label}
						</Link>
					);
				})}
			</nav>

			{/* Bottom section */}
			<div className='p-3 border-t border-border space-y-1'>
				<Link
					href='/settings'
					className='flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-foreground-secondary hover:bg-background-muted hover:text-foreground transition-all'
				>
					<Gear className='h-5 w-5' />
					Settings
				</Link>
				<button
					onClick={logout}
					className='flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-foreground-secondary hover:bg-error-light hover:text-error transition-all'
				>
					<SignOut className='h-5 w-5' />
					Sign Out
				</button>
			</div>
		</aside>
	);
}
