"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Input, TextArea, Slider, Select } from "@/components/ui";
import { PERSONA_CONFIG } from "@/lib/constants";
import { PersonaFormData } from "../utils/validation";
import { TagInput } from "./TagInput";

export function BasicInfoSection() {
	const {
		register,
		formState: { errors },
	} = useFormContext<PersonaFormData>();

	return (
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
	);
}

export function WritingSamplesSection() {
	const {
		control,
		formState: { errors },
	} = useFormContext<PersonaFormData>();

	return (
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
	);
}

export function ToneSettingsSection() {
	const {
		register,
		control,
		formState: { errors },
	} = useFormContext<PersonaFormData>();

	return (
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
	);
}

export function ContextSection() {
	const { register, control } = useFormContext<PersonaFormData>();

	return (
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
	);
}
