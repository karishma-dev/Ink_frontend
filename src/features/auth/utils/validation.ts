import * as yup from "yup";
import { VALIDATION } from "@/lib/constants";

export const loginSchema = yup.object({
	email: yup
		.string()
		.required("Email is required")
		.email("Please enter a valid email"),
	password: yup
		.string()
		.required("Password is required")
		.min(
			VALIDATION.PASSWORD_MIN_LENGTH,
			`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
		),
});

export const registerSchema = yup.object({
	username: yup
		.string()
		.required("Username is required")
		.min(
			VALIDATION.USERNAME_MIN_LENGTH,
			`Username must be at least ${VALIDATION.USERNAME_MIN_LENGTH} characters`
		)
		.max(
			VALIDATION.USERNAME_MAX_LENGTH,
			`Username must be at most ${VALIDATION.USERNAME_MAX_LENGTH} characters`
		),
	email: yup
		.string()
		.required("Email is required")
		.email("Please enter a valid email"),
	password: yup
		.string()
		.required("Password is required")
		.min(
			VALIDATION.PASSWORD_MIN_LENGTH,
			`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
		),
	confirmPassword: yup
		.string()
		.required("Please confirm your password")
		.oneOf([yup.ref("password")], "Passwords must match"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;
