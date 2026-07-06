<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import BottomNav from '$lib/components/BottomNav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>My IFS</title>
</svelte:head>

<div class="pb-[72px] md:pb-0">
	{@render children()}
</div>

<BottomNav />
