import { browser } from '$app/environment';
import {
	STORAGE_KEY,
	PART_SCHEMA_VERSION,
	SESSION_SCHEMA_VERSION,
	type IfsWorkspace,
	type Part,
	type CreatePartInput,
	type Session,
	type CreateSessionInput
} from './types';
import { createEmptyWorkspace, loadWorkspace } from './migrations';

function createDataStore() {
	let ws = $state<IfsWorkspace>(
		browser ? loadWorkspace(localStorage.getItem(STORAGE_KEY)) : createEmptyWorkspace()
	);

	function persist() {
		ws.meta.updatedAt = new Date().toISOString();
		if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(ws));
	}

	const parts = $derived(
		[...ws.collections.parts].sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		)
	);

	const sessions = $derived(
		[...ws.collections.sessions].sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		)
	);

	return {
		get parts(): Part[] {
			return parts;
		},

		get sessions(): Session[] {
			return sessions;
		},

		// --- Part CRUD ---

		getPart(id: string): Part | undefined {
			return ws.collections.parts.find((p) => p.id === id);
		},

		createPart(input: CreatePartInput): Part {
			const now = new Date().toISOString();
			const part: Part = {
				...input,
				id: crypto.randomUUID(),
				type: 'part',
				schemaVersion: PART_SCHEMA_VERSION,
				createdAt: now,
				updatedAt: now
			};
			ws.collections.parts.push(part);
			persist();
			return part;
		},

		updatePart(id: string, input: CreatePartInput): Part {
			const idx = ws.collections.parts.findIndex((p) => p.id === id);
			if (idx === -1) throw new Error('Part not found');
			const updated: Part = {
				...ws.collections.parts[idx],
				...input,
				updatedAt: new Date().toISOString()
			};
			ws.collections.parts[idx] = updated;
			persist();
			return updated;
		},

		deletePart(id: string): void {
			ws.collections.parts = ws.collections.parts.filter((p) => p.id !== id);
			persist();
		},

		// --- Session CRUD ---

		getSession(id: string): Session | undefined {
			return ws.collections.sessions.find((s) => s.id === id);
		},

		getSessionsForPart(partId: string): Session[] {
			return [...ws.collections.sessions]
				.filter((s) => s.linkedPartId === partId)
				.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
		},

		createSession(input: CreateSessionInput): Session {
			const now = new Date().toISOString();
			const session: Session = {
				...input,
				id: crypto.randomUUID(),
				schemaVersion: SESSION_SCHEMA_VERSION,
				createdAt: now,
				updatedAt: now
			};
			ws.collections.sessions.push(session);
			persist();
			return session;
		},

		updateSession(id: string, input: Partial<CreateSessionInput>): Session {
			const idx = ws.collections.sessions.findIndex((s) => s.id === id);
			if (idx === -1) throw new Error('Session not found');
			const updated: Session = {
				...ws.collections.sessions[idx],
				...input,
				updatedAt: new Date().toISOString()
			};
			ws.collections.sessions[idx] = updated;
			persist();
			return updated;
		},

		deleteSession(id: string): void {
			ws.collections.sessions = ws.collections.sessions.filter((s) => s.id !== id);
			persist();
		},

		// --- Backup ---

		exportJSON(): string {
			return JSON.stringify(ws, null, 2);
		},

		importJSON(raw: string): void {
			const loaded = loadWorkspace(raw);
			ws = loaded;
			persist();
		}
	};
}

export const dataStore = createDataStore();
