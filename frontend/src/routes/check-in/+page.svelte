<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { fly, fade, slide } from 'svelte/transition';
	import { dataStore } from '$lib/data/workspace.svelte';
	import { EMOTION_SUGGESTIONS } from '$lib/data/part-constants';
	import { t, tArray } from '$lib/i18n.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import TagInput from '$lib/components/TagInput.svelte';
	import SelfEnergyCheck from '$lib/components/SelfEnergyCheck.svelte';
	import PartSelector from '$lib/components/PartSelector.svelte';
	import PartAvatar from '$lib/components/PartAvatar.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';

	const STEP_IDS = ['ground', 'body', 'emotions', 'recognize', 'stepback', 'understand', 'need', 'close'];

	let step = $state(0);
	let direction = $state(1);
	let saved = $state(false);
	let error = $state('');

	// Form fields
	let context = $state('');
	let bodyLocation = $state('');
	let bodySensation = $state('');
	let emotions = $state<string[]>([]);
	let linkedPartId = $state<string | undefined>(undefined);
	let newPartName = $state('');
	let feelingToward = $state('');
	let selfEnergyQualities = $state<string[]>([]);
	let whatIsItDoing = $state('');
	let whatDoesItNeed = $state('');
	let whatHelped = $state('');
	let notes = $state('');

	const linkedPart = $derived(linkedPartId ? dataStore.getPart(linkedPartId) : null);

	const isBlended = $derived(tArray('blendedFeelings').includes(feelingToward));

	function next() {
		direction = 1;
		if (step < STEP_IDS.length - 1) step++;
	}

	function back() {
		direction = -1;
		if (step > 0) step--;
	}

	function save() {
		error = '';
		try {
			const session = dataStore.createSession({
				type: 'check-in',
				protocol: 'free',
				title: context.trim() ? context.slice(0, 60) : undefined,
				context: context.trim() || undefined,
				bodyLocation: bodyLocation.trim() || undefined,
				bodySensation: bodySensation.trim() || undefined,
				emotions,
				linkedPartId,
				newPartName: !linkedPartId && newPartName.trim() ? newPartName.trim() : undefined,
				selfEnergyQualities,
				whatIsItDoing: whatIsItDoing.trim() || undefined,
				whatDoesItNeed: whatDoesItNeed.trim() || undefined,
				whatHelped: whatHelped.trim() || undefined,
				notes: notes.trim() || undefined
			});
			saved = true;
			setTimeout(() => goto(`${base}/sessions/${session.id}`), 1200);
		} catch (err) {
			error = err instanceof Error ? err.message : t('common.failedToSave');
		}
	}

	const accent = $derived(linkedPart?.color ?? '#7c3aed');
	const stepId = $derived(STEP_IDS[step]);
</script>

<!-- Minimal header -->
<header class="sticky top-0 z-10 bg-canvas/80 backdrop-blur-sm border-b border-stone-100/60 px-6 py-3 flex items-center">
	<a href="{base}/parts" class="text-sm text-stone-400 hover:text-stone-600 transition-colors min-h-[44px] flex items-center">{t('checkIn.header.back')}</a>
</header>

