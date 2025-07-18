/**
 * Custom implementation of the error class from Kysely.
 */
export interface DatabaseError extends Error {
	code: string;
}
