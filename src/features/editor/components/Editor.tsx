"use client";

import { useEffect, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { useAutocomplete } from "../hooks/useAutocomplete";
import { useAppSelector } from "@/store/hooks";
import { GhostText, setSuggestion } from "../extensions/GhostText";

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
	placeholder = "Start writing...",
	personaId,
	onCursorChange,
}: EditorProps) {
	const { suggestion, fetchSuggestion, clearSuggestion } = useAutocomplete();
	const { presence } = useAppSelector((state) => state.editor);
	const lastContent = useRef(value);
	const isUpdatingFromProps = useRef(false);

	const editor = useEditor({
		immediatelyRender: false, // Prevent SSR hydration mismatch
		extensions: [
			StarterKit.configure({
				// Disable some features for a cleaner writing experience
				heading: false,
				bulletList: false,
				orderedList: false,
				blockquote: false,
				codeBlock: false,
				horizontalRule: false,
			}),
			Placeholder.configure({
				placeholder,
				emptyEditorClass: "is-editor-empty",
			}),
			GhostText,
		],
		content: value,
		editorProps: {
			attributes: {
				class: cn(
					"w-full min-h-[500px] p-8 bg-transparent",
					"editor-content focus:outline-none",
					"prose prose-lg max-w-none"
				),
				spellcheck: "true",
			},
			handleKeyDown: (view, event) => {
				// Accept suggestion on Tab
				if (event.key === "Tab" && suggestion) {
					event.preventDefault();
					const { state } = view;
					const { from } = state.selection;

					// Insert the suggestion at cursor
					view.dispatch(state.tr.insertText(suggestion, from));

					clearSuggestion();
					return true;
				}

				// Clear suggestion on Escape
				if (event.key === "Escape" && suggestion) {
					clearSuggestion();
					return true;
				}

				return false;
			},
		},
		onUpdate: ({ editor }) => {
			if (isUpdatingFromProps.current) return;

			const text = editor.getText();
			const cursorPos = editor.state.selection.$head.pos;

			lastContent.current = text;
			onChange(text, cursorPos);
			onCursorChange?.(cursorPos);

			// Clear suggestion when user types
			if (suggestion) {
				clearSuggestion();
			}
		},
		onSelectionUpdate: ({ editor }) => {
			const cursorPos = editor.state.selection.$head.pos;
			onCursorChange?.(cursorPos);
		},
	});

	// Update ghost text when suggestion changes
	useEffect(() => {
		setSuggestion(suggestion);
		if (editor) {
			// Force view update to show/hide ghost text
			editor.view.dispatch(editor.state.tr);
		}
	}, [editor, suggestion]);

	// Sync content from props (for external updates like AI edits)
	useEffect(() => {
		if (editor && value !== lastContent.current) {
			isUpdatingFromProps.current = true;

			// Save cursor position
			const { from } = editor.state.selection;

			// Update content
			editor.commands.setContent(value, { emitUpdate: false });

			// Try to restore cursor position
			const newPos = Math.min(from, editor.state.doc.content.size);
			editor.commands.setTextSelection(newPos);

			lastContent.current = value;
			isUpdatingFromProps.current = false;
		}
	}, [editor, value]);

	// Track last content for meaningful change detection
	const lastAutocompleteContent = useRef("");

	// Trigger autocomplete after 10 seconds of inactivity
	useEffect(() => {
		if (!editor) return;

		const text = editor.getText();
		const trimmedText = text.trim();

		// Don't trigger if content hasn't meaningfully changed
		if (trimmedText === lastAutocompleteContent.current.trim()) {
			return;
		}

		const timer = setTimeout(() => {
			const cursorPos = editor.state.selection.$head.pos;

			// Only trigger if there's actual content (not just whitespace)
			if (trimmedText.length > 20) {
				const context = text.slice(Math.max(0, cursorPos - 1000), cursorPos);
				// Only suggest if cursor is at a natural break point
				if (context.trim().length > 10) {
					lastAutocompleteContent.current = text;
					fetchSuggestion(context, personaId);
				}
			}
		}, 10000); // 10 seconds

		return () => clearTimeout(timer);
	}, [editor?.state.doc.content, personaId, fetchSuggestion, editor]);

	return (
		<div className='relative w-full h-full'>
			{/* Remote Cursors (Simplified) */}
			{presence.map(
				(user) =>
					user.cursor_position !== undefined && (
						<div
							key={user.user_id}
							className='absolute pointer-events-none w-0.5 h-6 animate-pulse z-20'
							style={{
								backgroundColor: user.color,
								display: "none", // Hidden until we have better measurement
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

			{/* TipTap Editor */}
			<EditorContent editor={editor} />
		</div>
	);
}
