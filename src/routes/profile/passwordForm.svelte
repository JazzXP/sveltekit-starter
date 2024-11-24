<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { passwordFormSchema, type PasswordFormSchema } from './schema';
	import * as Form from '$lib/components/ui/form';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	let { data }: { data: SuperValidated<Infer<PasswordFormSchema>> } = $props();
	const form = superForm(data, {
		validators: zodClient(passwordFormSchema),
		resetForm: false
	});

	const { form: formData, enhance } = form;
</script>

<form method="post" action="?/password" use:enhance class="w-96">
	<Form.Field {form} name="oldPassword">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Old Password</Form.Label>
				<Input type="password" {...props} bind:value={$formData.oldPassword} />
			{/snippet}
		</Form.Control>
		<Form.FormFieldErrors />
	</Form.Field>
	<Form.Field {form} name="newPassword">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>New Password</Form.Label>
				<Input type="password" {...props} bind:value={$formData.newPassword} />
			{/snippet}
		</Form.Control>
		<Form.FormFieldErrors />
	</Form.Field>
	<Form.Field {form} name="newPasswordConfirm">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Confirm New Password</Form.Label>
				<Input type="password" {...props} bind:value={$formData.newPasswordConfirm} />
			{/snippet}
		</Form.Control>
		<Form.FormFieldErrors />
	</Form.Field>
	<div id="buttons">
		<Form.Button class="button">Update Password</Form.Button>
	</div>
</form>
