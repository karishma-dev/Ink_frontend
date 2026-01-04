/**
 * Autocomplete Service
 * Handles AI text completion suggestions
 */

import { tryCatchWrapperForService } from "@/lib/tryCatchWrapper";

export interface AutocompleteParams {
	context: string;
	persona_id?: string | null;
	max_tokens?: number;
}

/**
 * Get autocomplete suggestion via SSE stream
 */
export const getAutocompleteStream = async function* (
	params: AutocompleteParams
): AsyncGenerator<
	{ type: string; content?: string; suggestion?: string },
	void,
	unknown
> {
	const response = await fetch(
		`${
			process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
		}/autocomplete`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			},
			body: JSON.stringify(params),
		}
	);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const reader = response.body?.getReader();
	if (!reader) throw new Error("No response body");

	const decoder = new TextDecoder();
	let buffer = "";

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split("\n\n");
		buffer = lines.pop() || "";

		for (const line of lines) {
			if (line.startsWith("data: ")) {
				try {
					const data = JSON.parse(line.slice(6));
					yield data;
				} catch {
					// Skip invalid JSON
				}
			}
		}
	}
};
