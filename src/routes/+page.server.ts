import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const LOGOUT_REDIRECT = '/login';
export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, LOGOUT_REDIRECT);
	}
	return { user: event.locals.user };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event.cookies);

		return redirect(302, LOGOUT_REDIRECT);
	}
};
