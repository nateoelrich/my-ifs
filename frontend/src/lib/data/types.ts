// ifs-workspace schema v1
// A local-first, extensible format for IFS therapy data.
// All data is stored in the browser's localStorage under STORAGE_KEY.

export const STORAGE_KEY = 'ifs-workspace';
export const FORMAT_NAME = 'ifs-workspace';
export const FORMAT_VERSION = '1';
export const PART_SCHEMA_VERSION = 1;
export const SESSION_SCHEMA_VERSION = 1;

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
		sessions: Session[];
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

	// Relational / healing status
	protectsPartId?: string;  // exile this protector guards (shown as arc on map)
	hasUnburdened?: boolean;  // unburdening session completed
}

export type CreatePartInput = Omit<Part, 'id' | 'type' | 'schemaVersion' | 'createdAt' | 'updatedAt'>;

// --- Session ---

export type SessionType = 'check-in' | 'daily' | 'session';
export type SessionProtocol = 'free' | '6fs' | 'unburdening';

export interface Session {
	id: string;
	type: SessionType;
	protocol?: SessionProtocol;
	schemaVersion: number;
	createdAt: string;
	updatedAt: string;

	title?: string;
	context?: string;       // what was happening / trailhead

	bodyLocation?: string;
	bodySensation?: string;
	emotions: string[];

	linkedPartId?: string;  // known part that was identified
	newPartName?: string;   // if a new part was discovered mid-session

	selfEnergyQualities: string[];  // which of the 8 C's were present

	// Free-text core responses
	whatIsItDoing?: string;   // positive intention
	whatDoesItNeed?: string;  // need from Self
	whatHelped?: string;      // what aided unblending / close

	// Protocol: 6 F's (protector work)
	sixFs?: {
		find?: string;
		focus?: string;
		fleshOut?: string;
		feelToward?: string;
		befriend?: string;
		fear?: string;
	};

	// Protocol: Unburdening (exile work)
	unburdening?: {
		witness?: string;
		validate?: string;
		doOver?: string;
		retrieve?: string;
		burdenRelease?: string[];  // ['light', 'water', 'fire', 'wind', 'earth']
		gifts?: string;
	};

	// Daily check-in
	daily?: {
		moodScore?: number;       // 1–5
		selfEnergyScore?: number; // 1–5
		activeParts?: string[];   // part IDs
		partsMessage?: string;
	};

	notes?: string;
}

export type CreateSessionInput = Omit<Session, 'id' | 'schemaVersion' | 'createdAt' | 'updatedAt'>;
