<script lang="ts">
	import { base } from '$app/paths';
	import Nav from '$lib/components/Nav.svelte';
</script>

<svelte:head>
	<title>What is Internal Family Systems (IFS)? — My IFS</title>
	<meta name="description" content="Internal Family Systems (IFS) is a therapy model developed by Dr. Richard Schwartz. Learn about parts, Self, exiles, managers, and firefighters — and how IFS self-practice works." />
</svelte:head>

<Nav />

<main class="max-w-2xl mx-auto px-4 py-8 sm:py-12">

	<a href="{base}/parts" class="text-sm text-stone-400 hover:text-stone-600 transition-colors mb-8 inline-block">← My Parts</a>

	<h1 class="font-serif text-2xl sm:text-3xl text-stone-800 mb-2">What is Internal Family Systems?</h1>
	<p class="text-stone-400 text-sm mb-10">A brief introduction to the model this app is built around</p>

	<div class="prose-calm space-y-8">

		<section>
			<p class="text-stone-700 leading-relaxed">
				Internal Family Systems (IFS) is a therapeutic approach developed by Dr. Richard Schwartz in the 1980s. Its central insight is that the human mind naturally organizes itself into distinct sub-personalities — called <strong class="text-stone-800 font-medium">parts</strong> — each with their own feelings, beliefs, memories, and ways of seeing the world.
			</p>
			<p class="text-stone-700 leading-relaxed mt-4">
				This isn't metaphor. Parts are real functional aspects of how the mind works. You've likely already noticed them: the voice that criticizes you after a mistake, the part that shuts down when something gets too hard, the anxious part that loops at 2am, the one that just wants to give up. These are not character flaws — they are parts of you doing their best to keep you safe, often with strategies they formed a long time ago.
			</p>
		</section>

		<section>
			<h2 class="font-serif text-xl text-stone-700 mb-3">Self</h2>
			<p class="text-stone-700 leading-relaxed">
				Beneath all those parts, IFS says there is a core — called <strong class="text-stone-800 font-medium">Self</strong> — that is inherently calm, curious, and compassionate. Self is not a part; it is who you are at the center. When you feel genuinely curious about your own pain, or can hold compassion for a part of yourself that's acting out, that is Self.
			</p>
			<p class="text-stone-700 leading-relaxed mt-4">
				The goal of IFS practice isn't to eliminate difficult parts. It's to let Self lead — to build enough trust with your parts that they no longer have to run the show by themselves.
			</p>
			<div class="mt-5 rounded-xl bg-violet-50 border border-violet-100 px-5 py-4">
				<p class="text-xs font-semibold text-violet-500 uppercase tracking-wide mb-2">The 8 C's of Self</p>
				<p class="text-sm text-violet-800 leading-relaxed">When Self is leading, you tend to feel: <strong>Calm, Curious, Compassionate, Clear, Courageous, Confident, Creative, Connected.</strong> When a part takes over, these qualities fade and something more reactive appears.</p>
			</div>
		</section>

		<section>
			<h2 class="font-serif text-xl text-stone-700 mb-3">The three types of parts</h2>

			<div class="space-y-4">
				<div class="rounded-xl border border-stone-100 px-5 py-4 bg-stone-50">
					<p class="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Exiles</p>
					<p class="text-stone-700 text-sm leading-relaxed">Parts that carry pain, fear, shame, or grief — often from childhood experiences. The system tends to "lock them away" to keep their overwhelming feelings from flooding everyday life. Exiles hold burdens: the core beliefs of worthlessness, abandonment, or powerlessness that formed in difficult moments.</p>
				</div>

				<div class="rounded-xl border border-stone-100 px-5 py-4 bg-stone-50">
					<p class="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Managers</p>
					<p class="text-stone-700 text-sm leading-relaxed">Protective parts that work proactively to keep exile pain from surfacing. Managers tend to be the more "everyday" voices: the inner critic keeping you from making mistakes, the pleaser avoiding conflict, the achiever proving you're worthy, the worrier scanning for threats. Their positive intention is always protection.</p>
				</div>

				<div class="rounded-xl border border-stone-100 px-5 py-4 bg-stone-50">
					<p class="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Firefighters</p>
					<p class="text-stone-700 text-sm leading-relaxed">Reactive protectors that activate when exile pain breaks through despite the managers' best efforts. Firefighters prioritize stopping the pain by any means — numbing, distraction, rage, substance use, compulsive behavior. Like firefighters at an emergency, they don't worry about the mess they make.</p>
				</div>
			</div>
		</section>

		<section>
			<h2 class="font-serif text-xl text-stone-700 mb-3">Blending and unblending</h2>
			<p class="text-stone-700 leading-relaxed">
				When a part "takes over," you feel <strong class="text-stone-800 font-medium">blended</strong> with it — fully identified with its perspective, emotions flooding your experience with no sense of separation. You're not watching the anxiety; <em>you are</em> the anxiety.
			</p>
			<p class="text-stone-700 leading-relaxed mt-4">
				<strong class="text-stone-800 font-medium">Unblending</strong> is the practice of creating a little space between you and the part — not pushing it away, but stepping back enough that Self can be present too. A breath. A moment of noticing. Asking the part to give you just a little room. Even a few inches of separation makes IFS work possible.
			</p>
		</section>

		<section>
			<h2 class="font-serif text-xl text-stone-700 mb-3">Unburdening</h2>
			<p class="text-stone-700 leading-relaxed">
				Parts carry <strong class="text-stone-800 font-medium">burdens</strong> — beliefs and feelings that were forced on them during difficult experiences. "I'm worthless." "It's not safe to trust anyone." "I have to be perfect or something bad will happen." These aren't truths; they're wounds.
			</p>
			<p class="text-stone-700 leading-relaxed mt-4">
				Unburdening is the process of returning to the exile, witnessing its story, offering what it needed, and inviting it to release what it's been carrying. When an exile unburdens, it naturally transforms — offering its inherent gifts rather than its defensive coping. A firefighter that numbed becomes playful. An exile that felt worthless discovers its inherent preciousness.
			</p>
		</section>

		<section>
			<h2 class="font-serif text-xl text-stone-700 mb-3">How this app supports the practice</h2>
			<p class="text-stone-700 leading-relaxed">
				This app is a companion for self-led IFS practice. It won't replace a trained IFS therapist — especially for deep trauma work — but it can help you:
			</p>
			<ul class="mt-4 space-y-2 text-stone-600 text-sm">
				<li class="flex gap-2"><span class="text-stone-400 flex-shrink-0">→</span><span><strong class="text-stone-700">Identify parts</strong> — name, describe, and get to know each part of your inner system</span></li>
				<li class="flex gap-2"><span class="text-stone-400 flex-shrink-0">→</span><span><strong class="text-stone-700">Check in</strong> — in moments of activation, identify which part is present and what it needs</span></li>
				<li class="flex gap-2"><span class="text-stone-400 flex-shrink-0">→</span><span><strong class="text-stone-700">Go deeper</strong> — use guided protocols to work with protectors (6 F's) and exiles (unburdening)</span></li>
				<li class="flex gap-2"><span class="text-stone-400 flex-shrink-0">→</span><span><strong class="text-stone-700">See your system</strong> — visualize your inner family and how parts relate to each other</span></li>
				<li class="flex gap-2"><span class="text-stone-400 flex-shrink-0">→</span><span><strong class="text-stone-700">Track your journey</strong> — a session journal records your IFS work over time</span></li>
			</ul>
		</section>

		<section>
			<h2 class="font-serif text-xl text-stone-700 mb-3">Going further</h2>
			<p class="text-stone-700 leading-relaxed text-sm">
				The best introduction to IFS is Richard Schwartz's book <em>No Bad Parts</em> (2021). For professional support, the IFS Institute directory at <span class="text-stone-500">ifs-institute.com</span> lists certified therapists worldwide.
			</p>
		</section>

		<div class="pt-4 border-t border-stone-100 flex justify-center">
			<a href="{base}/parts/new" class="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-6 py-3 text-sm font-medium transition-colors">
				Start getting to know a part →
			</a>
		</div>

	</div>
</main>

<style>
	.prose-calm {
		font-size: 0.95rem;
	}
</style>
