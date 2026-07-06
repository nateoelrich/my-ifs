<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { fly, fade, slide } from 'svelte/transition';
	import { dataStore } from '$lib/data/workspace.svelte';
	import type { CreatePartInput } from '$lib/data/types';
	import {
		DEFAULT_PART_COLOR,
		EMOTION_SUGGESTIONS,
		BELIEF_SUGGESTIONS,
		TRIGGER_SUGGESTIONS,
		FEAR_SUGGESTIONS,
		ROLE_CONFIGS,
		ROLE_BADGE_MAP
	} from '$lib/data/part-constants';
	import { t } from '$lib/i18n.svelte';
	import ColorPicker from '$lib/components/ColorPicker.svelte';
	import TagInput from '$lib/components/TagInput.svelte';
	import PartAvatar from '$lib/components/PartAvatar.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';

	const DRAFT_KEY = 'ifs_part_draft';

	const STEP_IDS = ['name', 'body', 'image', 'emotions', 'beliefs', 'triggers', 'intention', 'origin', 'role', 'needs', 'review'];

	function loadDraft(): Partial<CreatePartInput> {
		if (!browser) return {};
		try {
			return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? '{}');
		} catch {
			return {};
		}
	}

	function saveDraft(data: Partial<CreatePartInput>) {
		if (browser) localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
	}

	function clearDraft() {
		if (browser) localStorage.removeItem(DRAFT_KEY);
	}

	const draft = loadDraft();
	const hasDraft = Boolean(draft.name?.trim());

	let currentStep = $state(hasDraft ? 0 : -1);
	let direction = $state(1);
	let error = $state('');

	// Form state
	let name = $state(draft.name ?? '');
	let nickname = $state(draft.nickname ?? '');
	let color = $state(draft.color ?? DEFAULT_PART_COLOR);
	let bodyLocation = $state(draft.bodyLocation ?? '');
	let bodySensation = $state(draft.bodySensation ?? '');
	let image = $state(draft.image ?? '');
	let apparentAge = $state(draft.apparentAge ?? '');
	let emotions = $state<string[]>(draft.emotions ?? []);
	let beliefs = $state<string[]>(draft.beliefs ?? []);
	let triggers = $state<string[]>(draft.triggers ?? []);
	let positiveIntention = $state(draft.positiveIntention ?? '');
	let fears = $state<string[]>(draft.fears ?? []);
	let originLifeStage = $state(draft.originLifeStage ?? '');
	let originStory = $state(draft.originStory ?? '');
	let roleType = $state(draft.roleType ?? '');
	let whatItNeedsFromSelf = $state(draft.whatItNeedsFromSelf ?? '');
	let giftsWhenUnburdened = $state(draft.giftsWhenUnburdened ?? '');
	let notes = $state(draft.notes ?? '');

	const formData = $derived<Partial<CreatePartInput>>({
		name, nickname, color, bodyLocation, bodySensation, image,
		apparentAge, emotions, beliefs, triggers, positiveIntention,
		fears, originLifeStage, originStory, roleType,
		whatItNeedsFromSelf, giftsWhenUnburdened, notes
	});

	$effect(() => {
		saveDraft(formData);
	});

	function canAdvance(): boolean {
		if (currentStep === -1) return true;
		if (currentStep === 0) return name.trim().length > 0;
		return true;
	}

	function next() {
		direction = 1;
		if (currentStep < STEP_IDS.length - 1) currentStep++;
	}

	function back() {
		direction = -1;
		if (currentStep > -1) currentStep--;
	}

	function submit() {
		if (!name.trim()) {
			error = t('partWizard.nameRequired');
			return;
		}
		error = '';
		try {
			const input: CreatePartInput = {
				name: name.trim(),
				nickname: nickname.trim() || undefined,
				color,
				bodyLocation: bodyLocation.trim() || undefined,
				bodySensation: bodySensation.trim() || undefined,
				image: image.trim() || undefined,
				apparentAge: apparentAge.trim() || undefined,
				emotions,
				beliefs,
				triggers,
				positiveIntention: positiveIntention.trim() || undefined,
				fears,
				originLifeStage: originLifeStage.trim() || undefined,
				originStory: originStory.trim() || undefined,
				roleType: roleType || undefined,
				whatItNeedsFromSelf: whatItNeedsFromSelf.trim() || undefined,
				giftsWhenUnburdened: giftsWhenUnburdened.trim() || undefined,
				notes: notes.trim() || undefined
			};
			const part = dataStore.createPart(input);
			clearDraft();
			goto(`${base}/parts/${part.id}`);
		} catch (err) {
			error = err instanceof Error ? err.message : t('common.failedToSave');
		}
	}

	const stepId = $derived(currentStep >= 0 ? STEP_IDS[currentStep] : '');
