<script lang="ts">
	import { fly } from 'svelte/transition';

	interface Props {
		text: string;
		label?: string;
	}

	let { text, label = 'Learn more' }: Props = $props();

	let open = $state(false);
	let triggerEl = $state<HTMLButtonElement | undefined>(undefined);

	function toggle() {
		open = !open;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}

	function handleClickOutside(e: MouseEvent) {
		if (triggerEl && !triggerEl.closest('.tooltip-root')?.contains(e.target as Node)) {
			open = false;
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} on:click={handleClickOutside} />

<span class="tooltip-root inline-flex items-center relative">
	<button
		bind:this={triggerEl}
		type="button"
		onclick={(e) => { e.stopPropagation(); toggle(); }}
		aria-label={label}
		aria-expanded={open}
		class="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-semibold border transition-colors flex-shrink-0"
		class:active={open}
	>?</button>

	{#if open}
		<div
			class="tooltip-card"
			role="tooltip"
			in:fly={{ y: -4, duration: 140 }}
		>
			{text}
		</div>
	{/if}
</span>

<style>
	button {
		color: var(--color-stone-400, #a8a29e);
		border-color: var(--color-stone-200, #e7e5e4);
		background: white;
		cursor: pointer;
		vertical-align: middle;
	}
	button:hover, button.active {
		color: var(--color-primary-600, #7c3aed);
		border-color: var(--color-primary-300, #c4b5fd);
		background: var(--color-primary-50, #f5f3ff);
	}

	.tooltip-card {
		position: absolute;
		bottom: calc(100% + 6px);
		left: 0;
		z-index: 50;
		width: 220px;
		background: white;
		border: 1px solid var(--color-stone-100, #f5f5f4);
		border-radius: 10px;
		padding: 10px 12px;
		font-size: 12px;
		line-height: 1.5;
		color: var(--color-stone-600, #57534e);
		box-shadow: 0 4px 16px rgba(0,0,0,0.10);
		pointer-events: none;
	}
</style>
