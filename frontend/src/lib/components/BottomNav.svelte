<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';

	const tabs = [
		{ href: '/parts', label: 'Parts', icon: 'parts' },
		{ href: '/check-in', label: 'Check In', icon: 'check-in', primary: true },
		{ href: '/map', label: 'Map', icon: 'map' },
		{ href: '/sessions', label: 'Journal', icon: 'journal' }
	];

	function isActive(path: string): boolean {
		return $page.url.pathname.startsWith(`${base}${path}`);
	}
</script>

<nav class="bottom-nav md:hidden" aria-label="Main navigation">
	{#each tabs as tab}
		{@const active = isActive(tab.href)}
		<a
			href="{base}{tab.href}"
			class="bottom-tab"
			class:active
			class:primary={tab.primary}
			aria-current={active ? 'page' : undefined}
		>
			<span class="tab-icon" aria-hidden="true">
				{#if tab.icon === 'parts'}
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
						<circle cx="12" cy="8" r="3.5" /><circle cx="6" cy="17" r="2.5" /><circle cx="18" cy="17" r="2.5" />
						<line x1="12" y1="11.5" x2="6" y2="14.5" /><line x1="12" y1="11.5" x2="18" y2="14.5" />
					</svg>
				{:else if tab.icon === 'check-in'}
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
						<circle cx="12" cy="12" r="9" />
						<circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" />
					</svg>
				{:else if tab.icon === 'map'}
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
						<polygon points="3,6 8,3 16,6 21,3 21,18 16,21 8,18 3,21" />
						<line x1="8" y1="3" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="21" />
					</svg>
				{:else if tab.icon === 'journal'}
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
						<rect x="4" y="3" width="16" height="18" rx="2" />
						<line x1="8" y1="8" x2="16" y2="8" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="8" y1="16" x2="12" y2="16" />
					</svg>
				{/if}
			</span>
			<span class="tab-label">{tab.label}</span>
		</a>
	{/each}
</nav>

<style>
	.bottom-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 40;
		display: flex;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-top: 1px solid var(--color-stone-100, #f5f5f4);
		padding-bottom: env(safe-area-inset-bottom, 0);
	}

	.bottom-tab {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		padding: 10px 4px 8px;
		color: var(--color-stone-400, #a8a29e);
		text-decoration: none;
		transition: color 0.15s;
		min-height: 56px;
		position: relative;
	}

	.bottom-tab.active {
		color: var(--color-primary-600, #7c3aed);
	}

	.bottom-tab.primary {
		color: var(--color-primary-600, #7c3aed);
	}

	.bottom-tab.primary .tab-icon {
		background: var(--color-primary-600, #7c3aed);
		color: white;
		border-radius: 999px;
		padding: 6px;
		margin-top: -4px;
	}

	.bottom-tab.primary.active .tab-icon {
		background: var(--color-primary-700, #6d28d9);
	}

	.tab-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.15s;
	}

	.tab-label {
		font-size: 10px;
		font-weight: 500;
		letter-spacing: 0.02em;
	}
</style>
