import { fail, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { passwordFormSchema, profileFormSchema } from './schema';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { logger, nullsToUndefined } from '$lib/utils';
import { hash } from '@node-rs/argon2';

export const load: PageServerLoad = async (event) => {
	const results = await db
		.select()
		.from(table.user)
		.where(eq(table.user.email, event.locals.user?.email ?? ''));
	return {
		profileForm: await superValidate(nullsToUndefined(results[0]), zod(profileFormSchema)),
		passwordForm: await superValidate(zod(passwordFormSchema))
	};
};

export const actions: Actions = {
	profile: async (event) => {
		const form = await superValidate(event, zod(profileFormSchema));
		logger.debug(form);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		if (!event.locals.user?.id) {
			return fail(500, { form, message: 'An error has occurred' });
		}

		try {
			await db
				.update(table.user)
				.set({
					name: form.data.name,
					displayName: form.data.displayName
				})
				.where(eq(table.user.id, event.locals.user.id));
		} catch {
			return fail(500, { form, message: 'An error has occurred' });
		}
	},
	password: async (event) => {
		const form = await superValidate(event, zod(passwordFormSchema));
		logger.debug(form);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		if (!event.locals.user?.id) {
			return fail(500, { form, message: 'An error has occurred' });
		}
		const passwordHash = await hash(form.data.newPassword, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db
				.update(table.user)
				.set({
					passwordHash
				})
				.where(eq(table.user.id, event.locals.user.id));
		} catch {
			return fail(500, { form, message: 'An error has occurred' });
		}
	}
};
