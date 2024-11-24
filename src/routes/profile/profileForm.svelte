<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { profileFormSchema, type ProfileFormSchema } from './schema';
	import * as Form from '$lib/components/ui/form';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	let { data }: { data: SuperValidated<Infer<ProfileFormSchema>> } = $props();
	const form = superForm(data, {
		validators: zodClient(profileFormSchema),
		resetForm: false
	});

	const { form: formData, enhance } = form;
</script>

<form method="post" action="?/profile" use:enhance class="w-96">
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Input
					{...props}
					bind:value={$formData.email}
					readonly
					class="cursor-not-allowed text-gray-300 focus:border-gray-300"
				/>
			{/snippet}
		</Form.Control>
		<Form.FormFieldErrors />
	</Form.Field>
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Name</Form.Label>
				<Input {...props} bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
		<Form.FormFieldErrors />
	</Form.Field>
	<Form.Field {form} name="displayName">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Display Name</Form.Label>
				<Input {...props} bind:value={$formData.displayName} />
			{/snippet}
		</Form.Control>
		<Form.FormFieldErrors />
	</Form.Field>
	<div id="buttons">
		<Form.Button class="button">Save</Form.Button>
		<Form.Button class="button" type="reset">Reset</Form.Button>
	</div>
</form>
