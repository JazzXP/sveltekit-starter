import { logger } from '$lib/utils';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const textEncoder = new TextEncoder();
	const gravatarHash = locals.user?.email
		? Array.from(
				new Uint8Array(
					await crypto.subtle.digest(
						'SHA-256',
						textEncoder.encode(locals.user.email.toLowerCase().trim())
					)
				)
			)
				.map((b) => b.toString(16).padStart(2, '0'))
				.join('')
		: '';
	logger.debug('layout');
	return { user: locals.user, gravatarHash };
};
