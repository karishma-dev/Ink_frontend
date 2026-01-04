"use client";

import { ReactNode } from "react";
import { MainLayout } from "@/components/layout";

interface MainAppLayoutProps {
	children: ReactNode;
}

export default function MainAppLayout({ children }: MainAppLayoutProps) {
	return <MainLayout>{children}</MainLayout>;
}
