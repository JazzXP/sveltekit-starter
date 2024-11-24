<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { PageData } from './$types';
	import LoginForm from './loginForm.svelte';
	let { data }: { data: PageData } = $props();
</script>

<div id="content">
	<Card.Root>
		<Card.Header>
			<Card.Title>Login/Register</Card.Title>
		</Card.Header>
		<Card.Content>
			<LoginForm data={data.form} />
		</Card.Content>
	</Card.Root>
</div>

<style lang="scss">
	#content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
