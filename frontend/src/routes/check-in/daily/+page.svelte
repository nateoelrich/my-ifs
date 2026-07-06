<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { fade } from 'svelte/transition';
	import { dataStore } from '$lib/data/workspace.svelte';
	import { t } from '$lib/i18n.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import PartAvatar from '$lib/components/PartAvatar.svelte';

	const MOOD_EMOJIS: Record<number, string> = { 1: '😔', 2: '😕', 3: '😐', 4: '🙂', 5: '😌' };

	let moodScore = $state<number | undefined>(undefined);
	let selfEnergyScore = $state<number | undefined>(undefined);
	let activeParts = $state<string[]>([]);
	let partsMessage = $state('');
	let saved = $state(false);

	function togglePart(id: string) {
		activeParts = activeParts.includes(id)
			? activeParts.filter((x) => x !== id)
			: [...activeParts, id];
	}

	function save() {
		const session = dataStore.createSession({
			type: 'daily',
			emotions: [],
			selfEnergyQualities: [],
			linkedPartId: activeParts.length === 1 ? activeParts[0] : undefined,
			daily: {
				moodScore,
				selfEnergyScore,
				activeParts,
				partsMessage: partsMessage.trim() || undefined
			}
		});
		saved = true;
		setTimeout(() => goto(`${base}/sessions/${session.id}`), 1100);
	}
</script>

<header class="sticky top-0 z-10 bg-canvas/80 backdrop-blur-sm border-b border-stone-100/60 px-6 py-3 flex items-center">
	<a href="{base}/sessions" class="text-sm text-stone-400 hover:text-stone-600 transition-colors min-h-[44px] flex items-center">{t('daily.header')}</a>
</header>

<main class="max-w-lg mx-auto px-4 py-8 sm:py-12">
	{#if saved}
		<div class="text-center py-20" in:fade>
			<div class="text-4xl mb-4">✓</div>
			<p class="font-serif text-xl text-stone-700">{t('daily.saved')}</p>
		</div>
	{:else}
		<div class="mb-8">
			<h1 class="font-serif text-2xl text-stone-700 mb-1">{t('daily.title')}</h1>
			<p class="text-stone-400 text-sm">{t('daily.subtitle')}</p>
		</div>

		<div class="space-y-8">
			<!-- Mood -->
			<section class="space-y-3">
				<p class="text-sm font-medium text-stone-600">{t('daily.moodQuestion')}</p>
				<div class="flex gap-3">
					{#each [1, 2, 3, 4, 5] as n}
						<button
							type="button"
							onclick={() => (moodScore = moodScore === n ? undefined : n)}
							class="flex-1 aspect-square rounded-xl border-2 text-2xl transition-all flex items-center justify-center"
							class:ring-2={moodScore === n}
							style={moodScore === n ? 'border-color: #7c3aed; ring-color: #7c3aed;' : 'border-color: #e7e5e4;'}
							aria-label="{t('daily.moodAriaLabel', { n: String(n) })} — {MOOD_EMOJIS[n]}"
						>
							{MOOD_EMOJIS[n]}
						</button>
					{/each}
				</div>
			</section>

			<!-- Self-energy -->
			<section class="space-y-3">
				<p class="text-sm font-medium text-stone-600">{t('daily.selfEnergyQuestion')}</p>
				<div class="flex gap-2 items-center">
					{#each [1, 2, 3, 4, 5] as n}
						<button
							type="button"
							onclick={() => (selfEnergyScore = selfEnergyScore === n ? undefined : n)}
							class="flex-1 h-10 rounded-lg border-2 text-xs font-medium transition-all"
							style={selfEnergyScore !== undefined && selfEnergyScore >= n
								? 'border-color: #7c3aed; background-color: #7c3aed18; color: #7c3aed;'
								: 'border-color: #e7e5e4; color: #a8a29e;'}
						>
							{n}
						</button>
					{/each}
					<span class="text-xs text-stone-400 ml-1 whitespace-nowrap">
						{selfEnergyScore === undefined
							? ''
							: selfEnergyScore <= 2
								? t('daily.selfEnergyLow')
								: selfEnergyScore <= 3
									? t('daily.selfEnergyMid')
									: t('daily.selfEnergyHigh')}
					</span>
				</div>
			</section>

			<!-- Active parts -->
			{#if dataStore.parts.length > 0}
				<section class="space-y-3">
					<p class="text-sm font-medium text-stone-600">{t('daily.partsQuestion')}</p>
					<div class="flex flex-wrap gap-2">
						{#each dataStore.parts as part}
							{@const on = activeParts.includes(part.id)}
							<button
								type="button"
								onclick={() => togglePart(part.id)}
								class="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all"
								style={on
									? `border-color: ${part.color ?? '#7c3aed'}80; background-color: ${part.color ?? '#7c3aed'}15; color: ${part.color ?? '#7c3aed'};`
									: 'border-color: #e7e5e4; color: #78716c; background: white;'}
							>
								<PartAvatar size="xs" color={part.color} name={part.name} />
								{part.name}
							</button>
						{/each}
					</div>
				</section>
			{/if}

			<!-- Message from parts -->
			<section class="space-y-3">
				<p class="text-sm font-medium text-stone-600">{t('daily.partsMessageQuestion')}</p>
				<textarea
					bind:value={partsMessage}
					rows={3}
					placeholder={t('daily.partsMessagePlaceholder')}
					class="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
				></textarea>
			</section>

			<button
				type="button"
				onclick={save}
				class="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-3.5 text-sm font-medium transition-colors"
			>
				{t('daily.save')}
			</button>
		</div>
	{/if}
</main>
