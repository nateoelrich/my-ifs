<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { fly, fade, slide } from 'svelte/transition';
	import { dataStore } from '$lib/data/workspace.svelte';
	import { BURDEN_ELEMENTS } from '$lib/data/session-constants';
	import Nav from '$lib/components/Nav.svelte';
	import SelfEnergyCheck from '$lib/components/SelfEnergyCheck.svelte';
	import PartAvatar from '$lib/components/PartAvatar.svelte';

	const protocol = $derived((page.url.searchParams.get('protocol') ?? '6fs') as '6fs' | 'unburdening');
	const partId    = $derived(page.url.searchParams.get('partId') ?? undefined);
	const linkedPart = $derived(partId ? dataStore.getPart(partId) : null);
	const accent = $derived(linkedPart?.color ?? '#7c3aed');

	// ---- 6 F's ----
	const SIX_FS_STEPS = [
		{
			id: 'find',
			title: 'Find',
			question: 'Find the part in your body.',
			hint: 'Where do you sense this part right now? What does it feel like to be near it?'
		},
		{
			id: 'focus',
			title: 'Focus',
			question: 'Let yourself stay with it.',
			hint: 'Keep your attention here. What do you notice as you focus on it?'
		},
		{
			id: 'fleshOut',
			title: 'Flesh Out',
			question: 'Let the part take shape.',
			hint: 'If this part had a form, an image, a color — what comes up? How old does it seem?'
		},
		{
			id: 'feelToward',
			title: 'Feel Toward',
			question: 'How do you feel toward this part right now?',
			hint: 'Are you curious, compassionate, wary? Notice your reaction without judgment.'
		},
		{
			id: 'befriend',
			title: 'Befriend',
			question: 'Let the part know you see it.',
			hint: 'Ask it: what do you do for me? What is your role? What would you like me to understand?'
		},
		{
			id: 'fear',
			title: 'Fear',
			question: 'Ask the part what it is afraid of.',
			hint: 'What is this part afraid would happen if it stopped doing its job?'
		}
	];

	// ---- Unburdening ----
	const UNBURDEN_STEPS = [
		{
			id: 'access',
			title: 'Access',
			question: 'Gently bring this exile to mind.',
			hint: 'Come to it with caring distance — not too close, not too far. What do you notice?'
		},
		{
			id: 'witness',
			title: 'Witness',
			question: 'Let the exile share its story.',
			hint: 'What did it experience? What happened to it? What does it need you to know?'
		},
		{
			id: 'validate',
			title: 'Validate',
			question: 'Tell the exile you understand.',
			hint: 'Write what you want to say to this part — that you see why it felt that way.'
		},
		{
			id: 'doOver',
			title: 'Do-Over',
			question: 'Offer it what it needed then.',
			hint: 'In your imagination, what could you provide that this part didn\'t get? Protection? Love? Safety?'
		},
		{
			id: 'retrieve',
			title: 'Retrieve',
			question: 'Bring the exile to safety.',
			hint: 'Invite this part from that past scene to somewhere safe — with you now, or a peaceful place.'
		},
		{
			id: 'unburden',
			title: 'Unburden',
			question: 'Invite the exile to release its burdens.',
			hint: 'How does the burden leave? Choose what feels right.'
		},
		{
			id: 'gifts',
			title: 'Gifts',
			question: 'What does this exile offer now that it\'s lighter?',
			hint: 'What positive quality or gift does this part carry now that the burden is released?'
		}
	];

	const STEPS = $derived(protocol === '6fs' ? SIX_FS_STEPS : UNBURDEN_STEPS);
	const isUnburdening = $derived(protocol === 'unburdening');

	let step = $state(0);
	let direction = $state(1);
	let saved = $state(false);
	let selfEnergyQualities = $state<string[]>([]);

	// 6 F's fields
	let find = $state('');
	let focus = $state('');
	let fleshOut = $state('');
	let feelToward = $state('');
	let befriend = $state('');
	let fear = $state('');

	// Unburdening fields
	let witness = $state('');
	let validate = $state('');
	let doOver = $state('');
	let retrieve = $state('');
	let burdenRelease = $state<string[]>([]);
	let gifts = $state('');
	let markUnburdened = $state(false);

	function toggleBurden(id: string) {
		burdenRelease = burdenRelease.includes(id)
			? burdenRelease.filter((x) => x !== id)
			: [...burdenRelease, id];
	}

	function next() { direction = 1; if (step < STEPS.length - 1) step++; }
	function back() { direction = -1; if (step > 0) step--; }

	function save() {
		try {
			const session = dataStore.createSession(
				protocol === '6fs'
					? {
						type: 'session',
						protocol: '6fs',
						emotions: [],
						selfEnergyQualities,
						linkedPartId: partId,
						sixFs: { find, focus, fleshOut, feelToward, befriend, fear }
					}
					: {
						type: 'session',
						protocol: 'unburdening',
						emotions: [],
						selfEnergyQualities,
						linkedPartId: partId,
						unburdening: { witness, validate, doOver, retrieve, burdenRelease, gifts }
					}
			);

			if (isUnburdening && markUnburdened && partId) {
				const p = dataStore.getPart(partId);
				if (p) {
					const { id: _id, type: _t, schemaVersion: _sv, createdAt: _ca, updatedAt: _ua, ...rest } = p;
					dataStore.updatePart(partId, { ...rest, hasUnburdened: true });
				}
			}

			saved = true;
			setTimeout(() => goto(`${base}/sessions/${session.id}`), 1200);
		} catch {
			// ignore
		}
	}

	const currentStepDef = $derived(STEPS[step]);
	const fieldKey = $derived(currentStepDef?.id ?? '');

	function getFieldValue(key: string): string {
		const map: Record<string, string> = { find, focus, fleshOut, feelToward, befriend, fear, witness, validate, doOver, retrieve, gifts };
		return map[key] ?? '';
	}

	function setFieldValue(key: string, val: string) {
		if (key === 'find') find = val;
		else if (key === 'focus') focus = val;
		else if (key === 'fleshOut') fleshOut = val;
		else if (key === 'feelToward') feelToward = val;
		else if (key === 'befriend') befriend = val;
		else if (key === 'fear') fear = val;
		else if (key === 'witness') witness = val;
		else if (key === 'validate') validate = val;
		else if (key === 'doOver') doOver = val;
		else if (key === 'retrieve') retrieve = val;
		else if (key === 'gifts') gifts = val;
	}
