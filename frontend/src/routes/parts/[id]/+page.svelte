<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { dataStore } from '$lib/data/workspace.svelte';
	import type { Part, CreatePartInput } from '$lib/data/types';
	import {
		DEFAULT_PART_COLOR,
		ROLE_BADGE_MAP,
		ROLE_CONFIGS,
		EMOTION_SUGGESTIONS,
		BELIEF_SUGGESTIONS,
		TRIGGER_SUGGESTIONS,
		FEAR_SUGGESTIONS
	} from '$lib/data/part-constants';
	import { formatDate } from '$lib/utils/format';
	import { t } from '$lib/i18n.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import ColorPicker from '$lib/components/ColorPicker.svelte';
	import Section from '$lib/components/Section.svelte';
	import TagInput from '$lib/components/TagInput.svelte';
	import PartAvatar from '$lib/components/PartAvatar.svelte';

	const id = $derived(page.params.id ?? '');
	const part = $derived(dataStore.getPart(id) ?? null);
	const recentSessions = $derived(
		id ? dataStore.getSessionsForPart(id).slice(0, 3) : []
	);

	let editing = $state(false);
	let error = $state('');

	// Edit form fields — populated when entering edit mode
	let eName = $state('');
	let eNickname = $state('');
	let eColor = $state(DEFAULT_PART_COLOR);
	let eRoleType = $state('');
	let eBodyLocation = $state('');
	let eBodySensation = $state('');
	let eImage = $state('');
	let eApparentAge = $state('');
	let eEmotions = $state<string[]>([]);
	let eBeliefs = $state<string[]>([]);
	let eTriggers = $state<string[]>([]);
	let ePositiveIntention = $state('');
	let eFears = $state<string[]>([]);
	let eOriginLifeStage = $state('');
	let eOriginStory = $state('');
	let eWhatItNeedsFromSelf = $state('');
	let eGiftsWhenUnburdened = $state('');
	let eNotes = $state('');

	function startEdit(p: Part) {
		eName = p.name;
		eNickname = p.nickname ?? '';
		eColor = p.color ?? DEFAULT_PART_COLOR;
		eRoleType = p.roleType ?? '';
		eBodyLocation = p.bodyLocation ?? '';
		eBodySensation = p.bodySensation ?? '';
		eImage = p.image ?? '';
		eApparentAge = p.apparentAge ?? '';
		eEmotions = [...(p.emotions ?? [])];
		eBeliefs = [...(p.beliefs ?? [])];
		eTriggers = [...(p.triggers ?? [])];
		ePositiveIntention = p.positiveIntention ?? '';
		eFears = [...(p.fears ?? [])];
		eOriginLifeStage = p.originLifeStage ?? '';
		eOriginStory = p.originStory ?? '';
		eWhatItNeedsFromSelf = p.whatItNeedsFromSelf ?? '';
		eGiftsWhenUnburdened = p.giftsWhenUnburdened ?? '';
		eNotes = p.notes ?? '';
		editing = true;
	}

	function saveEdit() {
		if (!eName.trim()) { error = t('common.nameRequired'); return; }
		error = '';
		try {
			const input: CreatePartInput = {
				name: eName.trim(),
				nickname: eNickname.trim() || undefined,
				color: eColor,
				roleType: eRoleType || undefined,
				bodyLocation: eBodyLocation.trim() || undefined,
				bodySensation: eBodySensation.trim() || undefined,
				image: eImage.trim() || undefined,
				apparentAge: eApparentAge.trim() || undefined,
				emotions: eEmotions,
				beliefs: eBeliefs,
				triggers: eTriggers,
				positiveIntention: ePositiveIntention.trim() || undefined,
				fears: eFears,
				originLifeStage: eOriginLifeStage.trim() || undefined,
				originStory: eOriginStory.trim() || undefined,
				whatItNeedsFromSelf: eWhatItNeedsFromSelf.trim() || undefined,
				giftsWhenUnburdened: eGiftsWhenUnburdened.trim() || undefined,
				notes: eNotes.trim() || undefined
			};
			dataStore.updatePart(id, input);
			editing = false;
		} catch (err) {
			error = err instanceof Error ? err.message : t('common.failedToSave');
		}
	}

	function handleDelete() {
		if (!confirm(t('common.deletePartConfirm', { name: part?.name ?? '' }))) return;
		try {
			dataStore.deletePart(id);
			goto(`${base}/parts`);
		} catch {
			error = t('common.failedToDelete');
		}
	}

	const inputClass = 'w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent';
	const textareaClass = `${inputClass} resize-none`;
