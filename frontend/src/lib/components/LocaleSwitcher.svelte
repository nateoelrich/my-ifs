<script lang="ts">
	import { getLocale, setLocale, t, type Locale } from '$lib/i18n.svelte';

	const locales: { code: Locale; label: string }[] = [
		{ code: 'en', label: 'EN' },
		{ code: 'es', label: 'ES' },
		{ code: 'pt', label: 'PT' }
	];

	const current = $derived(getLocale());
</script>

<div class="flex items-center gap-0.5" role="group" aria-label={t('nav.languageLabel')}>
	{#each locales as locale}
		<button
			type="button"
			onclick={() => setLocale(locale.code)}
			class="text-xs px-2 py-1 rounded min-h-[44px] flex items-center transition-colors"
			class:font-medium={current === locale.code}
			class:text-stone-700={current === locale.code}
			class:bg-stone-100={current === locale.code}
			class:text-stone-400={current !== locale.code}
			aria-pressed={current === locale.code}
		>
			{locale.label}
		</button>
	{/each}
</div>
