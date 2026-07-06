<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { dataStore } from '$lib/data/workspace.svelte';
	import { t } from '$lib/i18n.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import type { Part } from '$lib/data/types';

	const W = 620;
	const H = 520;
	const CX = W / 2;
	const CY = H / 2;
	const SELF_R = 44;

	interface Node {
		part: Part;
		x: number;
		y: number;
		r: number;
	}

	const nodes = $derived(computeLayout(dataStore.parts));

	function computeLayout(parts: Part[]): Node[] {
		if (parts.length === 0) return [];

		const exiles     = parts.filter((p) => p.roleType === 'exile');
		const managers   = parts.filter((p) => p.roleType === 'manager');
		const fighters   = parts.filter((p) => p.roleType === 'firefighter');
		const unknowns   = parts.filter((p) => !p.roleType || p.roleType === 'unknown');

		const result: Node[] = [];

		function placeArc(group: Part[], r: number, startAngle: number, endAngle: number, nodeR: number) {
			if (group.length === 0) return;
			const step = group.length === 1 ? 0 : (endAngle - startAngle) / (group.length - 1);
			group.forEach((part, i) => {
				const angle = startAngle + i * step;
				result.push({
					part,
					x: CX + r * Math.cos(angle),
					y: CY + r * Math.sin(angle),
					r: nodeR
				});
			});
		}

		placeArc(exiles, 115, Math.PI * 0.55, Math.PI * 0.95, 26);
		placeArc(managers, 190, Math.PI * 1.1, Math.PI * 1.8, 30);
		placeArc(fighters, 190, Math.PI * -0.7, Math.PI * 0.1, 30);
		placeArc(unknowns, 210, Math.PI * 1.85, Math.PI * 2.5, 26);

		return result;
	}

	const arcs = $derived(
		nodes.flatMap((n) => {
			if (!n.part.protectsPartId) return [];
			const target = nodes.find((t) => t.part.id === n.part.protectsPartId);
			if (!target) return [];
			return [{ from: n, to: target }];
		})
	);

	function arcPath(from: Node, to: Node): string {
		const mx = (from.x + to.x) / 2;
		const my = (from.y + to.y) / 2 - 30;
		return `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;
	}

	let hoveredId = $state<string | undefined>(undefined);
</script>

<Nav />

<main class="max-w-3xl mx-auto px-4 py-6 sm:py-8">
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-xl sm:text-2xl font-serif text-stone-700">{t('map.title')}</h1>
			<p class="text-stone-500 text-sm mt-1">{t('map.subtitle')}</p>
		</div>
		<a
			href="{base}/parts/new"
			class="text-sm text-stone-500 hover:text-primary-700 border border-stone-200 hover:border-primary-300 rounded-lg px-4 py-2.5 transition-colors"
		>
			{t('map.addPart')}
		</a>
	</div>

	{#if dataStore.parts.length === 0}
		<div class="text-center py-20 text-stone-400">
			<div class="text-5xl mb-4">⊞</div>
			<p class="text-lg font-serif italic text-stone-500">{t('map.empty.tagline')}</p>
			<p class="text-sm mt-2 mb-6">{t('map.empty.start')}</p>
			<a href="{base}/parts/new" class="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-6 py-3 text-sm font-medium transition-colors inline-flex items-center">
				{t('map.empty.cta')}
			</a>
		</div>
	{:else}
		<div class="rounded-2xl border border-stone-100 bg-stone-50 overflow-hidden">
			<svg
				viewBox="0 0 {W} {H}"
				class="w-full"
				style="max-height: 70vh;"
				role="img"
				aria-label={t('map.ariaLabel')}
			>
				<circle cx={CX} cy={CY} r={130} fill="none" stroke="#e7e5e4" stroke-width="1" stroke-dasharray="4 6" opacity="0.5" />
				<circle cx={CX} cy={CY} r={200} fill="none" stroke="#e7e5e4" stroke-width="1" stroke-dasharray="4 8" opacity="0.3" />

				{#each arcs as arc}
					<path
						d={arcPath(arc.from, arc.to)}
						fill="none"
						stroke={arc.from.part.color ?? '#9E968E'}
						stroke-width="1.5"
						stroke-dasharray="5 4"
						opacity="0.35"
					/>
				{/each}

				{#each nodes as node}
					{@const isHovered = hoveredId === node.part.id}
					<g
						style="cursor: pointer;"
						role="button"
						tabindex="0"
						aria-label={t('map.partAriaLabel', { name: node.part.name })}
						onmouseenter={() => (hoveredId = node.part.id)}
						onmouseleave={() => (hoveredId = undefined)}
						onclick={() => goto(`${base}/parts/${node.part.id}`)}
						onkeydown={(e) => e.key === 'Enter' && goto(`${base}/parts/${node.part.id}`)}
					>
						{#if isHovered}
							<circle
								cx={node.x}
								cy={node.y}
								r={node.r + 6}
								fill="{node.part.color ?? '#9E968E'}28"
							/>
						{/if}

						<circle
							cx={node.x}
							cy={node.y}
							r={node.r}
							fill={node.part.color ?? '#9E968E'}
							opacity={node.part.roleType === 'exile' ? 0.7 : 1}
						/>

						{#if node.part.hasUnburdened}
							<circle
								cx={node.x + node.r * 0.65}
								cy={node.y - node.r * 0.65}
								r="7"
								fill="white"
							/>
							<text x={node.x + node.r * 0.65} y={node.y - node.r * 0.65 + 4} text-anchor="middle" font-size="9">✦</text>
						{/if}

						<text
							x={node.x}
							y={node.y + 1}
							text-anchor="middle"
							dominant-baseline="middle"
							fill="white"
							font-size={node.r > 28 ? '14' : '11'}
							font-family="serif"
							font-weight="500"
							opacity="0.95"
						>
							{node.part.name.charAt(0).toUpperCase()}
						</text>

						<text
							x={node.x}
							y={node.y + node.r + 14}
							text-anchor="middle"
							fill={isHovered ? (node.part.color ?? '#44403c') : '#78716c'}
							font-size="11"
							font-family="system-ui, sans-serif"
							font-weight={isHovered ? '600' : '400'}
						>
							{node.part.name.length > 14 ? node.part.name.slice(0, 12) + '…' : node.part.name}
						</text>
					</g>
				{/each}

				<circle cx={CX} cy={CY} r={SELF_R} fill="#7c3aed" />
				<circle cx={CX} cy={CY} r={SELF_R - 4} fill="none" stroke="white" stroke-width="1.5" opacity="0.4" />
				<text
					x={CX}
					y={CY + 1}
					text-anchor="middle"
					dominant-baseline="middle"
					fill="white"
					font-size="14"
					font-family="serif"
					font-style="italic"
				>Self</text>
			</svg>
		</div>

		<div class="mt-4 flex flex-wrap gap-4 text-xs text-stone-400 justify-center">
			<span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-stone-400 inline-block opacity-70"></span>{t('map.legend.exiles')}</span>
			<span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-stone-500 inline-block"></span>{t('map.legend.managers')}</span>
			<span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-stone-500 inline-block"></span>{t('map.legend.firefighters')}</span>
			<span class="flex items-center gap-1.5"><span class="text-[10px]">✦</span> {t('map.legend.unburdened')}</span>
		</div>
	{/if}
</main>
