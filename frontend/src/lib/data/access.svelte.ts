import { browser } from '$app/environment';

export const FREE_PARTS_LIMIT = 2;

const ACCESS_STORAGE_KEY = 'ifs-access';
const UNLOCK_KEY = import.meta.env.VITE_UNLOCK_KEY ?? '';
const FRIEND_CODE_HASHES = (import.meta.env.VITE_FRIEND_CODE_HASHES ?? '')
	.split(',')
	.map((h: string) => h.trim())
	.filter(Boolean);

async function sha256(text: string): Promise<string> {
	const data = new TextEncoder().encode(text);
	const buf = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(buf))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

function createAccessStore() {
	let unlocked = $state<boolean>(
		browser ? localStorage.getItem(ACCESS_STORAGE_KEY) === 'true' : false
	);

	function setUnlocked() {
		if (browser) localStorage.setItem(ACCESS_STORAGE_KEY, 'true');
		unlocked = true;
	}

	return {
		get unlocked(): boolean {
			return unlocked;
		},

		unlockWithKey(key: string): boolean {
			if (UNLOCK_KEY && key === UNLOCK_KEY) {
				setUnlocked();
				return true;
			}
			return false;
		},

		async unlockWithCode(code: string): Promise<boolean> {
			if (FRIEND_CODE_HASHES.length === 0) return false;
			const hash = await sha256(code.trim().toLowerCase());
			if (FRIEND_CODE_HASHES.includes(hash)) {
				setUnlocked();
				return true;
			}
			return false;
		}
	};
}

export const accessStore = createAccessStore();
