<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import { dataStore } from '$lib/data/workspace.svelte';
	import type { CreatePartInput } from '$lib/data/types';
	import TagInput from '$lib/components/TagInput.svelte';
	import PartAvatar from '$lib/components/PartAvatar.svelte';

	const DRAFT_KEY = 'ifs_part_draft';

	const SWATCHES = [
		{ hex: '#D4A5A5', label: 'Dusty rose' },
		{ hex: '#E08B6E', label: 'Coral' },
		{ hex: '#E8C456', label: 'Amber' },
		{ hex: '#8CBD9A', label: 'Sage' },
		{ hex: '#4EC9B8', label: 'Teal' },
		{ hex: '#6DB5E0', label: 'Sky' },
		{ hex: '#7B8EC8', label: 'Indigo' },
		{ hex: '#A08DC0', label: 'Violet' },
		{ hex: '#8A9BB0', label: 'Slate' },
		{ hex: '#9E968E', label: 'Warm gray' },
		{ hex: '#3D8A72', label: 'Spruce' },
		{ hex: '#7BA7C2', label: 'Dusty blue' },
	];

	const EMOTION_SUGGESTIONS = [
		'fear', 'anger', 'sadness', 'shame', 'grief', 'anxiety', 'loneliness',
		'worthlessness', 'guilt', 'hopelessness', 'despair', 'rage', 'hurt',
		'embarrassment', 'jealousy', 'panic', 'numbness'
	];

	const BELIEF_SUGGESTIONS = [
		"I'm not good enough", "I'll be rejected", "I'll be humiliated",
		"I'm worthless", "Nobody cares", "I have to be perfect",
		"It's my fault", "I'm a burden", "I'll fail", "I'm broken"
	];

	const TRIGGER_SUGGESTIONS = [
		'criticism', 'rejection', 'conflict', 'being ignored', 'failure',
		'being controlled', 'uncertainty', 'vulnerability', 'confrontation',
		'being rushed', 'being evaluated', 'feeling unseen', 'abandonment', 'unpredictability'
	];

	const FEAR_SUGGESTIONS = [
		'being rejected', 'being humiliated', 'losing control', 'being abandoned',
		'making mistakes', 'being exposed', 'not being enough', 'being hurt again'
	];

	const steps = [
		{ id: 'name',     title: 'Name',        question: 'What would you call this part?' },
		{ id: 'body',     title: 'Body',         question: 'Where do you feel this part in your body?' },
		{ id: 'image',    title: 'Image',        question: 'If this part had a form or image, what would it look like?' },
		{ id: 'emotions', title: 'Emotions',     question: 'What emotions does this part carry?' },
		{ id: 'beliefs',  title: 'Beliefs',      question: 'What does this part believe?' },
		{ id: 'triggers', title: 'Triggers',     question: 'What tends to activate this part?' },
		{ id: 'intention',title: 'Intention',    question: 'What is this part trying to protect you from?' },
		{ id: 'origin',   title: 'Origin',       question: 'When did this part take on this role?' },
		{ id: 'role',     title: 'Role',         question: 'Which type resonates most?' },
		{ id: 'needs',    title: 'Needs & Gifts', question: 'What does this part need from you?' },
		{ id: 'review',   title: 'Review',       question: 'Here is what you discovered' }
	];

	const roleDescriptions = [
		{
			value: 'exile',
			label: 'Exile',
			icon: '◎',
			metaphor: 'Tender & hidden',
			colorClass: 'bg-exile-100 text-exile-700 border-exile-200',
			selectedClass: 'border-exile-200 bg-exile-50',
			description: "Carries pain, shame, or trauma from the past. Often feels young and vulnerable, tucked away where others won't find it."
		},
		{
			value: 'manager',
			label: 'Manager',
			icon: '⊞',
			metaphor: 'Planning & controlling',
			colorClass: 'bg-manager-100 text-manager-700 border-manager-200',
			selectedClass: 'border-manager-200 bg-manager-50',
			description: 'Works proactively to prevent exile pain from surfacing. Tends to plan, control, criticize, achieve, and keep everything in order.'
		},
		{
			value: 'firefighter',
			label: 'Firefighter',
			icon: '◈',
			metaphor: 'Reactive & urgent',
			colorClass: 'bg-firefighter-100 text-firefighter-700 border-firefighter-200',
			selectedClass: 'border-firefighter-200 bg-firefighter-50',
			description: 'Reacts when exile pain breaks through the managers. Uses impulsive, intense behaviors to extinguish overwhelming emotion — fast.'
		},
		{
			value: 'unknown',
			label: 'Not sure yet',
			icon: '○',
			metaphor: 'Still discovering',
			colorClass: 'bg-stone-100 text-stone-600 border-stone-200',
			selectedClass: 'border-stone-200 bg-stone-50',
			description: "It's okay not to know. This is just a starting point — you can always revisit as your understanding deepens."
		}
	];

	const roleColors: Record<string, string> = {
		exile: 'bg-exile-100 text-exile-700',
		manager: 'bg-manager-100 text-manager-700',
		firefighter: 'bg-firefighter-100 text-firefighter-700',
		unknown: 'bg-stone-100 text-stone-600'
	};

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
	let color = $state(draft.color ?? '#4EC9B8');
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
		if (currentStep < steps.length - 1) currentStep++;
	}

	function back() {
		direction = -1;
		if (currentStep > -1) currentStep--;
	}

	function submit() {
		if (!name.trim()) {
			error = 'Name is required.';
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
			goto(`/parts/${part.id}`);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save.';
		}
	}
