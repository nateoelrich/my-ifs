<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { dataStore } from '$lib/data/workspace.svelte';
	import type { Part, CreatePartInput } from '$lib/data/types';
	import Nav from '$lib/components/Nav.svelte';
	import TagInput from '$lib/components/TagInput.svelte';
	import PartAvatar from '$lib/components/PartAvatar.svelte';

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

	const FEAR_SUGGESTIONS = [
		'being rejected', 'being humiliated', 'losing control', 'being abandoned',
		'making mistakes', 'being exposed', 'not being enough', 'being hurt again'
	];

	const roleColors: Record<string, string> = {
		exile: 'bg-exile-100 text-exile-700',
		manager: 'bg-manager-100 text-manager-700',
		firefighter: 'bg-firefighter-100 text-firefighter-700',
		unknown: 'bg-stone-100 text-stone-600'
	};

	const id = $derived(page.params.id ?? '');
	const part = $derived(dataStore.getPart(id) ?? null);

	let editing = $state(false);
	let error = $state('');

	// Edit form state
	let eName = $state('');
	let eNickname = $state('');
	let eColor = $state('');
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

	function populateEditForm(p: Part) {
		eName = p.name;
		eNickname = p.nickname ?? '';
		eColor = p.color ?? '#9E968E';
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
	}

	function saveEdit() {
		if (!eName.trim()) { error = 'Name is required.'; return; }
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
			error = err instanceof Error ? err.message : 'Failed to save.';
		}
	}

	function handleDelete() {
		if (!confirm(`Remove "${part?.name}"? This cannot be undone.`)) return;
		try {
			dataStore.deletePart(id);
			goto('/parts');
		} catch {
			error = 'Failed to delete.';
		}
	}

	const inputClass = "w-full rounded-lg border border-stone-200 px-4 py-2.5 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm";
	const textareaClass = `${inputClass} resize-none`;
</script>

<Nav />

