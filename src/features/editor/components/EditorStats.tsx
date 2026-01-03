"use client";

import { FileText, Clock, Type } from "lucide-react";

interface EditorStatsProps {
	wordCount: number;
	charCount: number;
	readingTime: number;
}

export function EditorStats({
	wordCount,
	charCount,
	readingTime,
}: EditorStatsProps) {
	return (
		<div className='flex items-center gap-6 text-sm text-foreground-muted'>
			<div className='flex items-center gap-1.5'>
				<Type className='h-3.5 w-3.5' />
				<span>{wordCount} words</span>
			</div>
			<div className='flex items-center gap-1.5'>
				<FileText className='h-3.5 w-3.5' />
				<span>{charCount} chars</span>
			</div>
			<div className='flex items-center gap-1.5'>
				<Clock className='h-3.5 w-3.5' />
				<span>{readingTime} min read</span>
			</div>
		</div>
	);
}

export function calculateStats(text: string) {
	const words = text.trim() ? text.trim().split(/\s+/).length : 0;
	const chars = text.length;
	const readingTime = Math.max(1, Math.ceil(words / 200));

	return { wordCount: words, charCount: chars, readingTime };
}
