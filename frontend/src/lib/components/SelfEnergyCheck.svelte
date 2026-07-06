<script lang="ts">
	import { EIGHT_CS } from '$lib/data/session-constants';

	interface Props {
		selected: string[];
		onchange?: (selected: string[]) => void;
	}

	let { selected = $bindable([]), onchange }: Props = $props();

	function toggle(c: string) {
		if (selected.includes(c)) {
			selected = selected.filter((x) => x !== c);
		} else {
			selected = [...selected, c];
		}
		onchange?.(selected);
	}

	const count = $derived(selected.length);

	const energyLabel = $derived(
		count <= 2 ? 'A part may be leading'
		: count <= 4 ? 'Some Self-energy present'
		: count <= 6 ? 'Growing Self-energy'
		: 'Strongly Self-led'
	);

	const energyColor = $derived(
		count <= 2 ? '#a78bfa'   // muted violet
		: count <= 4 ? '#8b5cf6'
		: count <= 6 ? '#7c3aed'
		: '#5b21b6'
	);
</script>

<div class="space-y-4">
	<div class="flex flex-wrap gap-2">
		{#each EIGHT_CS as c}
			{@const on = selected.includes(c)}
			<button
				type="button"
				onclick={() => toggle(c)}
				class="rounded-full px-3.5 py-1.5 text-sm font-medium transition-all border"
				class:selected={on}
				style={on ? `background-color: ${energyColor}22; color: ${energyColor}; border-color: ${energyColor}60;` : ''}
			>
				{c}
			</button>
		{/each}
	</div>

	{#if count > 0}
		<div class="flex items-center gap-2">
			<div class="h-1.5 flex-1 rounded-full bg-stone-100 overflow-hidden">
				<div
					class="h-full rounded-full transition-all duration-300"
					style="width: {(count / 8) * 100}%; background-color: {energyColor};"
				></div>
			</div>
			<span class="text-xs text-stone-500 whitespace-nowrap">{energyLabel}</span>
		</div>
	{/if}
</div>

<style>
	button {
		color: var(--color-stone-500, #78716c);
		border-color: var(--color-stone-200, #e7e5e4);
		background: white;
	}
	button:hover:not(.selected) {
		border-color: var(--color-stone-300, #d6d3d1);
		color: var(--color-stone-700, #44403c);
		background: var(--color-stone-50, #fafaf9);
	}
</style>
