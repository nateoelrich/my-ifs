<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { dataStore } from '$lib/data/workspace.svelte';
	import { BURDEN_ELEMENTS } from '$lib/data/session-constants';
	import { formatDate } from '$lib/utils/format';
	import { t } from '$lib/i18n.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import PartAvatar from '$lib/components/PartAvatar.svelte';

	const id = $derived(page.params.id ?? '');
	const session = $derived(dataStore.getSession(id) ?? null);
	const linkedPart = $derived(session?.linkedPartId ? dataStore.getPart(session.linkedPartId) : null);

	const accentColor = $derived(linkedPart?.color ?? '#9E968E');

	const label = $derived(session
		? (session.protocol && session.protocol !== 'free'
			? t(`protocolLabels.${session.protocol}`)
			: t(`sessionTypes.${session.type}`))
		: '');

	function handleDelete() {
		if (!confirm(t('sessions.detail.deleteSession'))) return;
		try {
			dataStore.deleteSession(id);
			goto(`${base}/sessions`);
		} catch {
			// ignore
		}
	}

	function burdenLabel(elId: string): string {
		return t(`burdenElements.${elId}`);
	}

	const sixFsRows = $derived(session?.sixFs ? [
		[t('sessions.sixFsLabels.find'), session.sixFs.find],
		[t('sessions.sixFsLabels.focus'), session.sixFs.focus],
		[t('sessions.sixFsLabels.fleshOut'), session.sixFs.fleshOut],
		[t('sessions.sixFsLabels.feelToward'), session.sixFs.feelToward],
		[t('sessions.sixFsLabels.befriend'), session.sixFs.befriend],
		[t('sessions.sixFsLabels.fear'), session.sixFs.fear],
	] : []);

	const unburdenRows = $derived(session?.unburdening ? [
		[t('sessions.unburdenLabels.witness'), session.unburdening.witness],
		[t('sessions.unburdenLabels.validate'), session.unburdening.validate],
		[t('sessions.unburdenLabels.doOver'), session.unburdening.doOver],
		[t('sessions.unburdenLabels.retrieve'), session.unburdening.retrieve],
	] : []);
</script>

<Nav />