<main class="max-w-3xl mx-auto px-4 py-6 sm:py-8">
	{#if !part}
		<div class="text-center py-20 text-stone-400">
			<p>Part not found.</p>
			<a href="/parts" class="text-primary-600 hover:underline text-sm mt-4 block">← Back to parts</a>
		</div>

	{:else}
		<!-- Header with color wash -->
		<div
			class="rounded-2xl mb-8 px-6 pt-6 pb-7 border border-stone-100/60"
			style={part.color ? `background: linear-gradient(150deg, ${part.color}1A 0%, ${part.color}0D 40%, transparent 100%)` : ''}
		>
			<!-- Avatar — centered on mobile, left on sm+ -->
			<div class="flex justify-center mb-5 sm:justify-start">
				<PartAvatar color={part.color || '#9E968E'} name={part.name} size="xl" />
			</div>

			<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<a href="/parts" class="text-stone-400 hover:text-stone-600 text-sm transition-colors block mb-2">← Parts</a>
					<h1 class="text-xl sm:text-2xl font-serif text-stone-800">{part.name}</h1>
					{#if part.nickname}<p class="text-stone-400 text-sm italic">"{part.nickname}"</p>{/if}
					{#if part.roleType}
						<span class="inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full {roleColors[part.roleType] ?? roleColors.unknown}">
							{part.roleType}
						</span>
					{/if}
				</div>
				<div class="flex gap-2 sm:flex-shrink-0">
					{#if !editing}
						<button
							onclick={() => { populateEditForm(part!); editing = true; }}
							class="flex-1 sm:flex-none text-sm text-stone-500 hover:text-primary-700 border border-stone-200 hover:border-primary-300 rounded-lg px-4 py-2.5 min-h-[44px] transition-colors"
						>
							Edit
						</button>
						<button
							onclick={handleDelete}
							class="flex-1 sm:flex-none text-sm text-stone-400 hover:text-red-500 border border-stone-200 hover:border-red-200 rounded-lg transition-colors px-4 py-2.5 min-h-[44px]"
						>
							Delete
						</button>
					{:else}
						<button
							onclick={() => (editing = false)}
							class="flex-1 sm:flex-none text-sm text-stone-500 hover:text-stone-700 border border-stone-200 rounded-lg transition-colors min-h-[44px] px-4 py-2.5"
						>
							Cancel
						</button>
						<button
							onclick={saveEdit}
							class="flex-1 sm:flex-none text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2.5 min-h-[44px] transition-colors"
						>
							Save
						</button>
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
					<section class="bg-white rounded-2xl border border-stone-100 p-4 sm:p-6">
						<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">Body</h2>
						{#if part.bodyLocation}<p class="text-stone-800 font-medium">{part.bodyLocation}</p>{/if}
						{#if part.bodySensation}<p class="text-stone-600 mt-1">{part.bodySensation}</p>{/if}
					</section>
				{/if}

				{#if part.image}
					<section class="bg-white rounded-2xl border border-stone-100 p-4 sm:p-6">
						<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">
							Image{part.apparentAge ? ` · ${part.apparentAge}` : ''}
						</h2>
						<p class="text-stone-700 italic">"{part.image}"</p>
					</section>
				{/if}

				{#if part.emotions?.length > 0 || part.beliefs?.length > 0 || part.triggers?.length > 0}
					<section class="bg-white rounded-2xl border border-stone-100 p-4 sm:p-6 space-y-4">
						{#if part.emotions?.length > 0}
							<div>
								<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">Emotions</h2>
								<div class="flex flex-wrap gap-2">
									{#each part.emotions as e}
										<span class="bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-sm">{e}</span>
									{/each}
								</div>
							</div>
						{/if}
						{#if part.beliefs?.length > 0}
							<div>
								<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">Beliefs</h2>
								<ul class="space-y-1">
									{#each part.beliefs as b}
										<li class="text-stone-700 text-sm">• {b}</li>
									{/each}
								</ul>
							</div>
						{/if}
						{#if part.triggers?.length > 0}
							<div>
								<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">Triggers</h2>
								<div class="flex flex-wrap gap-2">
									{#each part.triggers as t}
										<span class="bg-stone-50 text-stone-600 rounded-full px-3 py-1 text-sm border border-stone-100">{t}</span>
									{/each}
								</div>
							</div>
						{/if}
					</section>
				{/if}

				{#if part.positiveIntention || part.fears?.length > 0}
					<section class="bg-white rounded-2xl border border-stone-100 p-4 sm:p-6 space-y-4">
						{#if part.positiveIntention}
							<div>
								<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">Positive Intention</h2>
								<p class="text-stone-700">{part.positiveIntention}</p>
							</div>
						{/if}
						{#if part.fears?.length > 0}
							<div>
								<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">Fears</h2>
								<div class="flex flex-wrap gap-2">
									{#each part.fears as f}
										<span class="bg-stone-50 text-stone-600 rounded-full px-3 py-1 text-sm border border-stone-100">{f}</span>
									{/each}
								</div>
							</div>
						{/if}
					</section>
				{/if}

				{#if part.originLifeStage || part.originStory}
					<section class="bg-white rounded-2xl border border-stone-100 p-4 sm:p-6">
						<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">Origin</h2>
						{#if part.originLifeStage}
							<p class="text-stone-800 font-medium">{part.originLifeStage}</p>
						{/if}
						{#if part.originStory}
							<p class="text-stone-600 mt-2 whitespace-pre-wrap">{part.originStory}</p>
						{/if}
					</section>
				{/if}

				{#if part.whatItNeedsFromSelf || part.giftsWhenUnburdened}
					<section class="bg-primary-50 rounded-2xl border border-primary-100 p-4 sm:p-6 space-y-4">
						{#if part.whatItNeedsFromSelf}
							<div>
								<h2 class="text-xs font-medium text-primary-500 uppercase tracking-wide mb-2">Needs from Self</h2>
								<p class="text-primary-900">{part.whatItNeedsFromSelf}</p>
							</div>
						{/if}
						{#if part.giftsWhenUnburdened}
							<div>
								<h2 class="text-xs font-medium text-primary-500 uppercase tracking-wide mb-2">Gifts When Unburdened</h2>
								<p class="text-primary-900">{part.giftsWhenUnburdened}</p>
							</div>
						{/if}
					</section>
				{/if}

				{#if part.notes}
					<section class="bg-white rounded-2xl border border-stone-100 p-4 sm:p-6">
						<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">Notes</h2>
						<p class="text-stone-600 whitespace-pre-wrap">{part.notes}</p>
					</section>
				{/if}

				<p class="text-xs text-stone-300 text-right">
					Created {new Date(part.createdAt).toLocaleDateString()} ·
					Updated {new Date(part.updatedAt).toLocaleDateString()}
				</p>
			</div>

		{:else}
			<!-- Edit mode -->
			<div class="space-y-6">
				<section class="bg-white rounded-2xl border border-stone-100 p-4 sm:p-6 space-y-4">
					<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide">Identity</h2>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">Name *</label>
						<input type="text" bind:value={eName} class={inputClass} />
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">Nickname</label>
						<input type="text" bind:value={eNickname} class={inputClass} />
					</div>
					<div class="space-y-2">
						<label class="block text-sm text-stone-600">Color</label>
						<div class="grid grid-cols-6 gap-2.5">
							{#each SWATCHES as swatch}
								<button
									type="button"
									onclick={() => (eColor = swatch.hex)}
									title={swatch.label}
									aria-label="{swatch.label}{eColor === swatch.hex ? ' (selected)' : ''}"
									class="w-9 h-9 rounded-full transition-all duration-150 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-400 {
										eColor === swatch.hex
											? 'ring-2 ring-offset-2 ring-stone-400 scale-110'
											: 'opacity-75 hover:opacity-100 hover:scale-105'
									}"
									style="background-color: {swatch.hex}"
								>
									{#if eColor === swatch.hex}
										<span class="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow" aria-hidden="true">✓</span>
									{/if}
								</button>
							{/each}
						</div>
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">Role type</label>
						<select bind:value={eRoleType} class={inputClass}>
							<option value="">— Not sure yet —</option>
							<option value="exile">Exile</option>
							<option value="manager">Manager</option>
							<option value="firefighter">Firefighter</option>
							<option value="unknown">Unknown</option>
						</select>
					</div>
				</section>

				<section class="bg-white rounded-2xl border border-stone-100 p-4 sm:p-6 space-y-4">
					<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide">Body & Image</h2>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">Body location</label>
						<input type="text" bind:value={eBodyLocation} class={inputClass} />
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">Body sensation</label>
						<textarea rows={2} bind:value={eBodySensation} class={textareaClass}></textarea>
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">Image</label>
						<textarea rows={2} bind:value={eImage} class={textareaClass}></textarea>
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">Apparent age</label>
						<input type="text" bind:value={eApparentAge} class={inputClass} />
					</div>
				</section>

				<section class="bg-white rounded-2xl border border-stone-100 p-4 sm:p-6 space-y-4">
					<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide">Emotions, Beliefs & Triggers</h2>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">Emotions</label>
						<TagInput bind:tags={eEmotions} suggestions={EMOTION_SUGGESTIONS} />
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">Beliefs</label>
						<TagInput bind:tags={eBeliefs} suggestions={BELIEF_SUGGESTIONS} />
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">Triggers</label>
						<TagInput bind:tags={eTriggers} />
					</div>
				</section>

				<section class="bg-white rounded-2xl border border-stone-100 p-4 sm:p-6 space-y-4">
					<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide">Protective Function</h2>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">Positive intention</label>
						<textarea rows={3} bind:value={ePositiveIntention} class={textareaClass}></textarea>
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">Fears</label>
						<TagInput bind:tags={eFears} suggestions={FEAR_SUGGESTIONS} />
					</div>
				</section>

				<section class="bg-white rounded-2xl border border-stone-100 p-4 sm:p-6 space-y-4">
					<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide">Origin</h2>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">Life stage</label>
						<input type="text" bind:value={eOriginLifeStage} class={inputClass} />
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">Origin story</label>
						<textarea rows={4} bind:value={eOriginStory} class={textareaClass}></textarea>
					</div>
				</section>

				<section class="bg-white rounded-2xl border border-stone-100 p-4 sm:p-6 space-y-4">
					<h2 class="text-xs font-medium text-stone-400 uppercase tracking-wide">Needs & Gifts</h2>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">What it needs from Self</label>
						<textarea rows={3} bind:value={eWhatItNeedsFromSelf} class={textareaClass}></textarea>
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">Gifts when unburdened</label>
						<textarea rows={3} bind:value={eGiftsWhenUnburdened} class={textareaClass}></textarea>
					</div>
					<div class="space-y-1">
						<label class="block text-sm text-stone-600">Notes</label>
						<textarea rows={3} bind:value={eNotes} class={textareaClass}></textarea>
					</div>
				</section>
			</div>
		{/if}
	{/if}
</main>
