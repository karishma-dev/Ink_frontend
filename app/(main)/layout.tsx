"use client";

import { ReactNode } from "react";

interface MainAppLayoutProps {
	children: ReactNode;
}

export default function MainAppLayout({ children }: MainAppLayoutProps) {
	// Simple pass-through layout - the write page handles its own layout
	return <>{children}</>;
}
