import * as yup from "yup";

export const personaSchema = yup.object({
	name: yup
		.string()
		.required("Persona name is required")
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must be at most 100 characters"),
	description: yup
		.string()
		.required("Description is required")
		.min(10, "Description must be at least 10 characters"),
	samples: yup
		.array()
		.of(yup.string().required())
		.min(1, "At least one sample text is required")
		.default([]),
	formality_level: yup.number().min(1).max(10).default(5),
	creativity_level: yup.number().min(1).max(10).default(5),
	sentence_length: yup
		.string()
		.oneOf(["short", "medium", "long", "varied"])
		.default("medium"),
	use_metaphors: yup.boolean().default(false),
	jargon_level: yup.number().min(1).max(10).default(5),
	banned_words: yup.array().of(yup.string().required()).default([]),
	topics: yup.array().of(yup.string().required()).default([]),
	audience: yup
		.string()
		.oneOf(["general", "technical", "academic", "casual", "professional"])
		.default("general"),
	purpose: yup
		.string()
		.oneOf(["blog", "article", "documentation", "marketing", "social", "email"])
		.default("blog"),
});

export type PersonaFormData = yup.InferType<typeof personaSchema>;
