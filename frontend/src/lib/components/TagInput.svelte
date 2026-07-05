<script lang="ts">
	import { fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	interface Props {
		tags: string[];
		placeholder?: string;
		suggestions?: string[];
		pillMode?: boolean;
		accentColor?: string;
	}

	let {
		tags = $bindable([]),
		placeholder = 'Type and press Enter',
		suggestions = [],
		pillMode = false,
		accentColor
	}: Props = $props();

	let input = $state('');
	let showSuggestions = $state(false);

	function addTag(value: string) {
		const trimmed = value.trim();
		if (trimmed && !tags.includes(trimmed)) {
			tags = [...tags, trimmed];
		}
		input = '';
		showSuggestions = false;
	}

	function removeTag(tag: string) {
		tags = tags.filter((t) => t !== tag);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTag(input);
		} else if (e.key === 'Backspace' && !input && tags.length > 0) {
			tags = tags.slice(0, -1);
		}
	}

	const filteredSuggestions = $derived(
		suggestions.filter((s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s))
	);

	// CSS variables for the accent color — hex alpha suffixes keep it simple
	const accentVars = $derived(
		accentColor
			? `--tag-accent: ${accentColor}; --tag-bubble-border: ${accentColor}50; --tag-bubble-bg: ${accentColor}0F; --tag-chip-bg: ${accentColor}20; --tag-chip-text: ${accentColor};`
			: ''
	);
</script>

<div class="space-y-2" style={accentVars}>
	{#if pillMode && suggestions.length > 0}
		{@const unselected = suggestions.filter((s) => !tags.includes(s))}

		<!-- Bubble: collected tags -->
		<div
			class="bubble rounded-xl border-2 p-3 min-h-[54px] flex flex-wrap items-start gap-2 transition-colors duration-300"
		>
			{#if tags.length > 0}
				{#each tags as tag (tag)}
					<span
						in:fly={{ y: 10, duration: 280, easing: quintOut }}
						out:scale={{ duration: 140, start: 0.7 }}
						class="chip inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium leading-none"
					>
						{tag}
						<button
							type="button"
							onclick={() => removeTag(tag)}
							class="chip-remove opacity-50 hover:opacity-100 transition-opacity leading-none"
							aria-label="Remove {tag}"
						>×</button>
					</span>
				{/each}
			{:else}
				<span class="text-stone-300 text-sm self-center">tap below to collect</span>
			{/if}
		</div>

		<!-- Available pills -->
		{#if unselected.length > 0}
			<div class="flex flex-wrap gap-2">
				{#each unselected as s (s)}
					<button
						type="button"
						out:scale={{ duration: 150, start: 0.7 }}
						onclick={() => addTag(s)}
						class="px-3 py-1.5 rounded-full text-sm border border-stone-200 bg-white text-stone-600 hover:border-primary-200 hover:text-primary-600 hover:bg-primary-50 transition-colors leading-none"
					>
						{s}
					</button>
				{/each}
			</div>
		{/if}
	{:else if !pillMode && tags.length > 0}
		<div class="flex flex-wrap gap-2">
			{#each tags as tag}
				<span class="inline-flex items-center gap-1.5 bg-primary-50 text-primary-800 rounded-full px-3 py-1 text-sm">
					{tag}
					<button
						type="button"
						onclick={() => removeTag(tag)}
						class="text-primary-400 hover:text-primary-700 leading-none"
						aria-label="Remove {tag}"
					>×</button>
				</span>
			{/each}
		</div>
	{/if}

	<div class="relative">
		<input
			type="text"
			bind:value={input}
			onkeydown={handleKeydown}
			onfocus={() => (showSuggestions = true)}
			onblur={() => setTimeout(() => (showSuggestions = false), 150)}
			{placeholder}
			class="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm"
			style={accentColor ? `--tw-ring-color: ${accentColor}40;` : ''}
		/>

		{#if showSuggestions && filteredSuggestions.length > 0}
			<ul class="absolute z-10 mt-1 w-full bg-white border border-stone-200 rounded-lg shadow-md overflow-auto max-h-48">
				{#each filteredSuggestions as s}
					<li>
						<button
							type="button"
							class="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-primary-50 hover:text-primary-700"
							onmousedown={() => addTag(s)}
						>
							{s}
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style>
	.bubble {
		border-color: var(--tag-bubble-border, var(--color-stone-200));
		background-color: var(--tag-bubble-bg, var(--color-stone-50, #f8f7f4));
		border-style: dashed;
	}

	.bubble:has(.chip) {
		border-style: solid;
	}

	.chip {
		background-color: var(--tag-chip-bg, var(--color-primary-50));
		color: var(--tag-chip-text, var(--color-primary-800));
	}

	.chip-remove {
		color: var(--tag-chip-text, var(--color-primary-400));
	}
</style>
