<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import type { Snippet } from 'svelte';
	import '../app.css';
	import routes from '../lib/routes';
	import type { PageData } from './$types';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { cn } from '$lib/utils';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	let { children, data }: { children: Snippet; data: PageData } = $props();
	let isControlDown = $state(false);
	let isMetaDown = $state(false);
	let isShiftDown = $state(false);
	let keyDown = $state('');
	const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
	function onkeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'Control':
				isControlDown = true;
				break;
			case 'Meta':
				isMetaDown = true;
				break;
			case 'Shift':
				isShiftDown = true;
				break;
			default:
				keyDown = event.key.toLowerCase();
				break;
		}
		if (((isMac && isMetaDown) || (!isMac && isControlDown)) && isShiftDown && keyDown === 'p') {
			event.preventDefault();
			goto('/profile');
		}
	}
	function onkeyup(event: KeyboardEvent) {
		switch (event.key) {
			case 'Control':
				isControlDown = false;
				break;
			case 'Meta':
				isMetaDown = false;
				break;
			case 'Shift':
				isShiftDown = false;
				break;
			default:
				keyDown = '';
				break;
		}
	}
</script>

<svelte:window {onkeydown} {onkeyup} />

<header class="typography mb-8">
	<nav class="flex w-full gap-2 shadow">
		{#each routes as item}
			<Button variant="link" href={item.path}>{item.name}</Button>
		{/each}
		{#if data.user}
			<DropdownMenu.Root>
				<div class="ml-auto">
					<DropdownMenu.Trigger class={cn(buttonVariants({ variant: 'link' }), 'user')}>
						<Avatar.Root class="h-6 w-6">
							<Avatar.Image
								src={`https://www.gravatar.com/avatar/${data.gravatarHash}?s=24`}
								alt={data.user.email}
							/>
						</Avatar.Root>
						{data.user.email}
					</DropdownMenu.Trigger>
				</div>
				<DropdownMenu.Content class="w-56">
					<DropdownMenu.Group>
						<DropdownMenu.GroupHeading>My Account</DropdownMenu.GroupHeading>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<a href="/profile">
								<DropdownMenu.Item>
									<span>Profile</span>
									<DropdownMenu.Shortcut>⇧{isMac ? '⌘' : '^'}P</DropdownMenu.Shortcut>
								</DropdownMenu.Item>
							</a>
						</DropdownMenu.Group>
						<DropdownMenu.Group>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								<form method="post" action="/?/logout" use:enhance>
									<button>Sign out</button>
								</form>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
	</nav>
</header>

<div class="typography">
	{@render children()}
</div>
