<script lang="ts">
	interface Props {
		tags: string[];
		placeholder?: string;
		suggestions?: string[];
		pillMode?: boolean;
	}

	let { tags = $bindable([]), placeholder = 'Type and press Enter', suggestions = [], pillMode = false }: Props = $props();

	let input = $state('');
	let showSuggestions = $state(false);

	function addTag(value: string) {
		const trimmed = value.trim();
		if (trimmed && !tags.includes(trimmed)) {
			tags = [...tags, trimmed];
		}
		input = '';
		showSuggestions = false;
	}

	function removeTag(tag: string) {
		tags = tags.filter((t) => t !== tag);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTag(input);
		} else if (e.key === 'Backspace' && !input && tags.length > 0) {
			tags = tags.slice(0, -1);
		}
	}

	const filteredSuggestions = $derived(
		suggestions.filter(
			(s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
		)
	);
</script>

<div class="space-y-2">
	{#if pillMode && suggestions.length > 0}
		{@const unselected = suggestions.filter((s) => !tags.includes(s))}
		{#if unselected.length > 0}
			<div class="flex flex-wrap gap-2 mb-1">
				{#each unselected as s}
					<button
						type="button"
						onclick={() => addTag(s)}
						class="px-3 py-1.5 rounded-full text-sm border border-stone-200 bg-white text-stone-600 hover:border-primary-200 hover:text-primary-600 hover:bg-primary-50 transition-colors leading-none"
					>
						{s}
					</button>
				{/each}
			</div>
		{/if}
	{/if}

	{#if tags.length > 0}
		<div class="flex flex-wrap gap-2">
			{#each tags as tag}
				<span class="inline-flex items-center gap-1.5 bg-primary-50 text-primary-800 rounded-full px-3 py-1 text-sm">
					{tag}
					<button
						type="button"
						onclick={() => removeTag(tag)}
						class="text-primary-400 hover:text-primary-700 leading-none"
						aria-label="Remove {tag}"
					>
						×
					</button>
				</span>
			{/each}
		</div>
	{/if}

	<div class="relative">
		<input
			type="text"
			bind:value={input}
			onkeydown={handleKeydown}
			onfocus={() => (showSuggestions = true)}
			onblur={() => setTimeout(() => (showSuggestions = false), 150)}
			{placeholder}
			class="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-sm"
		/>

		{#if showSuggestions && filteredSuggestions.length > 0}
			<ul class="absolute z-10 mt-1 w-full bg-white border border-stone-200 rounded-lg shadow-md overflow-auto max-h-48">
				{#each filteredSuggestions as s}
					<li>
						<button
							type="button"
							class="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-primary-50 hover:text-primary-700"
							onmousedown={() => addTag(s)}
						>
							{s}
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
