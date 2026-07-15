<script lang="ts">
	let { onUpgrade }: { onUpgrade: () => void } = $props();
</script>

<div class="rounded-2xl border border-primary-100 bg-primary-50 p-5 flex flex-col items-start gap-3">
	<div class="flex items-center gap-2">
		<div class="flex items-end gap-1">
			<div class="w-2 h-2 rounded-full bg-exile-700 opacity-70"></div>
			<div class="w-2.5 h-2.5 rounded-full bg-primary-600"></div>
			<div class="w-2 h-2 rounded-full bg-manager-700 opacity-70"></div>
		</div>
		<span class="text-xs font-medium text-primary-700 uppercase tracking-widest">Free tier</span>
	</div>
	<p class="text-sm text-stone-600 leading-relaxed">
		You've identified your 5 free parts. Unlock My IFS to add more and continue your inner work.
	</p>
	<button
		onclick={onUpgrade}
		class="text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
	>
		Unlock full access →
	</button>
</div>
