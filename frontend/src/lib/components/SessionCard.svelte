<script lang="ts">
	import { base } from '$app/paths';
	import type { Session, Part } from '$lib/data/types';
	import { formatDate } from '$lib/utils/format';
	import { t } from '$lib/i18n.svelte';
	import PartAvatar from './PartAvatar.svelte';

	interface Props {
		session: Session;
		linkedPart?: Part;
	}

	let { session, linkedPart }: Props = $props();

	const label = $derived(
		session.protocol && session.protocol !== 'free'
			? t(`protocolLabels.${session.protocol}`)
			: t(`sessionTypes.${session.type}`)
	);

	const accentColor = $derived(linkedPart?.color ?? '#9E968E');

	const preview = $derived(
		session.context?.trim() || session.whatIsItDoing?.trim() || session.notes?.trim() || ''
	);
</script>

<a
	href="{base}/sessions/{session.id}"
	class="group block rounded-2xl border transition-all hover:shadow-card overflow-hidden"
	style="border-color: {accentColor}28; background: linear-gradient(160deg, {accentColor}14 0%, {accentColor}05 45%, white 80%);"
>
	<div class="px-5 py-4">
		<div class="flex items-start gap-3">
			{#if linkedPart}
				<PartAvatar size="sm" color={linkedPart.color} name={linkedPart.name} />
			{:else}
				<div class="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 text-stone-400 text-xs font-medium">◎</div>
			{/if}

			<div class="flex-1 min-w-0">
				<div class="flex items-center justify-between gap-2 mb-1">
					<span class="text-xs font-medium px-2 py-0.5 rounded-full" style="background-color: {accentColor}18; color: {accentColor};">{label}</span>
					<span class="text-xs text-stone-300 flex-shrink-0">{formatDate(session.createdAt)}</span>
				</div>

				{#if linkedPart}
					<p class="text-sm font-medium text-stone-700 truncate">{linkedPart.name}</p>
				{:else if session.newPartName}
					<p class="text-sm font-medium text-stone-700 truncate">{session.newPartName} <span class="text-stone-400 font-normal">{t('sessions.newLabel')}</span></p>
				{/if}

				{#if preview}
					<p class="text-sm text-stone-500 mt-0.5 line-clamp-2">{preview}</p>
				{/if}

				{#if session.emotions.length > 0}
					<div class="flex flex-wrap gap-1 mt-2">
						{#each session.emotions.slice(0, 4) as e}
							<span class="text-xs px-2 py-0.5 rounded-full bg-stone-50 border border-stone-100 text-stone-500">{e}</span>
						{/each}
						{#if session.emotions.length > 4}
							<span class="text-xs text-stone-300">+{session.emotions.length - 4}</span>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
</a>
