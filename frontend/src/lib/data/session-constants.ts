export const EIGHT_CS = [
	'Calm',
	'Curious',
	'Compassionate',
	'Clear',
	'Courageous',
	'Confident',
	'Creative',
	'Connected'
] as const;

export type EightC = (typeof EIGHT_CS)[number];

export const SELF_ENERGY_LABELS: Record<number, string> = {
	0: 'A part is leading',
	1: 'A part is leading',
	2: 'A part is leading',
	3: 'Some Self-energy',
	4: 'Some Self-energy',
	5: 'Growing Self-energy',
	6: 'Strongly Self-led',
	7: 'Strongly Self-led',
	8: 'Deeply Self-led'
};

export const BURDEN_ELEMENTS = [
	{ id: 'light', label: 'Light', emoji: '☀️' },
	{ id: 'wind', label: 'Wind', emoji: '🌬️' },
	{ id: 'water', label: 'Water', emoji: '💧' },
	{ id: 'fire', label: 'Fire', emoji: '🔥' },
	{ id: 'earth', label: 'Earth', emoji: '🌱' }
] as const;

export const BLENDED_FEELINGS = [
	'Scared of it',
	'Annoyed by it',
	'Overwhelmed by it',
	'Frustrated with it',
	'Merged with it'
] as const;

export const SELF_LED_FEELINGS = [
	'Curious',
	'Compassionate',
	'Calm',
	'Open',
	'Accepting',
	'Interested'
] as const;

export const MOOD_EMOJIS: Record<number, string> = {
	1: '😔',
	2: '😕',
	3: '😐',
	4: '🙂',
	5: '😌'
};

export const SESSION_TYPE_LABELS = {
	'check-in': 'Check-In',
	daily: 'Daily Check-In',
	session: 'Deep Session'
} as const;

export const PROTOCOL_LABELS = {
	free: 'Free Exploration',
	'6fs': 'Meet a Protector',
	unburdening: 'Healing an Exile'
} as const;