<main class="max-w-2xl mx-auto px-4 py-6 sm:py-8">
	{#if !session}
		<div class="text-center py-20 text-stone-400">
			<p>{t('sessions.detail.notFound')}</p>
			<a href="{base}/sessions" class="text-primary-600 hover:underline text-sm mt-4 block">{t('sessions.detail.backToJournal')}</a>
		</div>
	{:else}

		<!-- Header -->
		<div
			class="rounded-2xl mb-6 px-6 pt-6 pb-5 border"
			style="border-color: {accentColor}28; background: linear-gradient(150deg, {accentColor}14 0%, {accentColor}05 50%, transparent 100%);"
		>
			<a href="{base}/sessions" class="text-stone-400 hover:text-stone-600 text-sm transition-colors block mb-4">{t('sessions.detail.backToJournal')}</a>

			<div class="flex items-start gap-4">
				{#if linkedPart}
					<PartAvatar size="lg" color={linkedPart.color} name={linkedPart.name} />
				{:else}
					<div class="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 text-lg flex-shrink-0">◎</div>
				{/if}

				<div class="flex-1 min-w-0">
					<div class="flex items-center gap-2 mb-1 flex-wrap">
						<span class="text-xs font-medium px-2.5 py-1 rounded-full" style="background-color: {accentColor}20; color: {accentColor};">{label}</span>
						<span class="text-xs text-stone-400">{formatDate(session.createdAt)}</span>
					</div>

					{#if linkedPart}
						<a href="{base}/parts/{linkedPart.id}" class="text-lg font-serif text-stone-800 hover:text-primary-700 transition-colors block">
							{linkedPart.name}
						</a>
						{#if linkedPart.roleType}
							<p class="text-xs text-stone-400 mt-0.5">{t(`roles.${linkedPart.roleType}.label`)}</p>
						{/if}
					{:else if session.newPartName}
						<p class="text-lg font-serif text-stone-700">{session.newPartName} <span class="text-sm text-stone-400 font-normal">{t('sessions.detail.newPart')}</span></p>
					{:else}
						<p class="text-stone-500 italic text-sm">{t('sessions.detail.partNotIdentified')}</p>
					{/if}
				</div>

				<button
					type="button"
					onclick={handleDelete}
					class="text-stone-300 hover:text-red-400 transition-colors text-sm p-1 flex-shrink-0"
					aria-label={t('sessions.detail.deleteAriaLabel')}
				>×</button>
			</div>
		</div>

		<!-- Content sections -->
		<div class="space-y-4">

			{#if session.context}
				<section class="bg-stone-50 rounded-xl px-5 py-4 border border-stone-100">
					<p class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">{t('sessions.detail.whatWasHappening')}</p>
					<p class="text-stone-700 whitespace-pre-wrap">{session.context}</p>
				</section>
			{/if}

			{#if session.bodyLocation || session.bodySensation}
				<section class="bg-stone-50 rounded-xl px-5 py-4 border border-stone-100">
					<p class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">{t('sessions.detail.body')}</p>
					{#if session.bodyLocation}<p class="text-stone-800 font-medium">{session.bodyLocation}</p>{/if}
					{#if session.bodySensation}<p class="text-stone-600 mt-0.5">{session.bodySensation}</p>{/if}
				</section>
			{/if}

			{#if session.emotions.length > 0}
				<section>
					<p class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">{t('sessions.detail.emotions')}</p>
					<div class="flex flex-wrap gap-1.5">
						{#each session.emotions as e}
							<span class="text-sm px-3 py-1 rounded-full" style="background-color: {accentColor}18; color: {accentColor};">{e}</span>
						{/each}
					</div>
				</section>
			{/if}

			{#if session.selfEnergyQualities.length > 0}
				<section>
					<p class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">{t('sessions.detail.selfEnergyPresent')}</p>
					<div class="flex flex-wrap gap-1.5">
						{#each session.selfEnergyQualities as q}
							<span class="text-sm px-3 py-1 rounded-full bg-violet-50 text-violet-700">{q}</span>
						{/each}
					</div>
				</section>
			{/if}

			{#if session.whatIsItDoing}
				<section class="rounded-xl px-5 py-4 border" style="border-color: {accentColor}25; background-color: {accentColor}0A;">
					<p class="text-xs font-medium uppercase tracking-wide mb-2" style="color: {accentColor};">{t('sessions.detail.positiveIntention')}</p>
					<p class="text-stone-800">{session.whatIsItDoing}</p>
				</section>
			{/if}

			{#if session.whatDoesItNeed}
				<section class="rounded-xl px-5 py-4 border" style="border-color: {accentColor}25; background-color: {accentColor}0A;">
					<p class="text-xs font-medium uppercase tracking-wide mb-2" style="color: {accentColor};">{t('sessions.detail.whatItNeeds')}</p>
					<p class="text-stone-800">{session.whatDoesItNeed}</p>
				</section>
			{/if}

			<!-- 6 F's protocol -->
			{#if session.sixFs}
				<section class="bg-stone-50 rounded-xl px-5 py-4 border border-stone-100 space-y-3">
					<p class="text-xs font-medium text-stone-400 uppercase tracking-wide">{t('sessions.detail.sixFsSession')}</p>
					{#each sixFsRows as [rowLabel, val]}
						{#if val}
							<div>
								<p class="text-xs text-stone-400 font-medium mb-0.5">{rowLabel}</p>
								<p class="text-stone-700 text-sm">{val}</p>
							</div>
						{/if}
					{/each}
				</section>
			{/if}

			<!-- Unburdening protocol -->
			{#if session.unburdening}
				{@const u = session.unburdening}
				<section class="bg-stone-50 rounded-xl px-5 py-4 border border-stone-100 space-y-3">
					<p class="text-xs font-medium text-stone-400 uppercase tracking-wide">{t('sessions.detail.unburdeningSession')}</p>
					{#each unburdenRows as [rowLabel, val]}
						{#if val}
							<div>
								<p class="text-xs text-stone-400 font-medium mb-0.5">{rowLabel}</p>
								<p class="text-stone-700 text-sm">{val}</p>
							</div>
						{/if}
					{/each}
					{#if u.burdenRelease?.length}
						<div>
							<p class="text-xs text-stone-400 font-medium mb-1">{t('sessions.detail.burdenReleasedThrough')}</p>
							<div class="flex gap-2">
								{#each u.burdenRelease as el}
									<span class="text-sm">{BURDEN_ELEMENTS.find((e) => e.id === el)?.emoji ?? ''} {burdenLabel(el)}</span>
								{/each}
							</div>
						</div>
					{/if}
					{#if u.gifts}
						<div>
							<p class="text-xs text-stone-400 font-medium mb-0.5">{t('sessions.detail.gifts')}</p>
							<p class="text-stone-700 text-sm">{u.gifts}</p>
						</div>
					{/if}
				</section>
			{/if}

			<!-- Daily check-in -->
			{#if session.daily}
				{@const d = session.daily}
				<section class="bg-stone-50 rounded-xl px-5 py-4 border border-stone-100 space-y-2">
					<p class="text-xs font-medium text-stone-400 uppercase tracking-wide">{t('sessions.detail.dailyCheckIn')}</p>
					{#if d.moodScore}<p class="text-sm text-stone-600">{t('sessions.detail.moodLabel')} {'😔😕😐🙂😌'.split('')[d.moodScore - 1] ?? ''} ({d.moodScore}/5)</p>{/if}
					{#if d.partsMessage}<p class="text-stone-700 text-sm">{d.partsMessage}</p>{/if}
				</section>
			{/if}

			{#if session.whatHelped}
				<section class="bg-stone-50 rounded-xl px-5 py-4 border border-stone-100">
					<p class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">{t('sessions.detail.whatHelped')}</p>
					<p class="text-stone-700">{session.whatHelped}</p>
				</section>
			{/if}

			{#if session.notes}
				<section class="bg-stone-50 rounded-xl px-5 py-4 border border-stone-100">
					<p class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">{t('sessions.detail.notes')}</p>
					<p class="text-stone-600 whitespace-pre-wrap">{session.notes}</p>
				</section>
			{/if}

			<!-- Footer links -->
			<div class="flex items-center justify-between pt-2 pb-4">
				<p class="text-xs text-stone-300">{formatDate(session.createdAt)}</p>
				{#if linkedPart}
					<a href="{base}/parts/{linkedPart.id}" class="text-xs text-primary-600 hover:underline">
						{t('sessions.detail.viewPart', { name: linkedPart.name })}
					</a>
				{:else if session.newPartName}
					<a href="{base}/parts/new" class="text-xs text-primary-600 hover:underline">
						{t('sessions.detail.identifyPart', { name: session.newPartName })}
					</a>
				{/if}
			</div>
		</div>
	{/if}
</main>
