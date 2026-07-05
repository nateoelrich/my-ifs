<script lang="ts">
	import { PART_SWATCHES, DEFAULT_PART_COLOR } from '$lib/data/part-constants';

	interface Props {
		value?: string;
	}

	let { value = $bindable(DEFAULT_PART_COLOR) }: Props = $props();
</script>

<div class="grid grid-cols-6 gap-2.5">
	{#each PART_SWATCHES as swatch}
		<button
			type="button"
			onclick={() => (value = swatch.hex)}
			title={swatch.label}
			aria-label="{swatch.label}{value === swatch.hex ? ' (selected)' : ''}"
			class="w-9 h-9 rounded-full transition-all duration-150 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-400 {value === swatch.hex
				? 'ring-2 ring-offset-2 ring-stone-400 scale-110'
				: 'opacity-75 hover:opacity-100 hover:scale-105'}"
			style="background-color: {swatch.hex}"
		>
			{#if value === swatch.hex}
				<span
					class="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow"
					aria-hidden="true">✓</span
				>
			{/if}
		</button>
	{/each}
</div>
