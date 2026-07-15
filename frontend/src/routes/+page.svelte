<script lang="ts">
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>My IFS — Map Your Inner Family System</title>
	<meta name="description" content="My IFS is a guided self-practice tool for Internal Family Systems therapy. Identify your parts, log sessions, and build a map of your inner world — privately, at your own pace." />
</svelte:head>

<main class="min-h-screen bg-canvas">

	<!-- Hero -->
	<section class="max-w-2xl mx-auto px-6 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
		<div class="flex items-end justify-center gap-1.5 mb-8">
			<div class="w-3 h-3 rounded-full bg-exile-700 opacity-80"></div>
			<div class="w-4 h-4 rounded-full bg-primary-600 mb-0.5"></div>
			<div class="w-3 h-3 rounded-full bg-manager-700 opacity-80"></div>
		</div>
		<h1 class="font-serif text-3xl sm:text-4xl text-stone-800 leading-snug mb-4">
			Get to know your inner family
		</h1>
		<p class="text-stone-500 text-base sm:text-lg leading-relaxed max-w-lg mx-auto mb-8">
			My IFS is a private, guided companion for Internal Family Systems self-practice — helping you identify your parts, track your inner work, and build a map of your system over time.
		</p>
		<div class="flex flex-col sm:flex-row items-center justify-center gap-3">
			<a
				href="{base}/parts/new"
				class="bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-7 py-3.5 text-sm font-medium transition-colors"
			>
				Identify your first part →
			</a>
			<a
				href="{base}/about"
				class="text-sm text-stone-400 hover:text-stone-600 transition-colors py-3.5"
			>
				What is IFS?
			</a>
		</div>
	</section>

	<!-- Part types -->
	<section class="max-w-2xl mx-auto px-6 pb-12 sm:pb-16">
		<p class="text-xs font-semibold text-stone-400 uppercase tracking-widest text-center mb-6">The three kinds of parts</p>
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<div class="rounded-2xl border border-exile-100 bg-exile-50 p-5">
				<p class="text-xs font-semibold text-exile-700 uppercase tracking-wide mb-2">Exiles</p>
				<p class="text-sm text-stone-600 leading-relaxed">Parts carrying pain, shame, or fear — often from early experiences. They hold the wounds your system works to protect.</p>
			</div>
			<div class="rounded-2xl border border-manager-100 bg-manager-50 p-5">
				<p class="text-xs font-semibold text-manager-700 uppercase tracking-wide mb-2">Managers</p>
				<p class="text-sm text-stone-600 leading-relaxed">Proactive protectors — the inner critic, the worrier, the perfectionist — working hard to keep exile pain from surfacing.</p>
			</div>
			<div class="rounded-2xl border border-stone-200 bg-stone-50 p-5">
				<p class="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Firefighters</p>
				<p class="text-sm text-stone-600 leading-relaxed">Reactive protectors that kick in when pain breaks through — numbing, distracting, or acting out to stop the flood.</p>
			</div>
		</div>
	</section>

	<!-- How it works -->
	<section class="max-w-2xl mx-auto px-6 pb-16 sm:pb-24">
		<p class="text-xs font-semibold text-stone-400 uppercase tracking-widest text-center mb-8">How the app works</p>
		<div class="space-y-5">
			{#each [
				{ n: '1', title: 'Identify a part', body: 'A guided 11-step wizard walks you through getting to know a part — its name, feelings, beliefs, origin, and what it needs from Self.' },
				{ n: '2', title: 'Check in daily', body: 'When a part activates, log a quick check-in: which part is present, how blended you are, and what helped.' },
				{ n: '3', title: 'Log your sessions', body: 'Record your IFS sessions — what came up, what shifted, and what you want to return to.' },
				{ n: '4', title: 'See your system', body: 'Your parts map builds over time, showing relationships and patterns across your inner family.' },
			] as step}
				<div class="flex gap-4 items-start">
					<div class="w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">{step.n}</div>
					<div>
						<p class="text-sm font-medium text-stone-700 mb-0.5">{step.title}</p>
						<p class="text-sm text-stone-500 leading-relaxed">{step.body}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- CTA footer -->
	<section class="border-t border-stone-100 bg-primary-50">
		<div class="max-w-2xl mx-auto px-6 py-12 text-center">
			<p class="font-serif text-xl text-stone-700 mb-2">Your inner work, your private space</p>
			<p class="text-stone-500 text-sm mb-6">No account required. Your data stays in your browser. Start free — identify up to 5 parts before unlocking full access.</p>
			<a
				href="{base}/parts/new"
				class="inline-block bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-7 py-3.5 text-sm font-medium transition-colors"
			>
				Start for free →
			</a>
			<p class="text-xs text-stone-400 mt-4">
				Already using My IFS? <a href="{base}/parts" class="text-primary-500 hover:text-primary-700 transition-colors">Go to your parts →</a>
			</p>
		</div>
	</section>

</main>
