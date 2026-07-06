<script lang="ts">
	import type { Part } from '$lib/data/types';
	import { t } from '$lib/i18n.svelte';
	import PartAvatar from './PartAvatar.svelte';
	import { ROLE_LABEL_MAP } from '$lib/data/part-constants';

	interface Props {
		parts: Part[];
		selectedId?: string;
		onselect: (partId: string | undefined) => void;
	}

	let { parts, selectedId, onselect }: Props = $props();

	function pick(id: string) {
		onselect(selectedId === id ? undefined : id);
	}
</script>

<div class="space-y-2">
	{#if parts.length === 0}
		<p class="text-sm text-stone-400 italic">{t('partSelector.noPartsYet')}</p>
	{:else}
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
			{#each parts as part}
				{@const selected = selectedId === part.id}
				<button
					type="button"
					onclick={() => pick(part.id)}
					class="flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all"
					style={selected
						? `border-color: ${part.color ?? '#7c3aed'}80; background-color: ${part.color ?? '#7c3aed'}12;`
						: 'border-color: var(--color-stone-200, #e7e5e4); background: white;'}
				>
					<PartAvatar size="sm" color={part.color} name={part.name} />
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-stone-800 truncate">{part.name}</p>
						{#if part.roleType}
							<p class="text-xs text-stone-400">{t(`roles.${part.roleType}.label`)}</p>
						{/if}
					</div>
					{#if selected}
						<span class="text-xs font-semibold ml-1" style="color: {part.color ?? '#7c3aed'};">✓</span>
					{/if}
				</button>
			{/each}
		</div>

		<button
			type="button"
			onclick={() => onselect(undefined)}
			class="text-sm text-stone-400 hover:text-stone-600 transition-colors py-1"
			class:underline={selectedId === undefined}
		>
			{t('partSelector.notSure')}
		</button>
	{/if}
</div>
