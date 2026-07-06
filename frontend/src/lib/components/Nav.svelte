<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { dataStore } from '$lib/data/workspace.svelte';
	import { t } from '$lib/i18n.svelte';
	import LocaleSwitcher from './LocaleSwitcher.svelte';

	let importInput: HTMLInputElement;

	function handleExport() {
		const json = dataStore.exportJSON();
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'my-ifs.json';
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleImportFile(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => {
			try {
				dataStore.importJSON(ev.target?.result as string);
			} catch {
				alert(t('common.failedToImportCorrupted'));
			}
		};
		reader.readAsText(file);
		(e.target as HTMLInputElement).value = '';
	}
</script>

<nav class="sticky top-0 z-10 bg-canvas/90 backdrop-blur-sm border-b border-stone-100/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
	<a href="{base}/parts" class="text-lg font-serif text-stone-700 tracking-wide hover:text-primary-600 transition-colors">
		{t('nav.brand')}
	</a>

	<!-- Desktop nav links (hidden on mobile — BottomNav handles it) -->
	<div class="hidden md:flex items-center gap-1">
		{#each [
			{ href: '/parts', labelKey: 'nav.parts' },
			{ href: '/check-in', labelKey: 'nav.checkIn' },
			{ href: '/map', labelKey: 'nav.map' },
			{ href: '/sessions', labelKey: 'nav.journal' }
		] as tab}
			{@const active = page.url.pathname.startsWith(`${base}${tab.href}`)}
			<a
				href="{base}{tab.href}"
				class="text-sm px-3 py-1.5 rounded-lg transition-colors {active ? 'text-primary-700 bg-primary-50 font-medium' : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'}"
				aria-current={active ? 'page' : undefined}
			>
				{t(tab.labelKey)}
			</a>
		{/each}
	</div>

	<div class="flex items-center gap-1 sm:gap-2">
		<a
			href="{base}/about"
			class="text-xs text-stone-400 hover:text-stone-700 transition-colors min-h-[44px] hidden sm:flex items-center px-2"
			title={t('nav.whatIsIfs')}
		>
			{t('nav.whatIsIfs')}
		</a>
		<LocaleSwitcher />
		<input
			bind:this={importInput}
			type="file"
			accept=".json,application/json"
			onchange={handleImportFile}
			class="sr-only"
			aria-label={t('nav.import')}
		/>
		<button
			onclick={() => importInput.click()}
			class="text-xs text-stone-400 hover:text-stone-700 transition-colors min-h-[44px] flex items-center px-2"
			title={t('nav.import')}
		>
			{t('nav.import')}
		</button>
		<button
			onclick={handleExport}
			class="text-xs text-stone-400 hover:text-stone-700 transition-colors min-h-[44px] flex items-center px-2"
			title={t('nav.export')}
		>
			{t('nav.export')}
		</button>
	</div>
</nav>
