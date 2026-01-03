"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowRight, Sparkles } from "lucide-react";
import {
	Button,
	Input,
	TextArea,
	Select,
	Slider,
	useToast,
} from "@/components/ui";
import { PERSONA_CONFIG } from "@/lib/constants";
import {
	personaSchema,
	PersonaFormData,
} from "@/features/personas/utils/validation";
import { useCreatePersona } from "@/features/personas/hooks/usePersonas";
import { getErrorMessage } from "@/lib/api";

export default function OnboardingPage() {
	const router = useRouter();
	const { showToast } = useToast();
	const createPersona = useCreatePersona();
	const [step, setStep] = useState(1);

	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<PersonaFormData>({
		resolver: yupResolver(personaSchema),
		defaultValues: {
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
		},
	});

	const handleSkip = () => {
		router.push("/write");
	};

	const onSubmit = async (data: PersonaFormData) => {
		try {
			await createPersona.mutateAsync(data);
			showToast("success", "Persona created! You can now start writing.");
			router.push("/write");
		} catch (err) {
			showToast("error", getErrorMessage(err));
		}
	};

	return (
		<div className='min-h-screen bg-background flex items-center justify-center p-6'>
			<div className='w-full max-w-xl'>
				{/* Header */}
				<div className='text-center mb-8'>
					<div className='w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4'>
						<Sparkles className='h-7 w-7 text-primary-foreground' />
					</div>
					<h1 className='text-2xl font-bold text-foreground'>
						Create Your Writing Voice
					</h1>
					<p className='text-foreground-secondary mt-2'>
						Set up a persona to help AI match your unique style.
					</p>
				</div>

				{/* Form */}
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='bg-background-surface rounded-xl border border-border p-6 space-y-6'
				>
					{step === 1 && (
						<>
							<Input
								{...register("name")}
								label='Persona Name'
								placeholder='e.g., Professional Blogger, Casual Writer'
								error={errors.name?.message}
							/>

							<TextArea
								{...register("description")}
								label='Description'
								placeholder='Describe the writing style and tone...'
								error={errors.description?.message}
							/>

							<div className='grid grid-cols-2 gap-4'>
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

							<Button
								type='button'
								onClick={() => setStep(2)}
								className='w-full'
							>
								Continue
								<ArrowRight className='h-4 w-4 ml-1' />
							</Button>
						</>
					)}

					{step === 2 && (
						<>
							<div className='space-y-4'>
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

								<Select
									{...register("sentence_length")}
									label='Sentence Length'
									options={PERSONA_CONFIG.SENTENCE_LENGTH_OPTIONS.map((v) => ({
										value: v,
										label: v.charAt(0).toUpperCase() + v.slice(1),
									}))}
								/>

								<label className='flex items-center gap-3 cursor-pointer'>
									<input
										type='checkbox'
										{...register("use_metaphors")}
										className='w-4 h-4 rounded border-border text-primary focus:ring-ring'
									/>
									<span className='text-sm font-medium text-foreground'>
										Use metaphors and analogies
									</span>
								</label>
							</div>

							<div className='flex gap-3'>
								<Button
									type='button'
									variant='secondary'
									onClick={() => setStep(1)}
									className='flex-1'
								>
									Back
								</Button>
								<Button
									type='submit'
									isLoading={isSubmitting}
									className='flex-1'
								>
									Create Persona
								</Button>
							</div>
						</>
					)}
				</form>

				{/* Skip Option */}
				<button
					onClick={handleSkip}
					className='w-full mt-4 text-center text-sm text-foreground-muted hover:text-foreground transition-colors'
				>
					Skip for now — I&apos;ll set this up later
				</button>
			</div>
		</div>
	);
}
