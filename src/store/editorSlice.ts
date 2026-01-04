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
				const before = state.content.slice(0, edit.start);
				const after = state.content.slice(edit.end);
				state.content = before + edit.replacement + after;

				const diff = edit.replacement.length - (edit.end - edit.start);

				// Remove the applied edit
				state.pendingEdits.splice(index, 1);

				// Shift remaining edits' offsets if they are after the current edit
				state.pendingEdits.forEach((otherEdit) => {
					if (otherEdit.start >= edit.end) {
						otherEdit.start += diff;
						otherEdit.end += diff;
					}
				});
			}
		},
		applyAllEdits: (state) => {
			// Sort edits from last to first so that earlier offsets remain stable
			const sortedEdits = [...state.pendingEdits].sort(
				(a, b) => b.start - a.start
			);

			sortedEdits.forEach((edit) => {
				const before = state.content.slice(0, edit.start);
				const after = state.content.slice(edit.end);
				state.content = before + edit.replacement + after;
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
