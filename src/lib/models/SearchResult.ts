export default interface SearchResult {
	id: string;
	accountId?: number;
	name: string;
	recordType: RecordType;
}

export enum RecordType {
	ACCOUNT,
	EXPENSE,
	TAG
}
