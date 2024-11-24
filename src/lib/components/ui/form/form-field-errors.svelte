<script lang="ts">
	import * as FormPrimitive from 'formsnap';
	import type { WithoutChild } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	import { fade } from 'svelte/transition';

	let {
		ref = $bindable(null),
		class: className,
		errorClasses,
		children: childrenProp,
		...restProps
	}: WithoutChild<FormPrimitive.FieldErrorsProps> & {
		errorClasses?: string | undefined | null;
	} = $props();
</script>

<FormPrimitive.FieldErrors
	class={cn('text-[0.8rem] font-medium text-destructive', className)}
	{...restProps}
>
	{#snippet children({ errors, errorProps })}
		<div
			class={cn(
				'transition-[max-height] duration-500 ease-in-out',
				errors.length > 0 ? 'max-h-56' : 'max-h-0'
			)}
		>
			{#if childrenProp}
				{@render childrenProp({ errors, errorProps })}
			{:else}
				{#each errors as error}
					<div
						{...errorProps}
						transition:fade={{ delay: 100, duration: 500 }}
						class={cn(errorClasses)}
					>
						{error}
					</div>
				{/each}
			{/if}
		</div>
	{/snippet}
</FormPrimitive.FieldErrors>
