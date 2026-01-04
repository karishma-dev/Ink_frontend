"use client";

import { useState, useCallback, useRef } from "react";
import { getAutocompleteStream } from "@/services/autocompleteService";

// Helper to strip repeated context from AI response
function stripContext(suggestion: string, context: string): string {
	// If suggestion starts with the context (AI repeated it), strip it
	if (suggestion.startsWith(context)) {
		return suggestion.slice(context.length);
	}

	// Check for partial overlap (when context ends with beginning of suggestion)
	// e.g., context: "Hello wor" and suggestion: "world is great" should give "ld is great"
	for (let i = Math.min(context.length, suggestion.length); i > 0; i--) {
		const contextEnd = context.slice(-i);
		if (suggestion.startsWith(contextEnd)) {
			return suggestion.slice(i);
		}
	}

	return suggestion;
}

export function useAutocomplete() {
	const [suggestion, setSuggestion] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const abortControllerRef = useRef<AbortController | null>(null);

	const fetchSuggestion = useCallback(
		async (context: string, personaId?: string | null) => {
			if (context.length < 10) return;

			// Abort any existing request
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
			abortControllerRef.current = new AbortController();

			setIsLoading(true);
			setSuggestion("");

			try {
				const stream = getAutocompleteStream({
					context,
					persona_id: personaId,
				});

				let fullSuggestion = "";
				for await (const event of stream) {
					if (event.type === "content" && event.content) {
						fullSuggestion += event.content;
						// Strip context if AI repeated it
						const cleanSuggestion = stripContext(fullSuggestion, context);
						setSuggestion(cleanSuggestion);
					} else if (event.type === "done" && event.suggestion) {
						const cleanSuggestion = stripContext(event.suggestion, context);
						setSuggestion(cleanSuggestion);
						break;
					}
				}
			} catch (error: any) {
				if (error.name === "AbortError") {
					console.log("Autocomplete request aborted");
				} else {
					console.error("Autocomplete error:", error);
				}
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const clearSuggestion = useCallback(() => {
		setSuggestion("");
	}, []);

	return {
		suggestion,
		isLoading,
		fetchSuggestion,
		clearSuggestion,
	};
}
