import {
	FORMAT_NAME,
	FORMAT_VERSION,
	PART_SCHEMA_VERSION,
	SESSION_SCHEMA_VERSION,
	type IfsWorkspace,
	type Part,
	type Session
} from './types';

export function createEmptyWorkspace(): IfsWorkspace {
	const now = new Date().toISOString();
	return {
		$schema: 'ifs-workspace/v1',
		format: FORMAT_NAME,
		version: FORMAT_VERSION,
		meta: { createdAt: now, updatedAt: now },
		collections: { parts: [], sessions: [] }
	};
}

export function loadWorkspace(raw: string | null): IfsWorkspace {
	if (!raw) return createEmptyWorkspace();
	try {
		const parsed: unknown = JSON.parse(raw);
		if (!isObject(parsed) || parsed.format !== FORMAT_NAME) {
			return createEmptyWorkspace();
		}
		// Version-gated migrations go here as the schema evolves:
		// if (parsed.version === '0') return migrateV0toV1(parsed);
		return ensureDefaults(parsed as unknown as IfsWorkspace);
	} catch {
		return createEmptyWorkspace();
	}
}

function ensureDefaults(ws: IfsWorkspace): IfsWorkspace {
	return {
		...ws,
		collections: {
			...ws.collections,
			parts: (ws.collections?.parts ?? []).map(ensurePartDefaults),
			sessions: (ws.collections?.sessions ?? []).map(ensureSessionDefaults)
		}
	};
}

function ensurePartDefaults(p: Partial<Part>): Part {
	return {
		type: 'part',
		schemaVersion: PART_SCHEMA_VERSION,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		emotions: [],
		beliefs: [],
		triggers: [],
		fears: [],
		...p,
		id: p.id ?? crypto.randomUUID(),
		name: p.name ?? 'Unnamed part'
	};
}

function ensureSessionDefaults(s: Partial<Session>): Session {
	return {
		type: 'check-in',
		schemaVersion: SESSION_SCHEMA_VERSION,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		emotions: [],
		selfEnergyQualities: [],
		...s,
		id: s.id ?? crypto.randomUUID()
	};
}

function isObject(val: unknown): val is Record<string, unknown> {
	return typeof val === 'object' && val !== null && !Array.isArray(val);
}
