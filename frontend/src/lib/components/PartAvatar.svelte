<script lang="ts">
	interface Props {
		color?: string;
		name: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	}

	let { color = '#9E968E', name, size = 'md' }: Props = $props();

	const sizeMap = {
		xs:  { outer: 'w-5 h-5',    text: 'text-[10px]' },
		sm:  { outer: 'w-10 h-10',  text: 'text-sm'     },
		md:  { outer: 'w-16 h-16',  text: 'text-xl'     },
		lg:  { outer: 'w-12 h-12',  text: 'text-lg'     },
		xl:  { outer: 'w-32 h-32',  text: 'text-4xl'    },
	};

	const s = $derived(sizeMap[size]);
	const initial = $derived(name.trim().charAt(0).toUpperCase() || '?');
</script>

<div
	class="rounded-full overflow-hidden flex-shrink-0 {s.outer}"
	aria-label="{name} avatar"
>
	<div
		class="w-full h-full flex items-center justify-center font-serif font-medium text-white select-none"
		style="background-color: {color}"
	>
		<span class="{s.text}">{initial}</span>
	</div>
</div>