</script>

<!-- Minimal wizard header -->
<header class="sticky top-0 z-10 bg-canvas/80 backdrop-blur-sm border-b border-stone-100/60 px-6 py-3 flex items-center">
	<a href="/parts" class="text-sm text-stone-400 hover:text-stone-600 transition-colors min-h-[44px] flex items-center">← Parts</a>
</header>

<main class="max-w-2xl mx-auto px-4 py-6 sm:py-10">
	<!-- Progress dots: only shown during numbered steps -->
	{#if currentStep >= 0}
		<div class="mb-8 text-center">
			<p class="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">
				{steps[currentStep].title}
			</p>
			<div class="flex items-center justify-center gap-2">
				{#each steps as _, i}
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
	<div class="bg-white rounded-2xl sm:rounded-3xl border border-stone-100/80 shadow-float overflow-hidden">
		{#if error}
			<div class="bg-red-50 text-red-700 px-10 pt-6 pb-0 text-sm">{error}</div>
		{/if}

		<!-- Animated step content -->
		<div class="px-5 pt-8 sm:px-10 sm:pt-10" style="min-height: 360px;">
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
								Take a moment to settle in.
							</h2>
							<p class="text-stone-500 text-base leading-relaxed">
								You're about to get to know a part of yourself — one of the inner voices or feelings that shapes how you move through the world.
							</p>
							<p class="text-stone-400 text-sm leading-relaxed mt-4">
								Approach with curiosity rather than judgment.
							</p>
							<div class="w-12 h-px bg-stone-200 mx-auto mt-8"></div>
						</div>

					<!-- Step 0: Name -->
					{:else if currentStep === 0}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{steps[0].question}</h2>
								<p class="text-stone-400 text-sm">Give it a name that feels right — descriptive, metaphorical, or literal.</p>
							</div>
							<input
								type="text"
								bind:value={name}
								placeholder="e.g. The Inner Critic, The Protector, Little One"
								class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
								autofocus
							/>
							<div class="space-y-1">
								<label class="block text-sm text-stone-500">Nickname <span class="text-stone-400">(optional — shorter name for visualization)</span></label>
								<input
									type="text"
									bind:value={nickname}
									placeholder="A shorter name for the map"
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm"
								/>
							</div>
							<div class="space-y-2">
								<label class="block text-sm text-stone-500">Color <span class="text-stone-400">(pick one that feels like this part)</span></label>
								<div class="grid grid-cols-6 gap-2.5">
									{#each SWATCHES as swatch}
										<button
											type="button"
											onclick={() => (color = swatch.hex)}
											title={swatch.label}
											aria-label="{swatch.label}{color === swatch.hex ? ' (selected)' : ''}"
											class="w-9 h-9 rounded-full transition-all duration-150 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-400 {
												color === swatch.hex
													? 'ring-2 ring-offset-2 ring-stone-400 scale-110'
													: 'opacity-75 hover:opacity-100 hover:scale-105'
											}"
											style="background-color: {swatch.hex}"
										>
											{#if color === swatch.hex}
												<span class="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow" aria-hidden="true">✓</span>
											{/if}
										</button>
									{/each}
								</div>
							</div>
						</div>

					<!-- Step 1: Body -->
					{:else if currentStep === 1}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{steps[1].question}</h2>
								<p class="text-stone-400 text-sm">Take a moment to close your eyes, turn your attention inward, and notice where you sense this part.</p>
							</div>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600">Location</label>
								<input
									type="text"
									bind:value={bodyLocation}
									placeholder='e.g. "a knot in my gut", "tightness in my chest"'
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm"
								/>
							</div>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600">Sensation</label>
								<textarea
									bind:value={bodySensation}
									rows={3}
									placeholder='e.g. "heavy, hollow, tight, warm, electric, frozen"'
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm resize-none"
								></textarea>
							</div>
						</div>

					<!-- Step 2: Image -->
					{:else if currentStep === 2}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{steps[2].question}</h2>
								<p class="text-stone-400 text-sm">Let an image arise naturally — it might be a person, creature, object, or scene.</p>
							</div>
							<textarea
								bind:value={image}
								rows={3}
								placeholder='e.g. "a scared child", "a dragon", "a tough teenager with crossed arms"'
								class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm resize-none"
							></textarea>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600">Apparent age or life stage</label>
								<input
									type="text"
									bind:value={apparentAge}
									placeholder='e.g. "8 years old", "a teenager", "ancient"'
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm"
								/>
							</div>
						</div>

					<!-- Step 3: Emotions -->
					{:else if currentStep === 3}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{steps[3].question}</h2>
								<p class="text-stone-400 text-sm">Tap to select feelings this part carries, or type your own.</p>
							</div>
							<TagInput bind:tags={emotions} suggestions={EMOTION_SUGGESTIONS} placeholder="Or type your own…" pillMode={true} />
						</div>

					<!-- Step 4: Beliefs -->
					{:else if currentStep === 4}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{steps[4].question}</h2>
								<p class="text-stone-400 text-sm">What does this part believe about you, the world, or what will happen?</p>
							</div>
							<TagInput bind:tags={beliefs} suggestions={BELIEF_SUGGESTIONS} placeholder="Or describe your own belief…" pillMode={true} />
						</div>

					<!-- Step 5: Triggers -->
					{:else if currentStep === 5}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{steps[5].question}</h2>
								<p class="text-stone-400 text-sm">What situations, people, or experiences tend to bring this part forward?</p>
							</div>
							<TagInput bind:tags={triggers} suggestions={TRIGGER_SUGGESTIONS} placeholder="Or describe a trigger…" pillMode={true} />
						</div>

					<!-- Step 6: Intention -->
					{:else if currentStep === 6}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{steps[6].question}</h2>
								<p class="text-stone-400 text-sm">Every part has a positive intention — something it is trying to do for you, even when the strategy feels harmful.</p>
							</div>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600">Positive intention</label>
								<textarea
									bind:value={positiveIntention}
									rows={3}
									placeholder='e.g. "Keep me from being humiliated again", "Make sure I work hard enough"'
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm resize-none"
								></textarea>
							</div>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600">What would it fear if it stopped?</label>
								<TagInput bind:tags={fears} suggestions={FEAR_SUGGESTIONS} placeholder="Or describe a fear…" pillMode={true} />
							</div>
						</div>

					<!-- Step 7: Origin -->
					{:else if currentStep === 7}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{steps[7].question}</h2>
								<p class="text-stone-400 text-sm">Parts often emerge in response to experiences that happened to you. When was this part "born"?</p>
							</div>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600">Life stage or approximate age</label>
								<input
									type="text"
									bind:value={originLifeStage}
									placeholder="e.g. &quot;childhood&quot;, &quot;age 7&quot;, &quot;my parents' divorce&quot;"
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm"
								/>
							</div>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600">Origin story <span class="text-stone-400">(optional)</span></label>
								<textarea
									bind:value={originStory}
									rows={4}
									placeholder="What was happening? What did this part witness or experience that caused it to take on this role?"
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm resize-none"
								></textarea>
							</div>
						</div>

					<!-- Step 8: Role type -->
					{:else if currentStep === 8}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{steps[8].question}</h2>
								<p class="text-stone-400 text-sm">In IFS, parts tend to fall into three roles. It's okay to be unsure — this is just a starting point.</p>
							</div>
							<div class="space-y-3">
								{#each roleDescriptions as role}
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
												<span class="text-xs font-semibold px-2.5 py-0.5 rounded-full border {role.colorClass}">{role.label}</span>
												<span class="text-xs text-stone-400 italic">{role.metaphor}</span>
											</div>
											<p class="text-stone-500 text-sm leading-relaxed">{role.description}</p>
										</div>
									</label>
								{/each}
							</div>
						</div>

					<!-- Step 9: Needs & Gifts -->
					{:else if currentStep === 9}
						<div class="space-y-5">
							<div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-700 leading-snug mb-1">{steps[9].question}</h2>
								<p class="text-stone-400 text-sm">When parts feel seen and cared for, they can relax their extreme role and offer their gifts.</p>
							</div>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600">What does this part need from your Self?</label>
								<textarea
									bind:value={whatItNeedsFromSelf}
									rows={3}
									placeholder="e.g. To be heard, To know I'm safe now"
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm resize-none"
								></textarea>
							</div>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600">What gifts might it offer when unburdened? <span class="text-stone-400">(optional)</span></label>
								<textarea
									bind:value={giftsWhenUnburdened}
									rows={3}
									placeholder='e.g. "Healthy assertiveness", "Protective instincts without rage", "Genuine confidence"'
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm resize-none"
								></textarea>
							</div>
							<div class="space-y-1">
								<label class="block text-sm text-stone-600">Notes <span class="text-stone-400">(optional)</span></label>
								<textarea
									bind:value={notes}
									rows={3}
									placeholder="Anything else you want to remember about this part"
									class="w-full rounded-lg border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm resize-none"
								></textarea>
							</div>
						</div>

					<!-- Step 10: Review -->
					{:else if currentStep === 10}
						<div class="space-y-5">
							<div class="text-center mb-2">
								<div class="flex justify-center mb-4">
									<PartAvatar size="xl" color={color} name={name || 'Part'} />
								</div>
								<h2 class="font-serif text-xl sm:text-2xl text-stone-800">
									You've come to know {name || 'this part'}
								</h2>
								{#if nickname}
									<p class="text-stone-400 italic text-sm mt-1">"{nickname}"</p>
								{/if}
								{#if roleType}
									<span class="inline-block mt-3 text-xs font-medium px-3 py-1 rounded-full {roleColors[roleType] ?? roleColors.unknown}">
										{roleType}
									</span>
								{/if}
							</div>

							<div class="space-y-3 text-sm">
								{#if bodyLocation}
									<div class="bg-canvas-muted rounded-xl p-4">
										<p class="text-stone-500 text-xs font-medium uppercase tracking-wide mb-1">Body</p>
										<p class="text-stone-700">{bodyLocation}{bodySensation ? ` — ${bodySensation}` : ''}</p>
									</div>
								{/if}

								{#if image}
									<div class="bg-canvas-muted rounded-xl p-4">
										<p class="text-stone-500 text-xs font-medium uppercase tracking-wide mb-1">Image{apparentAge ? ` · ${apparentAge}` : ''}</p>
										<p class="text-stone-700 italic">"{image}"</p>
									</div>
								{/if}

								{#if emotions.length > 0}
									<div>
										<p class="text-stone-500 text-xs font-medium uppercase tracking-wide mb-2">Emotions</p>
										<div class="flex flex-wrap gap-1.5">
											{#each emotions as e}
												<span class="bg-primary-50 text-primary-700 rounded-full px-2.5 py-1 text-xs">{e}</span>
											{/each}
										</div>
									</div>
								{/if}

								{#if beliefs.length > 0}
									<div>
										<p class="text-stone-500 text-xs font-medium uppercase tracking-wide mb-2">Beliefs</p>
										<ul class="space-y-1">
											{#each beliefs as b}
												<li class="text-stone-700">• {b}</li>
											{/each}
										</ul>
									</div>
								{/if}

								{#if positiveIntention}
									<div class="bg-canvas-muted rounded-xl p-4">
										<p class="text-stone-500 text-xs font-medium uppercase tracking-wide mb-1">Positive Intention</p>
										<p class="text-stone-700">{positiveIntention}</p>
									</div>
								{/if}

								{#if originLifeStage}
									<div class="bg-canvas-muted rounded-xl p-4">
										<p class="text-stone-500 text-xs font-medium uppercase tracking-wide mb-1">Origin</p>
										<p class="text-stone-700 font-medium">{originLifeStage}</p>
										{#if originStory}<p class="text-stone-600 mt-1">{originStory}</p>{/if}
									</div>
								{/if}

								{#if whatItNeedsFromSelf}
									<div class="bg-primary-50 rounded-xl p-4">
										<p class="text-primary-700 text-xs font-medium uppercase tracking-wide mb-1">Needs from Self</p>
										<p class="text-primary-900">{whatItNeedsFromSelf}</p>
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
					class="bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-10 py-3 text-sm font-medium transition-colors tracking-wide"
				>
					I'm ready
				</button>
			</div>
		{:else}
			<div class="flex items-center justify-between px-5 pb-6 pt-6 mt-8 border-t border-stone-100 sm:px-10 sm:pb-8">
				<button
					type="button"
					onclick={back}
					class="text-stone-500 hover:text-stone-800 text-sm transition-colors py-3 px-1 {currentStep === 0 ? 'invisible' : ''}"
				>
					← Back
				</button>

				<div class="flex gap-3">
					{#if currentStep < steps.length - 1}
						{#if currentStep > 0}
							<button
								type="button"
								onclick={next}
								class="text-stone-400 hover:text-stone-600 text-sm transition-colors py-3 px-2"
							>
								Skip
							</button>
						{/if}
						<button
							type="button"
							onclick={next}
							disabled={!canAdvance()}
							class="bg-primary-600 hover:bg-primary-700 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-lg px-6 py-3 text-sm font-medium transition-colors"
						>
							{currentStep === 0 ? 'Begin' : 'Continue'}
						</button>
					{:else}
						<button
							type="button"
							onclick={submit}
							class="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-8 py-3 text-sm font-medium transition-colors"
						>
							Save this part
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<p class="text-center text-xs text-stone-300 mt-5">Your progress is saved automatically</p>
</main>
