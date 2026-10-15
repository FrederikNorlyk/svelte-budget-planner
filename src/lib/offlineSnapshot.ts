import { browser } from '$app/environment';

export interface OfflinePaymentDate {
	id: number;
	expenseId: number;
	month: number;
	userIds: string[];
}

export interface OfflineExpense {
	id: number;
	name: string;
	amount: number;
	tag: string | null;
	accountId: number;
	isEnabled: boolean;
	isShared: boolean;
	userIds: string[];
	paymentDates: OfflinePaymentDate[];
}

export interface OfflineAccount {
	id: number;
	name: string;
	userIds: string[];
	expenses: OfflineExpense[];
}

export interface OfflineSettings {
	id: number;
	income: number;
	locale: string;
	partnerId: string | null;
	userId: string;
}

export interface OfflineSnapshot {
	userId: string;
	complete: true;
	savedAt: string;
	accounts: OfflineAccount[];
	expenses: OfflineExpense[];
	settings: OfflineSettings;
}

const DATABASE = 'budget-planner-offline';
const STORE = 'snapshots';

function openDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DATABASE, 1);
		request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'userId' });
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function getOfflineSnapshot(userId: string): Promise<OfflineSnapshot | null> {
	if (!browser) return null;
	const db = await openDatabase();
	return new Promise((resolve, reject) => {
		const request = db.transaction(STORE).objectStore(STORE).get(userId);
		request.onsuccess = () => resolve(request.result ?? null);
		request.onerror = () => reject(request.error);
	});
}

export async function saveOfflineSnapshot(snapshot: OfflineSnapshot): Promise<void> {
	if (!browser) return;
	const db = await openDatabase();
	await new Promise<void>((resolve, reject) => {
		const transaction = db.transaction(STORE, 'readwrite');
		transaction.objectStore(STORE).put(snapshot);
		transaction.oncomplete = () => resolve();
		transaction.onerror = () => reject(transaction.error);
		transaction.onabort = () => reject(transaction.error);
	});
}

export async function clearOfflineSnapshot(userId: string): Promise<void> {
	if (!browser) return;
	const db = await openDatabase();
	await new Promise<void>((resolve, reject) => {
		const transaction = db.transaction(STORE, 'readwrite');
		transaction.objectStore(STORE).delete(userId);
		transaction.oncomplete = () => resolve();
		transaction.onerror = () => reject(transaction.error);
	});
}
