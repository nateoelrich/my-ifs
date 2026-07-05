// ifs-workspace schema v1
// A local-first, extensible format for IFS therapy data.
// All data is stored in the browser's localStorage under STORAGE_KEY.

export const STORAGE_KEY = 'ifs-workspace';
export const FORMAT_NAME = 'ifs-workspace';
export const FORMAT_VERSION = '1';
export const PART_SCHEMA_VERSION = 1;

// --- Envelope ---

export interface IfsWorkspace {
	$schema: 'ifs-workspace/v1';
	format: 'ifs-workspace';
	version: string;
	meta: {
		createdAt: string;
		updatedAt: string;
	};
	collections: {
		parts: Part[];
		// Future: sessions, journals, maps, exercises
	};
}

// --- Part ---

export type PartRoleType = 'exile' | 'manager' | 'firefighter' | 'unknown';

export interface Part {
	// Envelope fields
	id: string;
	type: 'part';
	schemaVersion: number;
	createdAt: string;
	updatedAt: string;

	// Domain fields
	name: string;
	nickname?: string;
	roleType?: PartRoleType | string;
	color?: string;
	bodyLocation?: string;
	bodySensation?: string;
	image?: string;
	apparentAge?: string;
	emotions: string[];
	beliefs: string[];
	triggers: string[];
	positiveIntention?: string;
	fears: string[];
	whatItNeedsFromSelf?: string;
	originLifeStage?: string;
	originStory?: string;
	giftsWhenUnburdened?: string;
	notes?: string;
}

export type CreatePartInput = Omit<Part, 'id' | 'type' | 'schemaVersion' | 'createdAt' | 'updatedAt'>;
