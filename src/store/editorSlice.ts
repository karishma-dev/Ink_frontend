import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Edit {
	type: string;
	start: number;
	end: number;
	original: string;
	replacement: string;
}

export interface UserPresence {
	user_id: string | number;
	username: string;
	color: string;
	cursor_position?: number;
}

interface EditorState {
	content: string;
	title: string;
	selection: {
		start: number;
		end: number;
		text: string;
	} | null;
	pendingEdits: Edit[];
	presence: UserPresence[];
	isSaving: boolean;
	lastSaved: string | null;
}

const initialState: EditorState = {
	content: "",
	title: "Untitled",
	selection: null,
	pendingEdits: [],
	presence: [],
	isSaving: false,
	lastSaved: null,
};

const editorSlice = createSlice({
	name: "editor",
	initialState,
	reducers: {
		setContent: (state, action: PayloadAction<string>) => {
			state.content = action.payload;
		},
		setTitle: (state, action: PayloadAction<string>) => {
			state.title = action.payload;
		},
		setSelection: (state, action: PayloadAction<EditorState["selection"]>) => {
			state.selection = action.payload;
		},
		setPendingEdits: (state, action: PayloadAction<Edit[]>) => {
			state.pendingEdits = action.payload;
		},
		applyEdit: (state, action: PayloadAction<number>) => {
			const index = action.payload;
			const edit = state.pendingEdits[index];
			if (edit) {
				// Don't trust AI positions - find the original text by string search
				let actualStart = edit.start;
				let actualEnd = edit.end;

				if (edit.original) {
					// Search for the original text near the suggested position
					const searchWindow = 50; // Look within 50 chars of suggested position
					const searchStart = Math.max(0, edit.start - searchWindow);
					const searchEnd = Math.min(
						state.content.length,
						edit.end + searchWindow
					);
					const searchArea = state.content.slice(searchStart, searchEnd);

					const foundIndex = searchArea.indexOf(edit.original);
					if (foundIndex !== -1) {
						actualStart = searchStart + foundIndex;
						actualEnd = actualStart + edit.original.length;
					}
				}

				const before = state.content.slice(0, actualStart);
				const after = state.content.slice(actualEnd);
				state.content = before + edit.replacement + after;

				const diff = edit.replacement.length - (actualEnd - actualStart);

				// Remove the applied edit
				state.pendingEdits.splice(index, 1);

				// Shift remaining edits' offsets if they are after the current edit
				state.pendingEdits.forEach((otherEdit) => {
					if (otherEdit.start >= actualEnd) {
						otherEdit.start += diff;
						otherEdit.end += diff;
					}
				});
			}
		},
		applyAllEdits: (state) => {
			// Sort edits from last to first so that earlier offsets remain stable
			// when using position-based search
			const sortedEdits = [...state.pendingEdits].sort(
				(a, b) => b.start - a.start
			);

			sortedEdits.forEach((edit) => {
				if (edit.original) {
					// Search near AI's suggested position (handles duplicate words)
					const searchWindow = 50;
					const searchStart = Math.max(0, edit.start - searchWindow);
					const searchEnd = Math.min(
						state.content.length,
						edit.end + searchWindow
					);
					const searchArea = state.content.slice(searchStart, searchEnd);

					const foundIndex = searchArea.indexOf(edit.original);
					if (foundIndex !== -1) {
						const actualStart = searchStart + foundIndex;
						const before = state.content.slice(0, actualStart);
						const after = state.content.slice(
							actualStart + edit.original.length
						);
						state.content = before + edit.replacement + after;
					}
				} else {
					// Fallback to position-based if no original text
					const before = state.content.slice(0, edit.start);
					const after = state.content.slice(edit.end);
					state.content = before + edit.replacement + after;
				}
			});

			state.pendingEdits = [];
		},
		clearEdits: (state) => {
			state.pendingEdits = [];
		},
		setPresence: (state, action: PayloadAction<UserPresence[]>) => {
			state.presence = action.payload;
		},
		updateUserCursor: (
			state,
			action: PayloadAction<{ user_id: string | number; position: number }>
		) => {
			const user = state.presence.find(
				(u) => u.user_id === action.payload.user_id
			);
			if (user) {
				user.cursor_position = action.payload.position;
			}
		},
		setSaving: (state, action: PayloadAction<boolean>) => {
			state.isSaving = action.payload;
		},
		setLastSaved: (state, action: PayloadAction<string>) => {
			state.lastSaved = action.payload;
		},
	},
});

export const {
	setContent,
	setTitle,
	setSelection,
	setPendingEdits,
	applyEdit,
	applyAllEdits,
	clearEdits,
	setPresence,
	updateUserCursor,
	setSaving,
	setLastSaved,
} = editorSlice.actions;

export default editorSlice.reducer;
