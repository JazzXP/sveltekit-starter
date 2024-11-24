<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { PageData } from './$types';
	import PasswordForm from './passwordForm.svelte';
	import ProfileForm from './profileForm.svelte';
	let { data }: { data: PageData } = $props();
</script>

<div id="content" class="flex flex-row justify-center gap-4">
	<Card.Root class="my-2">
		<Card.Header>
			<Card.Title>Profile Details</Card.Title>
		</Card.Header>
		<Card.Content>
			<ProfileForm data={data.profileForm} />
		</Card.Content>
	</Card.Root>
	<Card.Root class="my-2">
		<Card.Header>
			<Card.Title>Change Password</Card.Title>
		</Card.Header>
		<Card.Content>
			<PasswordForm data={data.passwordForm} /></Card.Content
		>
	</Card.Root>
</div>
