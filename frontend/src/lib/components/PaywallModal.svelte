<script lang="ts">
	import { accessStore } from '$lib/data/access.svelte';

	const STRIPE_URL = import.meta.env.VITE_STRIPE_PAYMENT_LINK ?? '';

	let {
		onClose,
		onUnlocked
	}: {
		onClose?: () => void;
		onUnlocked?: () => void;
	} = $props();

	let showCode = $state(false);
	let code = $state('');
	let codeError = $state('');
	let codeLoading = $state(false);

	async function submitCode() {
		if (!code.trim() || codeLoading) return;
		codeLoading = true;
		codeError = '';
		const ok = await accessStore.unlockWithCode(code);
		codeLoading = false;
		if (ok) {
			onUnlocked?.();
		} else {
			codeError = "That code isn't valid — double-check with your friend.";
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') submitCode();
		if (e.key === 'Escape') onClose?.();
	}
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center p-4"
	role="dialog"
	aria-modal="true"
>
	<button
		class="absolute inset-0 bg-stone-900/30 backdrop-blur-sm"
		onclick={() => onClose?.()}
		aria-label="Close"
	></button>

	<div class="relative bg-canvas rounded-3xl shadow-float border border-stone-100 w-full max-w-sm p-8 flex flex-col items-center text-center">
		<button
			onclick={() => onClose?.()}
			class="absolute top-4 right-4 text-stone-300 hover:text-stone-500 transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center"
			aria-label="Close"
		>×</button>

		<div class="flex items-end justify-center gap-1.5 mb-6">
			<div class="w-3 h-3 rounded-full bg-exile-700 opacity-80"></div>
			<div class="w-4 h-4 rounded-full bg-primary-600 mb-0.5"></div>
			<div class="w-3 h-3 rounded-full bg-manager-700 opacity-80"></div>
		</div>

		<h2 class="font-serif text-xl text-stone-800 leading-snug mb-2">
			You've met your 5 free parts
		</h2>
		<p class="text-stone-500 text-sm leading-relaxed mb-7">
			Unlock My IFS to add unlimited parts, sessions, and check-ins — and keep building your inner map.
		</p>

		{#if STRIPE_URL}
			<a
				href={STRIPE_URL}
				class="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-6 py-3.5 text-sm font-medium transition-colors text-center"
			>
				Unlock Full Access
			</a>
		{:else}
			<div class="w-full bg-stone-100 text-stone-400 rounded-xl px-6 py-3.5 text-sm text-center">
				Payment coming soon
			</div>
		{/if}

		<div class="w-full mt-6">
			{#if !showCode}
				<button
					onclick={() => (showCode = true)}
					class="text-xs text-stone-400 hover:text-primary-600 transition-colors underline"
				>
					Have a friend code?
				</button>
			{:else}
				<div class="space-y-2">
					<div class="flex gap-2">
						<input
							type="text"
							bind:value={code}
							onkeydown={handleKeydown}
							placeholder="Enter your code"
							class="flex-1 rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
						/>
						<button
							onclick={submitCode}
							disabled={codeLoading || !code.trim()}
							class="bg-primary-600 hover:bg-primary-700 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
						>
							{codeLoading ? '…' : 'Unlock'}
						</button>
					</div>
					{#if codeError}
						<p class="text-xs text-red-500 text-left">{codeError}</p>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
