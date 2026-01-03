"use client";

import { useState, KeyboardEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";
import {
	Button,
	Input,
	TextArea,
	Select,
	Slider,
	useToast,
} from "@/components/ui";
import { PERSONA_CONFIG } from "@/lib/constants";
import { personaSchema, PersonaFormData } from "../utils/validation";
import { useCreatePersona, useUpdatePersona } from "../hooks/usePersonas";
import { Persona } from "../types";
import { getErrorMessage } from "@/lib/api";

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
				sentence_length: persona.sentence_length as
					| "short"
					| "medium"
					| "long"
					| "varied",
				use_metaphors: persona.use_metaphors,
				jargon_level: persona.jargon_level,
				banned_words: persona.banned_words,
				topics: persona.topics,
				audience: persona.audience as
					| "general"
					| "technical"
					| "academic"
					| "casual"
					| "professional",
				purpose: persona.purpose as
					| "blog"
					| "article"
					| "documentation"
					| "marketing"
					| "social"
					| "email",
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

	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<PersonaFormData>({
		resolver: yupResolver(personaSchema),
		defaultValues: getDefaultValues(),
	});

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
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
			{/* Basic Info */}
			<section>
				<h3 className='text-lg font-semibold text-foreground mb-4'>
					Basic Information
				</h3>
				<div className='space-y-4'>
					<Input
						{...register("name")}
						label='Persona Name'
						placeholder='e.g., Tech Blogger, Academic Writer'
						error={errors.name?.message}
					/>
					<TextArea
						{...register("description")}
						label='Description'
						placeholder="Describe this persona's writing style and purpose..."
						error={errors.description?.message}
					/>
				</div>
			</section>

			{/* Writing Samples */}
			<section>
				<h3 className='text-lg font-semibold text-foreground mb-4'>
					Sample Texts
				</h3>
				<p className='text-sm text-foreground-secondary mb-4'>
					Add sample texts that represent your writing style
				</p>
				<Controller
					name='samples'
					control={control}
					render={({ field }) => (
						<TagInput
							values={field.value}
							onChange={field.onChange}
							placeholder='Paste sample text and press Enter'
							isTextArea
						/>
					)}
				/>
				{errors.samples?.message && (
					<p className='text-sm text-error mt-1'>{errors.samples.message}</p>
				)}
			</section>

			{/* Tone Settings */}
			<section>
				<h3 className='text-lg font-semibold text-foreground mb-4'>
					Tone & Style
				</h3>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Controller
						name='formality_level'
						control={control}
						render={({ field }) => (
							<Slider
								label='Formality Level'
								min={1}
								max={10}
								value={field.value}
								onChange={(e) => field.onChange(parseInt(e.target.value))}
							/>
						)}
					/>
					<Controller
						name='creativity_level'
						control={control}
						render={({ field }) => (
							<Slider
								label='Creativity Level'
								min={1}
								max={10}
								value={field.value}
								onChange={(e) => field.onChange(parseInt(e.target.value))}
							/>
						)}
					/>
					<Controller
						name='jargon_level'
						control={control}
						render={({ field }) => (
							<Slider
								label='Jargon Level'
								min={1}
								max={10}
								value={field.value}
								onChange={(e) => field.onChange(parseInt(e.target.value))}
							/>
						)}
					/>
					<Select
						{...register("sentence_length")}
						label='Sentence Length'
						options={PERSONA_CONFIG.SENTENCE_LENGTH_OPTIONS.map((v) => ({
							value: v,
							label: v.charAt(0).toUpperCase() + v.slice(1),
						}))}
						error={errors.sentence_length?.message}
					/>
				</div>

				<div className='mt-4'>
					<label className='flex items-center gap-3 cursor-pointer'>
						<input
							type='checkbox'
							{...register("use_metaphors")}
							className='w-4 h-4 rounded border-border text-primary focus:ring-ring'
						/>
						<span className='text-sm font-medium text-foreground'>
							Use metaphors
						</span>
					</label>
				</div>
			</section>

			{/* Context */}
			<section>
				<h3 className='text-lg font-semibold text-foreground mb-4'>Context</h3>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<Select
						{...register("audience")}
						label='Target Audience'
						options={PERSONA_CONFIG.AUDIENCE_OPTIONS.map((v) => ({
							value: v,
							label: v.charAt(0).toUpperCase() + v.slice(1),
						}))}
					/>
					<Select
						{...register("purpose")}
						label='Content Purpose'
						options={PERSONA_CONFIG.PURPOSE_OPTIONS.map((v) => ({
							value: v,
							label: v.charAt(0).toUpperCase() + v.slice(1),
						}))}
					/>
				</div>

				<div className='mt-4'>
					<label className='block text-sm font-medium text-foreground mb-2'>
						Topics
					</label>
					<Controller
						name='topics'
						control={control}
						render={({ field }) => (
							<TagInput
								values={field.value}
								onChange={field.onChange}
								placeholder='Add topic and press Enter'
							/>
						)}
					/>
				</div>

				<div className='mt-4'>
					<label className='block text-sm font-medium text-foreground mb-2'>
						Banned Words
					</label>
					<Controller
						name='banned_words'
						control={control}
						render={({ field }) => (
							<TagInput
								values={field.value}
								onChange={field.onChange}
								placeholder='Add word to avoid and press Enter'
							/>
						)}
					/>
				</div>
			</section>

			{/* Actions */}
			<div className='flex gap-3 pt-4'>
				<Button type='submit' isLoading={isSubmitting}>
					{mode === "create" ? "Create Persona" : "Save Changes"}
				</Button>
				<Button type='button' variant='secondary' onClick={() => router.back()}>
					Cancel
				</Button>
			</div>
		</form>
	);
}

// Tag Input Component
interface TagInputProps {
	values: string[];
	onChange: (values: string[]) => void;
	placeholder: string;
	isTextArea?: boolean;
}

function TagInput({
	values,
	onChange,
	placeholder,
	isTextArea,
}: TagInputProps) {
	const [input, setInput] = useState("");

	const handleKeyDown = (
		e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		if (e.key === "Enter" && input.trim()) {
			e.preventDefault();
			if (!values.includes(input.trim())) {
				onChange([...values, input.trim()]);
			}
			setInput("");
		}
	};

	const removeTag = (index: number) => {
		onChange(values.filter((_, i) => i !== index));
	};

	return (
		<div className='space-y-2'>
			{isTextArea ? (
				<textarea
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					className='w-full px-3 py-2 rounded-lg border border-border bg-background-surface
            text-foreground placeholder:text-foreground-muted min-h-[80px] resize-y
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
				/>
			) : (
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					className='w-full h-10 px-3 rounded-lg border border-border bg-background-surface
            text-foreground placeholder:text-foreground-muted
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
				/>
			)}
			{values.length > 0 && (
				<div className='flex flex-wrap gap-2'>
					{values.map((value, index) => (
						<span
							key={index}
							className='inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-light text-primary text-sm'
						>
							{isTextArea ? `Sample ${index + 1}` : value}
							<button
								type='button'
								onClick={() => removeTag(index)}
								className='p-0.5 rounded hover:bg-primary/20'
							>
								<X className='h-3 w-3' />
							</button>
						</span>
					))}
				</div>
			)}
		</div>
	);
}