</script>

<Nav />

<main class="max-w-3xl mx-auto px-4 py-6 sm:py-8">
	{#if !part}
		<div class="text-center py-20 text-stone-400">
			<p>{t('parts.view.notFound')}</p>
			<a href="{base}/parts" class="text-primary-600 hover:underline text-sm mt-4 block">{t('parts.view.backToPartsLink')}</a>
		</div>

	{:else}
		<!-- Header -->
		<div
			class="rounded-2xl mb-8 px-6 pt-6 pb-7 border border-stone-100/60"
			style={part.color ? `background: linear-gradient(150deg, ${part.color}1A 0%, ${part.color}0D 40%, transparent 100%)` : ''}
		>
			<div class="flex justify-center mb-5 sm:justify-start">
				<PartAvatar color={part.color || DEFAULT_PART_COLOR} name={part.name} size="xl" />
			</div>

			<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<a href="{base}/parts" class="text-stone-400 hover:text-stone-600 text-sm transition-colors block mb-2">{t('parts.view.backToParts')}</a>
					<h1 class="text-xl sm:text-2xl font-serif text-stone-800">{part.name}</h1>
					{#if part.nickname}<p class="text-stone-400 text-sm italic">"{part.nickname}"</p>{/if}
					{#if part.roleType}
						<span class="inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full {ROLE_BADGE_MAP[part.roleType] ?? ROLE_BADGE_MAP.unknown}">
							{t(`roles.${part.roleType}.label`)}
						</span>
					{/if}
				</div>
				<div class="flex gap-2 sm:flex-shrink-0">
					{#if !editing}
						<button
							onclick={() => startEdit(part!)}
							class="flex-1 sm:flex-none text-sm text-stone-500 hover:text-primary-700 border border-stone-200 hover:border-primary-300 rounded-lg px-4 py-2.5 min-h-[44px] transition-colors"
						>{t('parts.actions.edit')}</button>
						<button
							onclick={handleDelete}
							class="flex-1 sm:flex-none text-sm text-stone-400 hover:text-red-500 border border-stone-200 hover:border-red-200 rounded-lg px-4 py-2.5 min-h-[44px] transition-colors"
						>{t('parts.actions.delete')}</button>
					{:else}
						<button
							onclick={() => (editing = false)}
							class="flex-1 sm:flex-none text-sm text-stone-500 hover:text-stone-700 border border-stone-200 rounded-lg px-4 py-2.5 min-h-[44px] transition-colors"
						>{t('parts.actions.cancel')}</button>
						<button
							onclick={saveEdit}
							class="flex-1 sm:flex-none text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2.5 min-h-[44px] transition-colors"
						>{t('parts.actions.save')}</button>
					{/if}
				</div>
			</div>
		</div>

		{#if error}
			<div class="bg-red-50 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">{error}</div>
		{/if}

		{#if !editing}
			<!-- View mode -->
			<div class="space-y-6">
				{#if part.bodyLocation || part.bodySensation}
					<Section title={t('parts.sections.body')}>
						{#if part.bodyLocation}<p class="text-stone-800 font-medium">{part.bodyLocation}</p>{/if}
						{#if part.bodySensation}<p class="text-stone-600 mt-1">{part.bodySensation}</p>{/if}
					</Section>
				{/if}

				{#if part.image}
					<Section title="{t('parts.sections.image')}{part.apparentAge ? ` · ${part.apparentAge}` : ''}">
						<p class="text-stone-700 italic">"{part.image}"</p>
					</Section>
				{/if}

				{#if part.emotions?.length > 0 || part.beliefs?.length > 0 || part.triggers?.length > 0}
					<Section class="space-y-4">
						{#if part.emotions?.length > 0}
							<div>
								<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">{t('parts.sections.emotions')}</h2>
								<div class="flex flex-wrap gap-2">
									{#each part.emotions as e}
										<span class="bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-sm">{e}</span>
									{/each}
								</div>
							</div>
						{/if}
						{#if part.beliefs?.length > 0}
							<div>
								<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">{t('parts.sections.beliefs')}</h2>
								<ul class="space-y-1">
									{#each part.beliefs as b}
										<li class="text-stone-700 text-sm">• {b}</li>
									{/each}
								</ul>
							</div>
						{/if}
						{#if part.triggers?.length > 0}
							<div>
								<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">{t('parts.sections.triggers')}</h2>
								<div class="flex flex-wrap gap-2">
									{#each part.triggers as trigger}
										<span class="bg-stone-50 text-stone-600 rounded-full px-3 py-1 text-sm border border-stone-100">{trigger}</span>
									{/each}
								</div>
							</div>
						{/if}
					</Section>
				{/if}

				{#if part.positiveIntention || part.fears?.length > 0}
					<Section class="space-y-4">
						{#if part.positiveIntention}
							<div>
								<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">{t('parts.sections.positiveIntention')}</h2>
								<p class="text-stone-700">{part.positiveIntention}</p>
							</div>
						{/if}
						{#if part.fears?.length > 0}
							<div>
								<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">{t('parts.sections.fears')}</h2>
								<div class="flex flex-wrap gap-2">
									{#each part.fears as f}
										<span class="bg-stone-50 text-stone-600 rounded-full px-3 py-1 text-sm border border-stone-100">{f}</span>
									{/each}
								</div>
							</div>
						{/if}
					</Section>
				{/if}

				{#if part.originLifeStage || part.originStory}
					<Section title={t('parts.sections.origin')}>
						{#if part.originLifeStage}<p class="text-stone-800 font-medium">{part.originLifeStage}</p>{/if}
						{#if part.originStory}<p class="text-stone-600 mt-2 whitespace-pre-wrap">{part.originStory}</p>{/if}
					</Section>
				{/if}

				{#if part.whatItNeedsFromSelf || part.giftsWhenUnburdened}
					<Section variant="primary" class="space-y-4">
						{#if part.whatItNeedsFromSelf}
							<div>
								<h2 class="text-xs font-medium text-primary-500 uppercase tracking-wide mb-2">{t('parts.sections.needsFromSelf')}</h2>
								<p class="text-primary-900">{part.whatItNeedsFromSelf}</p>
							</div>
						{/if}
						{#if part.giftsWhenUnburdened}
							<div>
								<h2 class="text-xs font-medium text-primary-500 uppercase tracking-wide mb-2">{t('parts.sections.giftsWhenUnburdened')}</h2>
								<p class="text-primary-900">{part.giftsWhenUnburdened}</p>
							</div>
						{/if}
					</Section>
				{/if}

				{#if part.notes}
					<Section title={t('parts.sections.notes')}>
						<p class="text-stone-600 whitespace-pre-wrap">{part.notes}</p>
					</Section>
				{/if}

				<!-- Go deeper: protocol links -->
				<Section class="space-y-3">
					<p class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">{t('parts.view.goDeeper')}</p>
					<div class="flex flex-wrap gap-2">
						{#if part.roleType !== 'exile'}
							<a
								href="{base}/sessions/new?protocol=6fs&partId={part.id}"
								class="text-sm px-4 py-2 rounded-lg border border-stone-200 text-stone-600 hover:border-primary-300 hover:text-primary-700 transition-colors"
							>
								{t('parts.view.meetPart')}
							</a>
						{/if}
						{#if part.roleType === 'exile'}
							<a
								href="{base}/sessions/new?protocol=unburdening&partId={part.id}"
								class="text-sm px-4 py-2 rounded-lg border border-stone-200 text-stone-600 hover:border-primary-300 hover:text-primary-700 transition-colors"
							>
								{t('parts.view.healExile')}
							</a>
						{/if}
						<a
							href="{base}/check-in"
							class="text-sm px-4 py-2 rounded-lg border border-stone-200 text-stone-600 hover:border-primary-300 hover:text-primary-700 transition-colors"
						>
							{t('parts.view.checkInNow')}
						</a>
					</div>
				</Section>

				<!-- Recent sessions -->
				{#if recentSessions.length > 0}
					<Section title={t('parts.view.recentSessions')} class="space-y-2">
						{#each recentSessions as s}
							{@const slabel = s.protocol && s.protocol !== 'free'
								? t(`protocolLabels.${s.protocol}`)
								: t(`sessionTypes.${s.type}`)}
							<a
								href="{base}/sessions/{s.id}"
								class="flex items-center justify-between rounded-lg px-3 py-2.5 border border-stone-100 hover:border-stone-200 bg-stone-50 hover:bg-white transition-all text-sm gap-3"
							>
								<div class="flex items-center gap-2 min-w-0">
									<span class="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style="background-color: {part.color ?? '#7c3aed'}18; color: {part.color ?? '#7c3aed'};">{slabel}</span>
									<span class="text-stone-500 truncate">{s.context?.slice(0, 50) || s.whatIsItDoing?.slice(0, 50) || t('parts.view.noNotes')}</span>
								</div>
								<span class="text-xs text-stone-300 flex-shrink-0">{formatDate(s.createdAt)}</span>
							</a>
						{/each}
						{#if dataStore.getSessionsForPart(part.id).length > 3}
							<a href="{base}/sessions" class="text-xs text-primary-600 hover:underline block text-right">
								{t('parts.view.viewAllSessions')}
							</a>
						{/if}
					</Section>
				{/if}

				<p class="text-xs text-stone-300 text-right">
					{t('parts.view.createdUpdated', { created: formatDate(part.createdAt), updated: formatDate(part.updatedAt) })}
				</p>
			</div>

		{:else}
			<!-- Edit mode -->
			<div class="space-y-6">
				<Section title={t('parts.edit.identity')} class="space-y-4">
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">{t('parts.edit.name')}</label>
						<input type="text" bind:value={eName} class={inputClass} />
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">{t('parts.edit.nickname')}</label>
						<input type="text" bind:value={eNickname} class={inputClass} />
					</div>
					<div class="space-y-2">
						<label class="block text-sm text-stone-600">{t('parts.edit.color')}</label>
						<ColorPicker bind:value={eColor} />
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">{t('parts.edit.roleType')}</label>
						<select bind:value={eRoleType} class={inputClass}>
							<option value="">{t('parts.edit.roleNotSure')}</option>
							{#each ROLE_CONFIGS as role}
								<option value={role.value}>{t(`roles.${role.value}.label`)}</option>
							{/each}
						</select>
					</div>
				</Section>

				<Section title={t('parts.edit.bodyAndImage')} class="space-y-4">
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">{t('parts.edit.bodyLocation')}</label>
						<input type="text" bind:value={eBodyLocation} class={inputClass} />
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">{t('parts.edit.bodySensation')}</label>
						<textarea rows={2} bind:value={eBodySensation} class={textareaClass}></textarea>
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">{t('parts.edit.image')}</label>
						<textarea rows={2} bind:value={eImage} class={textareaClass}></textarea>
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">{t('parts.edit.apparentAge')}</label>
						<input type="text" bind:value={eApparentAge} class={inputClass} />
					</div>
				</Section>

				<Section title={t('parts.edit.emotionsBeliefsTriggers')} class="space-y-4">
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">{t('parts.edit.emotions')}</label>
						<TagInput bind:tags={eEmotions} suggestions={EMOTION_SUGGESTIONS} />
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">{t('parts.edit.beliefs')}</label>
						<TagInput bind:tags={eBeliefs} suggestions={BELIEF_SUGGESTIONS} />
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">{t('parts.edit.triggers')}</label>
						<TagInput bind:tags={eTriggers} suggestions={TRIGGER_SUGGESTIONS} />
					</div>
				</Section>

				<Section title={t('parts.edit.protectiveFunction')} class="space-y-4">
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">{t('parts.edit.positiveIntention')}</label>
						<textarea rows={3} bind:value={ePositiveIntention} class={textareaClass}></textarea>
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">{t('parts.edit.fears')}</label>
						<TagInput bind:tags={eFears} suggestions={FEAR_SUGGESTIONS} />
					</div>
				</Section>

				<Section title={t('parts.edit.origin')} class="space-y-4">
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">{t('parts.edit.lifeStage')}</label>
						<input type="text" bind:value={eOriginLifeStage} class={inputClass} />
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">{t('parts.edit.originStory')}</label>
						<textarea rows={4} bind:value={eOriginStory} class={textareaClass}></textarea>
					</div>
				</Section>

				<Section title={t('parts.edit.needsAndGifts')} class="space-y-4">
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">{t('parts.edit.needsFromSelf')}</label>
						<textarea rows={3} bind:value={eWhatItNeedsFromSelf} class={textareaClass}></textarea>
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">{t('parts.edit.giftsWhenUnburdened')}</label>
						<textarea rows={3} bind:value={eGiftsWhenUnburdened} class={textareaClass}></textarea>
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">{t('parts.edit.notes')}</label>
						<textarea rows={3} bind:value={eNotes} class={textareaClass}></textarea>
					</div>
				</Section>
			</div>
		{/if}
	{/if}
</main>
