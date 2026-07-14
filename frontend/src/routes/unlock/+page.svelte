<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { accessStore } from '$lib/data/access.svelte';

	let status = $state<'checking' | 'success' | 'error'>('checking');

	onMount(() => {
		const key = new URLSearchParams(window.location.search).get('k') ?? '';
		if (key && accessStore.unlockWithKey(key)) {
			status = 'success';
			setTimeout(() => goto(`${base}/parts`), 900);
		} else {
			status = 'error';
		}
	});
</script>

<svelte:head>
	<title>Unlocking — My IFS</title>
</svelte:head>

<main class="min-h-screen flex items-center justify-center px-4">
	<div class="text-center max-w-sm">
		{#if status === 'checking'}
			<div class="w-8 h-8 rounded-full border-2 border-primary-300 border-t-primary-600 animate-spin mx-auto mb-6"></div>
			<p class="text-stone-500 text-sm">Verifying your access…</p>

		{:else if status === 'success'}
			<div class="flex items-end justify-center gap-1.5 mb-6">
				<div class="w-3 h-3 rounded-full bg-exile-700 opacity-80"></div>
				<div class="w-4 h-4 rounded-full bg-primary-600 mb-0.5"></div>
				<div class="w-3 h-3 rounded-full bg-manager-700 opacity-80"></div>
			</div>
			<h1 class="font-serif text-2xl text-stone-800 mb-2">Welcome to My IFS</h1>
			<p class="text-stone-500 text-sm">Full access unlocked. Taking you to your parts…</p>

		{:else}
			<p class="font-serif text-xl text-stone-700 mb-3">This link doesn't look right</p>
			<p class="text-stone-500 text-sm leading-relaxed mb-6">
				The access link may have expired or been modified. Try again from your payment confirmation email, or <a href="mailto:nate.oelrich@gmail.com" class="text-primary-600 hover:underline">get in touch</a>.
			</p>
			<a href="{base}/parts" class="text-sm text-primary-600 hover:text-primary-800 transition-colors">
				← Back to My IFS
			</a>
		{/if}
	</div>
</main>
