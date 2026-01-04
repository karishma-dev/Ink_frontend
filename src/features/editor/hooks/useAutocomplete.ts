"use client";

import { useState, useCallback, useRef } from "react";
import { getAutocompleteStream } from "@/services/autocompleteService";

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
						setSuggestion(fullSuggestion);
					} else if (event.type === "done" && event.suggestion) {
						setSuggestion(event.suggestion);
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
