/**
 * Persona Types - matching backend schemas
 */

export interface Persona {
	id: string;
	name: string;
	description: string;
	samples: string[];
	formality_level: number;
	creativity_level: number;
	sentence_length: string;
	use_metaphors: boolean;
	jargon_level: number;
	banned_words: string[];
	topics: string[];
	audience: string;
	purpose: string;
	created_at: string;
	updated_at: string;
}

export interface CreatePersonaRequest {
	name: string;
	description: string;
	samples: string[];
	formality_level: number;
	creativity_level: number;
	sentence_length: string;
	use_metaphors: boolean;
	jargon_level: number;
	banned_words: string[];
	topics: string[];
	audience: string;
	purpose: string;
}

export interface UpdatePersonaRequest {
	name?: string;
	description?: string;
	samples?: string[];
	formality_level?: number;
	creativity_level?: number;
	sentence_length?: string;
	use_metaphors?: boolean;
	jargon_level?: number;
	banned_words?: string[];
	topics?: string[];
	audience?: string;
	purpose?: string;
}

export interface PersonaListResponse {
	personas: Persona[];
}
