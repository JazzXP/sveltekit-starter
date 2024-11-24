<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './schema';
	import * as Form from '$lib/components/ui/form/index.js';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	let { data }: { data: SuperValidated<Infer<FormSchema>> } = $props();
	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="post" action="?/login" use:enhance>
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Input {...props} bind:value={$formData.email} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password</Form.Label>
				<Input {...props} type="password" bind:value={$formData.password} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<div id="buttons">
		<Form.Button class="button">Login</Form.Button>
		<Form.Button class="button" formaction="?/register" variant="outline">Register</Form.Button>
	</div>
</form>

<style lang="scss">
	#buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		padding-top: 1rem;
	}
	:global(.button) {
		width: 5rem;
	}
	:global(.label) {
		margin-top: 0.5rem;
	}
</style>
