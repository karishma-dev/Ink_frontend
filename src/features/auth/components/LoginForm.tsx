"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useAuth, getErrorMessage } from "../hooks/useAuth";
import { loginSchema, LoginFormData } from "../utils/validation";

export function LoginForm() {
	const { login } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: yupResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginFormData) => {
		try {
			setError(null);
			await login(data);
		} catch (err) {
			setError(getErrorMessage(err));
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
			{error && (
				<div className='p-3 rounded-lg bg-error-light text-error text-sm'>
					{error}
				</div>
			)}

			<div className='relative'>
				<Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted' />
				<Input
					{...register("email")}
					type='email'
					placeholder='Email address'
					className='pl-10'
					error={errors.email?.message}
					autoComplete='email'
				/>
			</div>

			<div className='relative'>
				<Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted' />
				<Input
					{...register("password")}
					type={showPassword ? "text" : "password"}
					placeholder='Password'
					className='pl-10 pr-10'
					error={errors.password?.message}
					autoComplete='current-password'
				/>
				<button
					type='button'
					onClick={() => setShowPassword(!showPassword)}
					className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors'
					aria-label={showPassword ? "Hide password" : "Show password"}
				>
					{showPassword ? (
						<EyeOff className='h-5 w-5' />
					) : (
						<Eye className='h-5 w-5' />
					)}
				</button>
			</div>

			<Button
				type='submit'
				className='w-full'
				size='lg'
				isLoading={isSubmitting}
			>
				Sign In
			</Button>

			<p className='text-center text-sm text-foreground-secondary'>
				Don&apos;t have an account?{" "}
				<Link
					href='/register'
					className='text-primary font-medium hover:underline'
				>
					Create one
				</Link>
			</p>
		</form>
	);
}
