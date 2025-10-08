import type { ResolvedPathname } from '$app/types';

export default interface SearchResult {
	url: ResolvedPathname;
	name: string;
	recordType: RecordType;
}

export enum RecordType {
	ACCOUNT,
	EXPENSE,
	TAG
}