</script>

<header class="sticky top-0 z-10 bg-canvas/80 backdrop-blur-sm border-b border-stone-100/60 px-6 py-3 flex items-center">
	<a
		href={partId ? `${base}/parts/${partId}` : `${base}/sessions`}
		class="text-sm text-stone-400 hover:text-stone-600 transition-colors min-h-[44px] flex items-center"
	>
		← {linkedPart?.name ?? 'Journal'}
	</a>
</header>

<main class="max-w-2xl mx-auto px-4 py-6 sm:py-10">
	{#if saved}
		<div class="text-center py-20" in:fade>
			<div class="text-4xl mb-4">✓</div>
			<p class="font-serif text-xl text-stone-700">Session saved.</p>
		</div>
	{:else}

		<!-- Unburdening safety note -->
		{#if isUnburdening && step === 0}
			<div class="rounded-xl bg-amber-50 border border-amber-100 px-5 py-4 mb-6 text-sm text-amber-800" transition:slide>
				<p class="font-medium mb-1">Deep work ahead.</p>
				<p>This is the exile healing process. Move at whatever pace feels right. You can stop at any step.</p>
			</div>
		{/if}

		<!-- Header -->
		<div class="mb-8 text-center">
			<p class="text-xs text-stone-400 uppercase tracking-widest mb-1">
				{protocol === '6fs' ? 'Meet a Protector — 6 F\'s' : 'Healing an Exile'}
			</p>
			{#if linkedPart}
				<div class="flex items-center justify-center gap-2 mt-2">
					<PartAvatar size="sm" color={linkedPart.color} name={linkedPart.name} />
					<span class="text-stone-600 font-medium">{linkedPart.name}</span>
				</div>
			{/if}
			<div class="flex items-center justify-center gap-1.5 mt-4">
				{#each STEPS as _, i}
					<div class="rounded-full transition-all duration-300 {
						i < step ? 'w-2 h-2 bg-primary-400'
						: i === step ? 'w-2.5 h-2.5 bg-primary-600 ring-2 ring-offset-1 ring-primary-200'
						: 'w-1.5 h-1.5 bg-stone-200'
					}"></div>
				{/each}
			</div>
		</div>

		<!-- Card -->
		<div
			class="rounded-2xl sm:rounded-3xl border shadow-float overflow-hidden"
			style="background-color: {accent}0E; border-color: {accent}28; --pr-color: {accent}; --pr-ring: {accent}40;"
		>
			<div class="protocol-field px-5 pt-8 sm:px-10 sm:pt-10" style="min-height: 300px;">
				{#key step}
					<div in:fly={{ x: direction * 28, duration: 220, opacity: 0 }} out:fade={{ duration: 80 }}>

						{#if fieldKey === 'unburden'}
							<!-- Burden release element picker -->
							<div class="space-y-5">
								<div>
									<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{currentStepDef.question}</h2>
									<p class="text-stone-400 text-sm">{currentStepDef.hint}</p>
								</div>
								<div class="flex flex-wrap gap-3">
									{#each BURDEN_ELEMENTS as el}
										<button
											type="button"
											onclick={() => toggleBurden(el.id)}
											class="flex flex-col items-center gap-1 rounded-xl border-2 px-5 py-4 transition-all"
											style={burdenRelease.includes(el.id)
												? `border-color: ${accent}; background-color: ${accent}15;`
												: 'border-color: #e7e5e4; background: white;'}
										>
											<span class="text-2xl">{el.emoji}</span>
											<span class="text-xs text-stone-600">{el.label}</span>
										</button>
									{/each}
								</div>
							</div>

						{:else if fieldKey === 'feelToward' && protocol === '6fs'}
							<!-- Self-energy check for 6 F's -->
							<div class="space-y-5">
								<div>
									<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{currentStepDef.question}</h2>
									<p class="text-stone-400 text-sm">{currentStepDef.hint}</p>
								</div>
								<div class="space-y-1">
									<p class="text-sm text-stone-500">Describe your feeling toward it</p>
									<textarea
										value={feelToward}
										oninput={(e) => (feelToward = (e.target as HTMLTextAreaElement).value)}
										rows={2}
										placeholder='e.g. "curious and a little wary" or "I feel compassion for it"'
										class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 text-sm resize-none focus:outline-none"
									></textarea>
								</div>
								<div class="space-y-2">
									<p class="text-sm text-stone-500">8 C's of Self present right now</p>
									<SelfEnergyCheck bind:selected={selfEnergyQualities} />
								</div>
							</div>

						{:else}
							<!-- Default: single text field -->
							<div class="space-y-5">
								<div>
									<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{currentStepDef.question}</h2>
									<p class="text-stone-400 text-sm">{currentStepDef.hint}</p>
								</div>
								<textarea
									value={getFieldValue(fieldKey)}
									oninput={(e) => setFieldValue(fieldKey, (e.target as HTMLTextAreaElement).value)}
									rows={5}
									placeholder="Take your time. There's no right answer."
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 text-sm resize-none focus:outline-none"
								></textarea>
							</div>
						{/if}

						<!-- Final step: closing extras -->
						{#if step === STEPS.length - 1}
							{#if isUnburdening && linkedPart}
								<div class="mt-5">
									<label class="flex items-center gap-3 cursor-pointer">
										<input type="checkbox" bind:checked={markUnburdened} class="rounded accent-primary-600" />
										<span class="text-sm text-stone-600">Mark <strong>{linkedPart.name}</strong> as having completed an unburdening</span>
									</label>
								</div>
							{/if}
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
				>← Back</button>

				<div class="flex gap-3">
					{#if step < STEPS.length - 1}
						<button type="button" onclick={next} class="text-stone-400 hover:text-stone-600 text-sm transition-colors py-3 px-2">Skip</button>
						<button type="button" onclick={next} class="pr-btn text-white rounded-lg px-6 py-3 text-sm font-medium">Continue</button>
					{:else}
						<button type="button" onclick={save} class="pr-btn text-white rounded-lg px-8 py-3 text-sm font-medium">Save session</button>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	.protocol-field textarea:focus {
		outline: none;
		border-color: var(--pr-color);
		box-shadow: 0 0 0 3px var(--pr-ring);
	}
	.pr-btn {
		background-color: var(--pr-color);
		transition: filter 0.15s;
	}
	.pr-btn:hover { filter: brightness(0.88); }
</style>