<main class="max-w-2xl mx-auto px-4 py-6 sm:py-10">

	{#if saved}
		<div class="text-center py-20" in:fade>
			<div class="text-4xl mb-4">✓</div>
			<p class="font-serif text-xl text-stone-700">{t('checkIn.saved.heading')}</p>
			<p class="text-stone-400 text-sm mt-2">{t('checkIn.saved.subtext')}</p>
		</div>
	{:else}

		<!-- Progress -->
		<div class="mb-8 text-center">
			<p class="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">
				{t(`checkIn.steps.${stepId}.title`)}
			</p>
			<div class="flex items-center justify-center gap-1.5">
				{#each STEP_IDS as _, i}
					<div class="rounded-full transition-all duration-300 {
						i < step
							? 'w-2 h-2 bg-primary-400'
							: i === step
								? 'w-2.5 h-2.5 bg-primary-600 ring-2 ring-offset-1 ring-primary-200'
								: 'w-1.5 h-1.5 bg-stone-200'
					}"></div>
				{/each}
			</div>
		</div>

		<!-- Card -->
		<div
			class="rounded-2xl sm:rounded-3xl border shadow-float overflow-hidden transition-colors duration-500"
			style="background-color: {accent}0E; border-color: {accent}28; --ci-color: {accent}; --ci-ring: {accent}40;"
		>

			<!-- Summary strip (once a part is recognized) -->
			{#if linkedPart && step >= 4}
				<div
					transition:slide={{ duration: 200 }}
					class="flex items-center gap-3 px-5 sm:px-10 py-3 border-b"
					style="border-color: {accent}25; background-color: {accent}0C;"
				>
					<PartAvatar size="sm" color={linkedPart.color} name={linkedPart.name} />
					<p class="text-sm font-medium text-stone-700">{linkedPart.name}</p>
				</div>
			{/if}

			<!-- Step content -->
			<div class="ci-field px-5 pt-8 sm:px-10 sm:pt-10" style="min-height: 320px;">
				{#key step}
					<div
						in:fly={{ x: direction * 28, duration: 220, opacity: 0 }}
						out:fade={{ duration: 80 }}
					>

						<!-- 0: Ground -->
						{#if step === 0}
							<div class="space-y-5">
								<div>
									<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">
										{t('checkIn.steps.ground.question')}
									</h2>
									<p class="text-stone-400 text-sm">{t('checkIn.steps.ground.hint')}</p>
								</div>
								<textarea
									bind:value={context}
									rows={4}
									placeholder={t('checkIn.steps.ground.placeholder')}
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 text-sm resize-none focus:outline-none"
								></textarea>
							</div>

						<!-- 1: Body -->
						{:else if step === 1}
							<div class="space-y-5">
								<div>
									<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">
										{t('checkIn.steps.body.question')}
									</h2>
									<p class="text-stone-400 text-sm">{t('checkIn.steps.body.hint')}</p>
								</div>
								<div class="space-y-1">
									<p class="text-sm text-stone-500">{t('checkIn.labels.bodyLocation')}</p>
									<input
										type="text"
										bind:value={bodyLocation}
										placeholder={t('checkIn.labels.bodyLocationPlaceholder')}
										class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 text-sm focus:outline-none"
									/>
								</div>
								<div class="space-y-1">
									<p class="text-sm text-stone-500">{t('checkIn.labels.bodyQuality')}</p>
									<textarea
										bind:value={bodySensation}
										rows={2}
										placeholder={t('checkIn.labels.bodyQualityPlaceholder')}
										class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 text-sm resize-none focus:outline-none"
									></textarea>
								</div>
							</div>

						<!-- 2: Emotions -->
						{:else if step === 2}
							<div class="space-y-5">
								<div>
									<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">
										{t('checkIn.steps.emotions.question')}
									</h2>
									<p class="text-stone-400 text-sm">{t('checkIn.steps.emotions.hint')}</p>
								</div>
								<TagInput bind:tags={emotions} suggestions={EMOTION_SUGGESTIONS} placeholder={t('checkIn.steps.emotions.placeholder')} pillMode accentColor={accent} />
							</div>

						<!-- 3: Recognize -->
						{:else if step === 3}
							<div class="space-y-5">
								<div>
									<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">
										{t('checkIn.steps.recognize.question')}
									</h2>
									<p class="text-stone-400 text-sm">{t('checkIn.steps.recognize.hint')}</p>
								</div>
								<PartSelector
									parts={dataStore.parts}
									selectedId={linkedPartId}
									onselect={(id) => (linkedPartId = id)}
								/>
								{#if !linkedPartId}
									<div class="space-y-1 pt-1">
										<p class="text-sm text-stone-500">{t('checkIn.labels.newPartName')}</p>
										<input
											type="text"
											bind:value={newPartName}
											placeholder={t('checkIn.labels.newPartPlaceholder')}
											class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 text-sm focus:outline-none"
										/>
									</div>
								{/if}
							</div>

						<!-- 4: Step Back / Self-energy -->
						{:else if step === 4}
							<div class="space-y-6">
								<div>
									<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">
										{t('checkIn.steps.stepback.question')}
									</h2>
									<p class="text-stone-400 text-sm">{t('checkIn.steps.stepback.hint')}</p>
								</div>

								<div class="space-y-2">
									<p class="text-xs font-medium text-stone-400 uppercase tracking-wide flex items-center">
										{t('checkIn.labels.selfLed')}
										<Tooltip text={t('checkIn.tooltips.selfLed')} />
									</p>
									<div class="flex flex-wrap gap-2">
										{#each tArray('selfLedFeelings') as f}
											<button
												type="button"
												onclick={() => (feelingToward = f)}
												class="rounded-full px-3.5 py-1.5 text-sm border transition-all"
												style={feelingToward === f
													? `background-color: ${accent}22; color: ${accent}; border-color: ${accent}60;`
													: ''}
											>
												{f}
											</button>
										{/each}
									</div>
								</div>

								<div class="space-y-2">
									<p class="text-xs font-medium text-stone-400 uppercase tracking-wide flex items-center">
										{t('checkIn.labels.blended')}
										<Tooltip text={t('checkIn.tooltips.blended')} />
									</p>
									<div class="flex flex-wrap gap-2">
										{#each tArray('blendedFeelings') as f}
											<button
												type="button"
												onclick={() => (feelingToward = f)}
												class="rounded-full px-3.5 py-1.5 text-sm border transition-all"
												style={feelingToward === f
													? 'background-color: #fef3c7; color: #92400e; border-color: #fcd34d;'
													: ''}
											>
												{f}
											</button>
										{/each}
									</div>
								</div>

								{#if isBlended}
									<div class="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-800" transition:slide={{ duration: 200 }}>
										<p class="font-medium mb-1">{t('checkIn.blendedWarning.heading')}</p>
										<p>{t('checkIn.blendedWarning.body')}</p>
									</div>
								{/if}

								<div class="pt-2">
									<p class="text-sm text-stone-600 mb-3 flex items-center">
										{t('checkIn.labels.eightCsQuestion')}
										<Tooltip text={t('checkIn.tooltips.eightCs')} />
									</p>
									<SelfEnergyCheck bind:selected={selfEnergyQualities} />
								</div>
							</div>

						<!-- 5: Understand -->
						{:else if step === 5}
							<div class="space-y-5">
								<div>
									<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">
										{t('checkIn.steps.understand.question')}
									</h2>
									<p class="text-stone-400 text-sm">{t('checkIn.steps.understand.hint')}</p>
								</div>
								<textarea
									bind:value={whatIsItDoing}
									rows={4}
									placeholder={t('checkIn.steps.understand.placeholder')}
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 text-sm resize-none focus:outline-none"
								></textarea>
							</div>

						<!-- 6: Need -->
						{:else if step === 6}
							<div class="space-y-5">
								<div>
									<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">
										{t('checkIn.steps.need.question')}
									</h2>
									<p class="text-stone-400 text-sm">{t('checkIn.steps.need.hint')}</p>
								</div>
								<textarea
									bind:value={whatDoesItNeed}
									rows={4}
									placeholder={t('checkIn.steps.need.placeholder')}
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 text-sm resize-none focus:outline-none"
								></textarea>
							</div>

						<!-- 7: Close -->
						{:else if step === 7}
							<div class="space-y-5">
								<div>
									<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">
										{t('checkIn.steps.close.question')}
									</h2>
									<p class="text-stone-400 text-sm">{t('checkIn.steps.close.hint')}</p>
								</div>
								<textarea
									bind:value={whatHelped}
									rows={3}
									placeholder={t('checkIn.steps.close.helpedPlaceholder')}
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 text-sm resize-none focus:outline-none"
								></textarea>
								<textarea
									bind:value={notes}
									rows={2}
									placeholder={t('checkIn.steps.close.notesPlaceholder')}
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 text-sm resize-none focus:outline-none"
								></textarea>

								{#if !linkedPartId && newPartName.trim()}
									<div class="rounded-xl border px-4 py-3 text-sm" style="border-color: {accent}30; background-color: {accent}0A;">
										<p class="font-medium text-stone-700 mb-1">{t('checkIn.newPartNotice.named')} <span style="color: {accent};">{newPartName}</span></p>
										<p class="text-stone-500">{t('checkIn.newPartNotice.body')}</p>
									</div>
								{/if}

								{#if error}
									<div class="bg-red-50 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
								{/if}
							</div>
						{/if}

					</div>
				{/key}
			</div>

			<!-- Navigation -->
			<div class="flex items-center justify-between px-5 pb-6 pt-6 mt-4 border-t sm:px-10 sm:pb-8" style="border-color: {accent}20;">
				<button
					type="button"
					onclick={back}
					class="text-stone-500 hover:text-stone-800 text-sm transition-colors py-3 px-1"
					class:invisible={step === 0}
				>
					{t('checkIn.nav.back')}
				</button>

				<div class="flex gap-3">
					{#if step < STEP_IDS.length - 1}
						{#if step > 0}
							<button
								type="button"
								onclick={next}
								class="text-stone-400 hover:text-stone-600 text-sm transition-colors py-3 px-2"
							>
								{t('checkIn.nav.skip')}
							</button>
						{/if}
						<button
							type="button"
							onclick={next}
							class="ci-btn text-white rounded-lg px-6 py-3 text-sm font-medium"
						>
							{step === 0 ? t('checkIn.nav.begin') : t('checkIn.nav.continue')}
						</button>
					{:else}
						<button
							type="button"
							onclick={save}
							class="ci-btn text-white rounded-lg px-8 py-3 text-sm font-medium"
						>
							{t('checkIn.nav.save')}
						</button>
					{/if}
				</div>
			</div>
		</div>

		<p class="text-center text-xs text-stone-300 mt-5">{t('checkIn.footer')}</p>
	{/if}
</main>

<style>
	.ci-field input:focus,
	.ci-field textarea:focus {
		outline: none;
		border-color: var(--ci-color);
		box-shadow: 0 0 0 3px var(--ci-ring);
	}

	.ci-btn {
		background-color: var(--ci-color);
		transition: filter 0.15s;
	}
	.ci-btn:hover {
		filter: brightness(0.88);
	}
</style>
