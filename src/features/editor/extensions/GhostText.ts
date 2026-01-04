/**
 * Ghost Text Extension for TipTap
 * Renders autocomplete suggestions as inline ghost text
 */
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export const GhostTextPluginKey = new PluginKey("ghostText");

// Store suggestion outside plugin for reactivity
let currentSuggestion = "";

export const setSuggestion = (suggestion: string) => {
	currentSuggestion = suggestion;
};

export const getSuggestion = () => currentSuggestion;

export const GhostText = Extension.create({
	name: "ghostText",

	addProseMirrorPlugins() {
		return [
			new Plugin({
				key: GhostTextPluginKey,
				props: {
					decorations(state) {
						const suggestion = getSuggestion();

						if (!suggestion) {
							return DecorationSet.empty;
						}

						// Get cursor position
						const { selection } = state;
						const { $head } = selection;

						// Create ghost text decoration at cursor
						const widget = Decoration.widget(
							$head.pos,
							() => {
								const span = document.createElement("span");
								span.className = "ghost-text";
								span.textContent = suggestion;
								return span;
							},
							{ side: 1 }
						);

						return DecorationSet.create(state.doc, [widget]);
					},
				},
			}),
		];
	},
});
