import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const REDIRECT_LOGGED_IN = '/';
export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, REDIRECT_LOGGED_IN);
	}
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	login: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const results = await db.select().from(table.user).where(eq(table.user.email, form.data.email));

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, { message: 'Incorrect email or password' });
		}

		const validPassword = await verify(existingUser.passwordHash, form.data.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, { message: 'Incorrect email or password' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, REDIRECT_LOGGED_IN);
	},
	register: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const userId = generateUserId();
		const passwordHash = await hash(form.data.password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db.insert(table.user).values({ id: userId, email: form.data.email, passwordHash });

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch {
			return fail(500, { message: 'An error has occurred' });
		}
		return redirect(302, REDIRECT_LOGGED_IN);
	}
};

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}
