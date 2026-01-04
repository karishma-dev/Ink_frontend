"use client";

import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { Button, useToast } from "@/components/ui";
import { personaSchema, PersonaFormData } from "../utils/validation";
import { useCreatePersona, useUpdatePersona } from "../hooks/usePersonas";
import { Persona } from "../types";
import { getErrorMessage } from "@/lib/api";
import {
	BasicInfoSection,
	WritingSamplesSection,
	ToneSettingsSection,
	ContextSection,
} from "./FormSections";

interface PersonaFormProps {
	persona?: Persona | null;
	mode: "create" | "edit";
}

export function PersonaForm({ persona, mode }: PersonaFormProps) {
	const router = useRouter();
	const { showToast } = useToast();
	const createPersona = useCreatePersona();
	const updatePersona = useUpdatePersona();

	const getDefaultValues = (): PersonaFormData => {
		if (persona) {
			return {
				name: persona.name,
				description: persona.description,
				samples: persona.samples,
				formality_level: persona.formality_level,
				creativity_level: persona.creativity_level,
				sentence_length:
					persona.sentence_length as PersonaFormData["sentence_length"],
				use_metaphors: persona.use_metaphors,
				jargon_level: persona.jargon_level,
				banned_words: persona.banned_words,
				topics: persona.topics,
				audience: persona.audience as PersonaFormData["audience"],
				purpose: persona.purpose as PersonaFormData["purpose"],
			};
		}
		return {
			name: "",
			description: "",
			samples: [],
			formality_level: 5,
			creativity_level: 5,
			sentence_length: "medium",
			use_metaphors: false,
			jargon_level: 5,
			banned_words: [],
			topics: [],
			audience: "general",
			purpose: "blog",
		};
	};

	const methods = useForm<PersonaFormData>({
		resolver: yupResolver(personaSchema),
		defaultValues: getDefaultValues(),
	});

	const {
		handleSubmit,
		formState: { isSubmitting },
	} = methods;

	const onSubmit = async (data: PersonaFormData) => {
		try {
			if (mode === "create") {
				await createPersona.mutateAsync(data);
				showToast("success", "Persona created successfully");
			} else if (persona) {
				await updatePersona.mutateAsync({ id: persona.id, data });
				showToast("success", "Persona updated successfully");
			}
			router.push("/personas");
		} catch (err) {
			showToast("error", getErrorMessage(err));
		}
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
				<BasicInfoSection />
				<WritingSamplesSection />
				<ToneSettingsSection />
				<ContextSection />

				<div className='flex gap-3 pt-4'>
					<Button type='submit' isLoading={isSubmitting}>
						{mode === "create" ? "Create Persona" : "Save Changes"}
					</Button>
					<Button
						type='button'
						variant='secondary'
						onClick={() => router.back()}
					>
						Cancel
					</Button>
				</div>
			</form>
		</FormProvider>
	);
}
