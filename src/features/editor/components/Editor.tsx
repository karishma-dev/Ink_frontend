"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { useAutocomplete } from "../hooks/useAutocomplete";
import { useAppSelector } from "@/store/hooks";

interface EditorProps {
	value: string;
	onChange: (value: string, cursorPosition: number) => void;
	placeholder?: string;
	personaId?: string | null;
	onCursorChange?: (position: number) => void;
}

export function Editor({
	value,
	onChange,
	placeholder,
	personaId,
	onCursorChange,
}: EditorProps) {
	const editorRef = useRef<HTMLTextAreaElement>(null);
	const { suggestion, fetchSuggestion, clearSuggestion } = useAutocomplete();
	const [cursorPos, setCursorPos] = useState(0);
	const { presence } = useAppSelector((state) => state.editor);

	// Handle autocomplete on Tab
	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Tab" && suggestion) {
			e.preventDefault();
			const before = value.slice(0, cursorPos);
			const after = value.slice(cursorPos);
			const newContent = before + suggestion + after;
			const newPos = cursorPos + suggestion.length;

			onChange(newContent, newPos);

			setTimeout(() => {
				if (editorRef.current) {
					editorRef.current.setSelectionRange(newPos, newPos);
				}
			}, 0);

			clearSuggestion();
		} else if (e.key === "Escape") {
			clearSuggestion();
		}
	};

	// Trigger autocomplete after typing pause
	useEffect(() => {
		const timer = setTimeout(() => {
			if (value && editorRef.current) {
				const pos = editorRef.current.selectionStart;
				const context = value.slice(Math.max(0, pos - 1000), pos);
				if (
					context.endsWith(" ") ||
					context.endsWith("\n") ||
					context.length > 20
				) {
					fetchSuggestion(context, personaId);
				}
			}
		}, 1000);

		return () => {
			clearTimeout(timer);
			clearSuggestion();
		};
	}, [value, personaId, fetchSuggestion, clearSuggestion]);

	// Auto-resize textarea
	useEffect(() => {
		if (editorRef.current) {
			editorRef.current.style.height = "auto";
			editorRef.current.style.height =
				Math.max(editorRef.current.scrollHeight, 500) + "px";
		}
	}, [value]);

	const handleSelect = (e: any) => {
		const pos = e.target.selectionStart;
		setCursorPos(pos);
		onCursorChange?.(pos);
	};

	return (
		<div className='relative w-full h-full'>
			{/* Remote Cursors (Simplified) */}
			{presence.map(
				(user) =>
					user.cursor_position !== undefined &&
					user.cursor_position !== cursorPos && (
						<div
							key={user.user_id}
							className='absolute pointer-events-none w-0.5 h-6 animate-pulse z-20'
							style={{
								backgroundColor: user.color,
								// This is a placeholder - real positioning requires measuring text
								// Left/Top would need complex calculation
								display: "none", // Hidden for now until we have better measurement
							}}
						>
							<div
								className='absolute bottom-full left-0 px-1 py-0.5 rounded text-[8px] text-white font-bold whitespace-nowrap'
								style={{ backgroundColor: user.color }}
							>
								{user.username}
							</div>
						</div>
					)
			)}

			{/* Ghost Text Layer */}
			{suggestion && editorRef.current && (
				<div
					className='absolute top-0 left-0 w-full p-8 pointer-events-none whitespace-pre-wrap break-words text-foreground-muted opacity-50 font-serif text-lg leading-relaxed'
					style={{ zIndex: 0 }}
				>
					<span className='invisible'>{value.slice(0, cursorPos)}</span>
					<span className='animate-fade-in'>{suggestion}</span>
				</div>
			)}

			<textarea
				ref={editorRef}
				value={value}
				onChange={(e) => onChange(e.target.value, e.target.selectionStart)}
				onKeyDown={handleKeyDown}
				onSelect={handleSelect}
				placeholder={placeholder || "Start writing..."}
				className={cn(
					"w-full min-h-[500px] p-8 bg-transparent resize-none relative z-10",
					"editor-content font-serif text-lg leading-relaxed",
					"focus:outline-none"
				)}
				spellCheck='true'
			/>
		</div>
	);
}
