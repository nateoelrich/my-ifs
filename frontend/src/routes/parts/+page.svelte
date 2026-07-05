<script lang="ts">
	import { dataStore } from '$lib/data/workspace.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import PartAvatar from '$lib/components/PartAvatar.svelte';

	let importInput = $state<HTMLInputElement | undefined>(undefined);
	let deleteError = $state('');

	const roleColors: Record<string, string> = {
		exile: 'bg-exile-100 text-exile-700',
		manager: 'bg-manager-100 text-manager-700',
		firefighter: 'bg-firefighter-100 text-firefighter-700',
		unknown: 'bg-stone-100 text-stone-600'
	};

	const roleLabels: Record<string, string> = {
		exile: 'Exile',
		manager: 'Manager',
		firefighter: 'Firefighter',
		unknown: 'Unknown'
	};

	function handleDelete(id: string, name: string) {
		if (!confirm(`Remove "${name}"? This cannot be undone.`)) return;
		try {
			dataStore.deletePart(id);
		} catch {
			deleteError = 'Failed to delete part.';
		}
	}

	function handleImportFile(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => {
			try {
				dataStore.importJSON(ev.target?.result as string);
			} catch {
				deleteError = 'Could not import — the file may be invalid.';
			}
		};
		reader.readAsText(file);
		(e.target as HTMLInputElement).value = '';
	}
</script>

<Nav />

<main class="max-w-4xl mx-auto px-4 py-6 sm:py-8">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
		<div>
			<h1 class="text-xl sm:text-2xl font-serif text-stone-700">Your Parts</h1>
			<p class="text-stone-500 text-sm mt-1">Inner voices, emotions, and protectors you've come to know</p>
		</div>
		<a
			href="/parts/new"
			class="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-3 text-sm font-medium transition-colors text-center min-h-[44px] flex items-center justify-center"
		>
			+ Identify a Part
		</a>
	</div>

	{#if deleteError}
		<div class="bg-red-50 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">{deleteError}</div>
	{/if}

	{#if dataStore.parts.length === 0}
		<div class="text-center py-20 text-stone-400">
			<div class="text-5xl mb-4">🌱</div>
			<p class="text-lg font-serif italic text-stone-500">Your inner family is waiting to be known</p>
			<p class="text-sm mt-2 mb-6">Begin by getting to know one of your inner voices</p>
			<div class="flex flex-col sm:flex-row items-center justify-center gap-3">
				<a
					href="/parts/new"
					class="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-6 py-3 text-sm font-medium transition-colors min-h-[44px] flex items-center"
				>
					Identify your first part
				</a>
				<span class="text-stone-300 hidden sm:block">or</span>
				<div>
					<input
						bind:this={importInput}
						type="file"
						accept=".json,application/json"
						onchange={handleImportFile}
						class="sr-only"
					/>
					<button
						onclick={() => importInput?.click()}
						class="text-sm text-stone-400 hover:text-stone-600 underline transition-colors min-h-[44px] flex items-center"
					>
						restore from backup
					</button>
				</div>
			</div>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each dataStore.parts as part (part.id)}
				<a
					href="/parts/{part.id}"
					class="group relative bg-white rounded-2xl border border-stone-100 hover:border-stone-200 hover:shadow-card transition-all overflow-hidden"
					style="background-color: {part.color ? part.color + '0D' : 'transparent'}"
				>
					<div class="p-5">
						<div class="flex items-center gap-3 mb-3">
							<PartAvatar size="sm" color={part.color} name={part.name} />
							<h2 class="font-medium text-stone-800 group-hover:text-primary-600 transition-colors leading-tight flex-1 min-w-0 truncate">
								{part.name}
							</h2>
							<button
								type="button"
								onclick={(e) => { e.preventDefault(); handleDelete(part.id, part.name); }}
								class="relative text-stone-300 hover:text-red-400 transition-colors text-lg leading-none opacity-100 sm:opacity-0 sm:group-hover:opacity-100 flex-shrink-0 p-1"
								aria-label="Delete {part.name}"
							>
								×
							</button>
						</div>

						{#if part.nickname}
							<p class="text-stone-400 text-xs mb-3 italic">"{part.nickname}"</p>
						{/if}

						{#if part.bodyLocation}
							<p class="text-stone-400 text-xs mb-3">
								Felt in: <span class="text-stone-500">{part.bodyLocation}</span>
							</p>
						{/if}

						<div class="flex items-center justify-between">
							{#if part.roleType}
								<span class="text-xs font-medium px-2.5 py-1 rounded-full {roleColors[part.roleType] ?? roleColors.unknown}">
									{roleLabels[part.roleType] ?? part.roleType}
								</span>
							{:else}
								<span></span>
							{/if}
							<span class="text-xs text-stone-300">
								{new Date(part.createdAt).toLocaleDateString()}
							</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</main>
