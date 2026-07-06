import { browser } from '$app/environment';
import { en } from './locales/en';
import { es } from './locales/es';
import { pt } from './locales/pt';

export type Locale = 'en' | 'es' | 'pt';

const LOCALE_KEY = 'ifs_locale';
const catalogs: Record<Locale, typeof en> = { en, es, pt };

let currentLocale = $state<Locale>(
	browser ? ((localStorage.getItem(LOCALE_KEY) as Locale) ?? 'en') : 'en'
);

export function setLocale(locale: Locale): void {
	currentLocale = locale;
	if (browser) localStorage.setItem(LOCALE_KEY, locale);
}

export function getLocale(): Locale {
	return currentLocale;
}

function resolve(obj: unknown, path: string): unknown {
	return path.split('.').reduce((acc: unknown, part) => {
		if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[part];
		return undefined;
	}, obj);
}

export function t(key: string, params?: Record<string, string | number>): string {
	const catalog = catalogs[currentLocale] ?? en;
	let msg = (resolve(catalog, key) ?? resolve(en, key) ?? key) as string;
	if (params) {
		for (const [k, v] of Object.entries(params)) {
			msg = msg.replaceAll(`{${k}}`, String(v));
		}
	}
	return msg;
}

export function tArray(key: string): string[] {
	const catalog = catalogs[currentLocale] ?? en;
	const val = resolve(catalog, key) ?? resolve(en, key);
	return Array.isArray(val) ? (val as string[]) : [];
}
