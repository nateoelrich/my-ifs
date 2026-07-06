<script lang="ts">
	import { base } from '$app/paths';
	import Nav from '$lib/components/Nav.svelte';
</script>

<Nav />

<main class="max-w-2xl mx-auto px-4 py-8">
	<a href="{base}/sessions" class="text-sm text-stone-400 hover:text-stone-600 transition-colors mb-6 inline-block">← Journal</a>
	<div class="text-center py-20 text-stone-400">
		<p class="text-lg font-serif italic text-stone-500">Session detail — coming soon</p>
	</div>
</main>