</script>

<!-- Minimal wizard header -->
<header class="sticky top-0 z-10 bg-canvas/80 backdrop-blur-sm border-b border-stone-100/60 px-6 py-3 flex items-center">
	<a href="{base}/parts" class="text-sm text-stone-400 hover:text-stone-600 transition-colors min-h-[44px] flex items-center">{t('parts.view.backToParts')}</a>
</header>

<main class="max-w-2xl mx-auto px-4 py-6 sm:py-10">
	<!-- Progress dots: only shown during numbered steps -->
	{#if currentStep >= 0}
		<div class="mb-8 text-center">
			<p class="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">
				{t(`partWizard.steps.${stepId}.title`)}
			</p>
			<div class="flex items-center justify-center gap-2">
				{#each STEP_IDS as _, i}
					<div class="rounded-full transition-all duration-300 {
						i < currentStep
							? 'w-2 h-2 bg-primary-400'
							: i === currentStep
								? 'w-2.5 h-2.5 bg-primary-600 ring-2 ring-offset-1 ring-primary-200'
								: 'w-1.5 h-1.5 bg-stone-200'
					}"></div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Wizard card -->
	<div
		class="rounded-2xl sm:rounded-3xl border shadow-float overflow-hidden transition-colors duration-500"
		style="background-color: {color}12; border-color: {color}30; --part-color: {color}; --part-ring: {color}40;"
	>
		{#if error}
			<div class="bg-red-50 text-red-700 px-10 pt-6 pb-0 text-sm">{error}</div>
		{/if}

		<!-- Part summary — visible once the name is set, persists across steps -->
		{#if name.trim() && currentStep >= 1}
			{@const statParts = [
				emotions.length  ? `${emotions.length} feeling${emotions.length  !== 1 ? 's' : ''}` : '',
				beliefs.length   ? `${beliefs.length} belief${beliefs.length    !== 1 ? 's' : ''}` : '',
				triggers.length  ? `${triggers.length} trigger${triggers.length !== 1 ? 's' : ''}` : '',
			].filter(Boolean)}
			<div
				transition:slide={{ duration: 220 }}
				class="flex items-center gap-3 px-5 sm:px-10 py-3 border-b"
				style="border-color: {color}25; background-color: {color}0C;"
			>
				<PartAvatar size="sm" {color} name={name} />
				<div class="flex-1 min-w-0">
					<p class="text-sm font-medium text-stone-700 truncate">{name}</p>
					{#if nickname}
						<p class="text-xs text-stone-400 italic truncate">"{nickname}"</p>
					{:else if statParts.length > 0}
						<p class="text-xs text-stone-400">{statParts.join(' · ')}</p>
					{/if}
				</div>
				{#if roleType}
					<span class="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 {ROLE_BADGE_MAP[roleType] ?? ROLE_BADGE_MAP.unknown}">
						{t(`roles.${roleType}.label`)}
					</span>
				{/if}
			</div>
		{/if}

		<!-- Animated step content -->
		<div class="wizard-field px-5 pt-8 sm:px-10 sm:pt-10" style="min-height: 360px;">
			{#key currentStep}
				<div
					in:fly={{ x: direction * 28, duration: 220, opacity: 0 }}
					out:fade={{ duration: 80 }}
				>

					<!-- Centering step -->
					{#if currentStep === -1}
						<div class="text-center py-8 max-w-sm mx-auto">
							<div class="w-12 h-px bg-stone-200 mx-auto mb-8"></div>
							<h2 class="font-serif text-xl sm:text-2xl text-stone-700 mb-5 leading-relaxed">
								{t('partWizard.intro.settle')}
							</h2>
							<p class="text-stone-500 text-base leading-relaxed">
								{t('partWizard.intro.description')}
							</p>
							<p class="text-stone-400 text-sm leading-relaxed mt-4">
								{t('partWizard.intro.curiosity')}
							</p>
							<div class="w-12 h-px bg-stone-200 mx-auto mt-8"></div>
						</div>

					<!-- Step 0: Name -->
					{:else if currentStep === 0}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{t('partWizard.steps.name.question')}</h2>
								<p class="text-stone-400 text-sm">{t('partWizard.steps.name.hint')}</p>
							</div>
							<input
								type="text"
								bind:value={name}
								placeholder={t('partWizard.placeholders.name')}
								class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
								autofocus
							/>
							<div class="space-y-1">
								<label class="block text-sm text-stone-500">{t('partWizard.labels.nickname')} <span class="text-stone-400">{t('partWizard.labels.nicknameHint')}</span></label>
								<input
									type="text"
									bind:value={nickname}
									placeholder={t('partWizard.labels.nicknameShortPlaceholder')}
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm"
								/>
							</div>
							<div class="space-y-2">
								<label class="block text-sm text-stone-500">{t('partWizard.labels.color')} <span class="text-stone-400">{t('partWizard.labels.colorHint')}</span></label>
								<ColorPicker bind:value={color} />
							</div>
						</div>

					<!-- Step 1: Body -->
					{:else if currentStep === 1}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{t('partWizard.steps.body.question')}</h2>
								<p class="text-stone-400 text-sm">{t('partWizard.steps.body.hint')}</p>
							</div>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600">{t('partWizard.labels.location')}</label>
								<input
									type="text"
									bind:value={bodyLocation}
									placeholder={t('partWizard.placeholders.bodyLocation')}
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm"
								/>
							</div>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600">{t('partWizard.labels.sensation')}</label>
								<textarea
									bind:value={bodySensation}
									rows={3}
									placeholder={t('partWizard.placeholders.bodySensation')}
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm resize-none"
								></textarea>
							</div>
						</div>

					<!-- Step 2: Image -->
					{:else if currentStep === 2}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{t('partWizard.steps.image.question')}</h2>
								<p class="text-stone-400 text-sm">{t('partWizard.steps.image.hint')}</p>
							</div>
							<textarea
								bind:value={image}
								rows={3}
								placeholder={t('partWizard.placeholders.image')}
								class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm resize-none"
							></textarea>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600">{t('partWizard.labels.apparentAge')}</label>
								<input
									type="text"
									bind:value={apparentAge}
									placeholder={t('partWizard.placeholders.apparentAge')}
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm"
								/>
							</div>
						</div>

					<!-- Step 3: Emotions -->
					{:else if currentStep === 3}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{t('partWizard.steps.emotions.question')}</h2>
								<p class="text-stone-400 text-sm">{t('partWizard.steps.emotions.hint')}</p>
							</div>
							<TagInput bind:tags={emotions} suggestions={EMOTION_SUGGESTIONS} placeholder="Or type your own…" pillMode={true} accentColor={color} />
						</div>

					<!-- Step 4: Beliefs -->
					{:else if currentStep === 4}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{t('partWizard.steps.beliefs.question')}</h2>
								<p class="text-stone-400 text-sm">{t('partWizard.steps.beliefs.hint')}</p>
							</div>
							<TagInput bind:tags={beliefs} suggestions={BELIEF_SUGGESTIONS} placeholder="Or describe your own belief…" pillMode={true} accentColor={color} />
						</div>

					<!-- Step 5: Triggers -->
					{:else if currentStep === 5}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{t('partWizard.steps.triggers.question')}</h2>
								<p class="text-stone-400 text-sm">{t('partWizard.steps.triggers.hint')}</p>
							</div>
							<TagInput bind:tags={triggers} suggestions={TRIGGER_SUGGESTIONS} placeholder="Or describe a trigger…" pillMode={true} accentColor={color} />
						</div>

					<!-- Step 6: Intention -->
					{:else if currentStep === 6}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{t('partWizard.steps.intention.question')}</h2>
								<p class="text-stone-400 text-sm">{t('partWizard.steps.intention.hint')}</p>
							</div>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600 flex items-center">
									{t('partWizard.labels.positiveIntention')}
									<Tooltip text={t('partWizard.labels.positiveIntentionTooltip')} />
								</label>
								<textarea
									bind:value={positiveIntention}
									rows={3}
									placeholder={t('partWizard.placeholders.positiveIntention')}
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm resize-none"
								></textarea>
							</div>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600">{t('partWizard.labels.whatIfItStopped')}</label>
								<TagInput bind:tags={fears} suggestions={FEAR_SUGGESTIONS} placeholder="Or describe a fear…" pillMode={true} accentColor={color} />
							</div>
						</div>

					<!-- Step 7: Origin -->
					{:else if currentStep === 7}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{t('partWizard.steps.origin.question')}</h2>
								<p class="text-stone-400 text-sm">{t('partWizard.steps.origin.hint')}</p>
							</div>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600">{t('partWizard.labels.lifeStage')}</label>
								<input
									type="text"
									bind:value={originLifeStage}
									placeholder={t('partWizard.labels.lifeStage')}
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm"
								/>
							</div>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600 flex items-center">
									{t('partWizard.labels.originStory')} <span class="text-stone-400 ml-1">{t('partWizard.labels.originStoryHint')}</span>
									<Tooltip text={t('partWizard.labels.originStoryTooltip')} />
								</label>
								<textarea
									bind:value={originStory}
									rows={4}
									placeholder={t('partWizard.placeholders.originStory')}
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm resize-none"
								></textarea>
							</div>
						</div>

					<!-- Step 8: Role type -->
					{:else if currentStep === 8}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{t('partWizard.steps.role.question')}</h2>
								<p class="text-stone-400 text-sm">{t('partWizard.steps.role.hint')}</p>
							</div>
							<div class="space-y-3">
								{#each ROLE_CONFIGS as role}
									<label class="flex items-start gap-4 p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all {
										roleType === role.value ? role.selectedClass : 'border-stone-100 hover:border-stone-200 bg-white'
									}">
										<input
											type="radio"
											bind:group={roleType}
											value={role.value}
											class="mt-1 accent-primary-600 flex-shrink-0"
										/>
										<div class="flex-1">
											<div class="flex items-center gap-2 mb-1">
												<span class="text-base leading-none text-stone-400" aria-hidden="true">{role.icon}</span>
												<span class="text-xs font-semibold px-2.5 py-0.5 rounded-full border {role.colorClass}">{t(`roles.${role.value}.label`)}</span>
												<span class="text-xs text-stone-400 italic">{t(`roles.${role.value}.metaphor`)}</span>
											</div>
											<p class="text-stone-500 text-sm leading-relaxed">{t(`roles.${role.value}.description`)}</p>
										</div>
									</label>
								{/each}
							</div>
						</div>

					<!-- Step 9: Needs & Gifts -->
					{:else if currentStep === 9}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{t('partWizard.steps.needs.question')}</h2>
								<p class="text-stone-400 text-sm">{t('partWizard.steps.needs.hint')}</p>
							</div>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600 flex items-center">
									{t('partWizard.labels.needsFromSelf')}
									<Tooltip text={t('partWizard.labels.needsTooltip')} />
								</label>
								<textarea
									bind:value={whatItNeedsFromSelf}
									rows={3}
									placeholder={t('partWizard.placeholders.needsFromSelf')}
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm resize-none"
								></textarea>
							</div>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600 flex items-center">
									{t('partWizard.labels.giftsWhenUnburdened')} <span class="text-stone-400 ml-1">{t('partWizard.labels.giftsHint')}</span>
									<Tooltip text={t('partWizard.labels.giftsTooltip')} />
								</label>
								<textarea
									bind:value={giftsWhenUnburdened}
									rows={3}
									placeholder={t('partWizard.placeholders.giftsWhenUnburdened')}
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm resize-none"
								></textarea>
							</div>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600">{t('partWizard.labels.notes')} <span class="text-stone-400">{t('partWizard.labels.notesHint')}</span></label>
								<textarea
									bind:value={notes}
									rows={3}
									placeholder={t('partWizard.placeholders.notes')}
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm resize-none"
								></textarea>
							</div>
						</div>

					<!-- Step 10: Review -->
					{:else if currentStep === 10}
						<div class="space-y-5">
							<div
								class="text-center mb-2 rounded-2xl py-7 px-4 -mx-1"
								style="background: linear-gradient(180deg, {color}28 0%, {color}0A 65%, transparent 100%);"
							>
								<div class="flex justify-center mb-4">
									<PartAvatar size="xl" color={color} name={name || 'Part'} />
								</div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-800">
									{t('partWizard.review.youveKnown', { name: name || t('parts.title') })}
								</h2>
								{#if nickname}
									<p class="text-stone-400 italic text-sm mt-1">"{nickname}"</p>
								{/if}
								{#if roleType}
									<span class="inline-block mt-3 text-xs font-medium px-3 py-1 rounded-full {ROLE_BADGE_MAP[roleType] ?? ROLE_BADGE_MAP.unknown}">
										{t(`roles.${roleType}.label`)}
									</span>
								{/if}
							</div>

							<div class="space-y-3 text-sm">
								{#if bodyLocation}
									<div class="bg-canvas-muted rounded-xl p-4">
										<p class="text-stone-500 text-xs font-medium uppercase tracking-wide mb-1">{t('parts.sections.body')}</p>
										<p class="text-stone-700">{bodyLocation}{bodySensation ? ` — ${bodySensation}` : ''}</p>
									</div>
								{/if}

								{#if image}
									<div class="bg-canvas-muted rounded-xl p-4">
										<p class="text-stone-500 text-xs font-medium uppercase tracking-wide mb-1">{t('parts.sections.image')}{apparentAge ? ` · ${apparentAge}` : ''}</p>
										<p class="text-stone-700 italic">"{image}"</p>
									</div>
								{/if}

								{#if emotions.length > 0}
									<div>
										<p class="text-stone-500 text-xs font-medium uppercase tracking-wide mb-2">{t('parts.sections.emotions')}</p>
										<div class="flex flex-wrap gap-1.5">
											{#each emotions as e}
												<span
													class="rounded-full px-2.5 py-1 text-xs font-medium"
													style="background-color: {color}22; color: {color};"
												>{e}</span>
											{/each}
										</div>
									</div>
								{/if}

								{#if beliefs.length > 0}
									<div>
										<p class="text-stone-500 text-xs font-medium uppercase tracking-wide mb-2">{t('parts.sections.beliefs')}</p>
										<ul class="space-y-1">
											{#each beliefs as b}
												<li class="text-stone-700">• {b}</li>
											{/each}
										</ul>
									</div>
								{/if}

								{#if positiveIntention}
									<div class="bg-canvas-muted rounded-xl p-4">
										<p class="text-stone-500 text-xs font-medium uppercase tracking-wide mb-1">{t('parts.sections.positiveIntention')}</p>
										<p class="text-stone-700">{positiveIntention}</p>
									</div>
								{/if}

								{#if originLifeStage}
									<div class="bg-canvas-muted rounded-xl p-4">
										<p class="text-stone-500 text-xs font-medium uppercase tracking-wide mb-1">{t('parts.sections.origin')}</p>
										<p class="text-stone-700 font-medium">{originLifeStage}</p>
										{#if originStory}<p class="text-stone-600 mt-1">{originStory}</p>{/if}
									</div>
								{/if}

								{#if whatItNeedsFromSelf}
									<div class="rounded-xl p-4" style="background-color: {color}18;">
										<p class="text-xs font-medium uppercase tracking-wide mb-1" style="color: {color};">{t('parts.sections.needsFromSelf')}</p>
										<p class="text-stone-800">{whatItNeedsFromSelf}</p>
									</div>
								{/if}
							</div>
						</div>
					{/if}

				</div>
			{/key}
		</div>

		<!-- Navigation -->
		{#if currentStep === -1}
			<div class="flex justify-center px-5 pb-10 pt-8 sm:px-10">
				<button
					type="button"
					onclick={next}
					class="wizard-btn text-white rounded-xl px-10 py-3 text-sm font-medium tracking-wide"
				>
					{t('partWizard.intro.ready')}
				</button>
			</div>
		{:else}
			<div class="flex items-center justify-between px-5 pb-6 pt-6 mt-8 border-t border-stone-100 sm:px-10 sm:pb-8">
				<button
					type="button"
					onclick={back}
					class="text-stone-500 hover:text-stone-800 text-sm transition-colors py-3 px-1 {currentStep === 0 ? 'invisible' : ''}"
				>
					{t('partWizard.nav.back')}
				</button>

				<div class="flex gap-3">
					{#if currentStep < STEP_IDS.length - 1}
						{#if currentStep > 0}
							<button
								type="button"
								onclick={next}
								class="text-stone-400 hover:text-stone-600 text-sm transition-colors py-3 px-2"
							>
								{t('partWizard.nav.skip')}
							</button>
						{/if}
						<button
							type="button"
							onclick={next}
							disabled={!canAdvance()}
							class="wizard-btn text-white rounded-lg px-6 py-3 text-sm font-medium"
						>
							{currentStep === 0 ? t('partWizard.nav.begin') : t('partWizard.nav.continue')}
						</button>
					{:else}
						<button
							type="button"
							onclick={submit}
							class="wizard-btn text-white rounded-lg px-8 py-3 text-sm font-medium"
						>
							{t('partWizard.nav.save')}
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<p class="text-center text-xs text-stone-300 mt-5">{t('partWizard.autosave')}</p>
</main>

<style>
	.wizard-field input:focus,
	.wizard-field textarea:focus {
		outline: none;
		border-color: var(--part-color);
		box-shadow: 0 0 0 3px var(--part-ring);
	}

	.wizard-btn {
		background-color: var(--part-color);
		transition: filter 0.15s, background-color 0.3s;
	}
	.wizard-btn:hover:not([disabled]) {
		filter: brightness(0.88);
	}
	.wizard-btn[disabled] {
		background-color: #d6d3d1;
		color: #a8a29e;
		cursor: not-allowed;
	}
</style>
