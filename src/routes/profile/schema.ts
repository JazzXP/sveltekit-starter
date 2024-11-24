import { z } from 'zod';

export const profileFormSchema = z.object({
	name: z.string().min(2).max(50),
	displayName: z.string().min(2).max(50),
	email: z.string().email()
});

export const passwordFormSchema = z
	.object({
		oldPassword: z.string().min(4).max(255),
		newPassword: z.string().min(4).max(255),
		newPasswordConfirm: z.string().min(4).max(255)
	})
	.refine((schema) => schema.newPassword === schema.newPasswordConfirm, {
		message: 'Passwords do not match.',
		path: ['newPasswordConfirm']
	});

export type ProfileFormSchema = typeof profileFormSchema;
export type PasswordFormSchema = typeof passwordFormSchema;
