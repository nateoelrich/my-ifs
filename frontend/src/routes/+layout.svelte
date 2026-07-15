<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import BottomNav from '$lib/components/BottomNav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>My IFS — Internal Family Systems Self-Practice</title>
	<meta name="description" content="A private, guided tool for IFS self-practice. Identify your parts, track sessions, and map your inner family system." />
	<meta property="og:title" content="My IFS — Internal Family Systems Self-Practice" />
	<meta property="og:description" content="A private, guided tool for IFS self-practice. Identify your parts, track sessions, and map your inner family system." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://myifs.app" />
</svelte:head>

<div class="pb-[72px] md:pb-0">
	{@render children()}
</div>

<BottomNav />
