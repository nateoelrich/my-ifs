<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		variant?: 'default' | 'primary';
		class?: string;
		children: Snippet;
	}

	let { title, variant = 'default', class: klass = '', children }: Props = $props();

	const base =
		variant === 'primary'
			? 'bg-primary-50 border-primary-100'
			: 'bg-white border-stone-100';
</script>

<section class="rounded-2xl border p-4 sm:p-6 {base} {klass}">
	{#if title}
		<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">{title}</h2>
	{/if}
	{@render children()}
</section>
