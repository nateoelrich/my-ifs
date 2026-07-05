import type { PartRoleType } from './types';

export const DEFAULT_PART_COLOR = '#9E968E';

export const PART_SWATCHES = [
	{ hex: '#D4A5A5', label: 'Dusty rose' },
	{ hex: '#E08B6E', label: 'Coral' },
	{ hex: '#E8C456', label: 'Amber' },
	{ hex: '#8CBD9A', label: 'Sage' },
	{ hex: '#4EC9B8', label: 'Teal' },
	{ hex: '#6DB5E0', label: 'Sky' },
	{ hex: '#7B8EC8', label: 'Indigo' },
	{ hex: '#A08DC0', label: 'Violet' },
	{ hex: '#8A9BB0', label: 'Slate' },
	{ hex: '#9E968E', label: 'Warm gray' },
	{ hex: '#3D8A72', label: 'Spruce' },
	{ hex: '#7BA7C2', label: 'Dusty blue' }
] as const;

export const EMOTION_SUGGESTIONS = [
	'fear', 'anger', 'sadness', 'shame', 'grief', 'anxiety', 'loneliness',
	'worthlessness', 'guilt', 'hopelessness', 'despair', 'rage', 'hurt',
	'embarrassment', 'jealousy', 'panic', 'numbness'
];

export const BELIEF_SUGGESTIONS = [
	"I'm not good enough", "I'll be rejected", "I'll be humiliated",
	"I'm worthless", "Nobody cares", "I have to be perfect",
	"It's my fault", "I'm a burden", "I'll fail", "I'm broken"
];

export const TRIGGER_SUGGESTIONS = [
	'criticism', 'rejection', 'conflict', 'being ignored', 'failure',
	'being controlled', 'uncertainty', 'vulnerability', 'confrontation',
	'being rushed', 'being evaluated', 'feeling unseen', 'abandonment', 'unpredictability'
];

export const FEAR_SUGGESTIONS = [
	'being rejected', 'being humiliated', 'losing control', 'being abandoned',
	'making mistakes', 'being exposed', 'not being enough', 'being hurt again'
];

export interface RoleConfig {
	value: PartRoleType | 'unknown';
	label: string;
	badgeClass: string;     // small role badge: bg-X-100 text-X-700
	// wizard card extras
	icon: string;
	metaphor: string;
	colorClass: string;     // wizard chip: bg-X-100 text-X-700 border-X-200
	selectedClass: string;  // wizard card selection: border-X-200 bg-X-50
	description: string;
}

export const ROLE_CONFIGS: RoleConfig[] = [
	{
		value: 'exile',
		label: 'Exile',
		badgeClass: 'bg-exile-100 text-exile-700',
		icon: '◎',
		metaphor: 'Tender & hidden',
		colorClass: 'bg-exile-100 text-exile-700 border-exile-200',
		selectedClass: 'border-exile-200 bg-exile-50',
		description: "Carries pain, shame, or trauma from the past. Often feels young and vulnerable, tucked away where others won't find it."
	},
	{
		value: 'manager',
		label: 'Manager',
		badgeClass: 'bg-manager-100 text-manager-700',
		icon: '⊞',
		metaphor: 'Planning & controlling',
		colorClass: 'bg-manager-100 text-manager-700 border-manager-200',
		selectedClass: 'border-manager-200 bg-manager-50',
		description: 'Works proactively to prevent exile pain from surfacing. Tends to plan, control, criticize, achieve, and keep everything in order.'
	},
	{
		value: 'firefighter',
		label: 'Firefighter',
		badgeClass: 'bg-firefighter-100 text-firefighter-700',
		icon: '◈',
		metaphor: 'Reactive & urgent',
		colorClass: 'bg-firefighter-100 text-firefighter-700 border-firefighter-200',
		selectedClass: 'border-firefighter-200 bg-firefighter-50',
		description: 'Reacts when exile pain breaks through the managers. Uses impulsive, intense behaviors to extinguish overwhelming emotion — fast.'
	},
	{
		value: 'unknown',
		label: 'Not sure yet',
		badgeClass: 'bg-stone-100 text-stone-600',
		icon: '○',
		metaphor: 'Still discovering',
		colorClass: 'bg-stone-100 text-stone-600 border-stone-200',
		selectedClass: 'border-stone-200 bg-stone-50',
		description: "It's okay not to know. This is just a starting point — you can always revisit as your understanding deepens."
	}
];

// Lookup maps derived from ROLE_CONFIGS — single source of truth
export const ROLE_BADGE_MAP: Record<string, string> = Object.fromEntries(
	ROLE_CONFIGS.map((r) => [r.value, r.badgeClass])
);

export const ROLE_LABEL_MAP: Record<string, string> = Object.fromEntries(
	ROLE_CONFIGS.map((r) => [r.value, r.label])
);
