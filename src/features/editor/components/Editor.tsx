"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface EditorProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	onRequestSuggestion?: (context: string) => void;
}

export function Editor({
	value,
	onChange,
	placeholder,
	onRequestSuggestion,
}: EditorProps) {
	const editorRef = useRef<HTMLTextAreaElement>(null);

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		// Tab to request AI suggestion
		if (e.key === "Tab" && onRequestSuggestion) {
			e.preventDefault();
			const cursorPos = e.currentTarget.selectionStart;
			const contextBefore = value.slice(
				Math.max(0, cursorPos - 500),
				cursorPos
			);
			onRequestSuggestion(contextBefore);
		}
	};

	// Auto-resize textarea
	useEffect(() => {
		if (editorRef.current) {
			editorRef.current.style.height = "auto";
			editorRef.current.style.height =
				Math.max(editorRef.current.scrollHeight, 500) + "px";
		}
	}, [value]);

	return (
		<div className='w-full h-full'>
			<textarea
				ref={editorRef}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder || "Start writing..."}
				className={cn(
					"w-full min-h-[500px] p-8 bg-transparent resize-none",
					"editor-content",
					"focus:outline-none"
				)}
				spellCheck='true'
			/>
		</div>
	);
}
