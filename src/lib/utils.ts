import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import pino from 'pino';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type RecursivelyReplaceNullWithUndefined<T> = T extends null
	? undefined
	: T extends Date
		? T
		: {
				[K in keyof T]: T[K] extends (infer U)[]
					? RecursivelyReplaceNullWithUndefined<U>[]
					: RecursivelyReplaceNullWithUndefined<T[K]>;
			};

export function nullsToUndefined<T>(obj: T): RecursivelyReplaceNullWithUndefined<T> {
	if (obj === null || obj === undefined) {
		return undefined as never;
	}

	// object check based on: https://stackoverflow.com/a/51458052/6489012
	if (obj.constructor.name === 'Object') {
		for (const key in obj) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			obj[key] = nullsToUndefined(obj[key]) as any;
		}
	}
	return obj as RecursivelyReplaceNullWithUndefined<T>;
}
export type NoUndefinedField<T> = { [P in keyof T]: Exclude<T[P], null | undefined> };

export const logger = pino({
	level: 'debug',
	browser: { asObject: true }
});
