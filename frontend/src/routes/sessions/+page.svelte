<script lang="ts">
	import { base } from '$app/paths';
	import { dataStore } from '$lib/data/workspace.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import SessionCard from '$lib/components/SessionCard.svelte';
	import PartAvatar from '$lib/components/PartAvatar.svelte';

	let filterPartId = $state<string | undefined>(undefined);

	const allSessions = $derived(dataStore.sessions);

	const filtered = $derived(
		filterPartId
			? allSessions.filter((s) => s.linkedPartId === filterPartId)
			: allSessions
	);

	const activeParts = $derived(
		dataStore.parts.filter((p) =>
			allSessions.some((s) => s.linkedPartId === p.id)
		)
	);
</script>

<Nav />

<main class="max-w-2xl mx-auto px-4 py-6 sm:py-8">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
		<div>
			<h1 class="text-xl sm:text-2xl font-serif text-stone-700">Journal</h1>
			<p class="text-stone-500 text-sm mt-1">Your IFS sessions and check-ins</p>
		</div>
		<div class="flex gap-2">
			<a
				href="{base}/check-in/daily"
				class="border border-stone-200 hover:border-stone-300 text-stone-600 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-center min-h-[44px] flex items-center"
			>
				Daily
			</a>
			<a
				href="{base}/check-in"
				class="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors text-center min-h-[44px] flex items-center justify-center"
			>
				+ Check In
			</a>
		</div>
	</div>

	<!-- Part filter chips -->
	{#if activeParts.length > 0}
		<div class="flex flex-wrap gap-2 mb-6">
			<button
				type="button"
				onclick={() => (filterPartId = undefined)}
				class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-all {!filterPartId ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'}"
			>
				All
			</button>
			{#each activeParts as part}
				<button
					type="button"
					onclick={() => (filterPartId = filterPartId === part.id ? undefined : part.id)}
					class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-all"
					style={filterPartId === part.id
						? `background-color: ${part.color ?? '#7c3aed'}18; color: ${part.color ?? '#7c3aed'}; border-color: ${part.color ?? '#7c3aed'}50;`
						: 'background: white; color: var(--color-stone-500); border-color: var(--color-stone-200);'}
				>
					<PartAvatar size="xs" color={part.color} name={part.name} />
					{part.name}
				</button>
			{/each}
		</div>
	{/if}

	{#if allSessions.length === 0}
		<div class="text-center py-20 text-stone-400">
			<div class="text-5xl mb-4">◈</div>
			<p class="text-lg font-serif italic text-stone-500">Your journal is empty</p>
			<p class="text-sm mt-2 mb-6">Start a check-in to record your first session</p>
			<a
				href="{base}/check-in"
				class="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-6 py-3 text-sm font-medium transition-colors inline-flex items-center"
			>
				Start a check-in
			</a>
		</div>
	{:else if filtered.length === 0}
		<p class="text-center text-stone-400 py-12 text-sm">No sessions for this part yet.</p>
	{:else}
		<div class="space-y-3">
			{#each filtered as session (session.id)}
				<SessionCard
					{session}
					linkedPart={session.linkedPartId ? dataStore.getPart(session.linkedPartId) : undefined}
				/>
			{/each}
		</div>
	{/if}
</main>
