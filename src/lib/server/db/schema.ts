import {
	boolean,
	foreignKey,
	integer,
	numeric,
	pgTable,
	unique,
	varchar
} from 'drizzle-orm/pg-core';

export const accounts = pgTable('accounts', {
	id: integer().primaryKey().generatedAlwaysAsIdentity({
		name: 'public.budget_accounts_id_seq',
		startWith: 1,
		increment: 1,
		minValue: 1,
		maxValue: 2147483647,
		cache: 1
	}),
	userIds: varchar('user_ids', { length: 255 }).array().notNull(),
	name: varchar({ length: 255 }).notNull()
});

export const expenses = pgTable(
	'expenses',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: 'public.budget_expenses_id_seq',
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1
		}),
		userIds: varchar('user_ids', { length: 255 }).array().notNull(),
		name: varchar({ length: 255 }).notNull(),
		amount: numeric({ precision: 10, scale: 2 }).$type<number>().notNull(),
		tag: varchar({ length: 255 }),
		accountId: integer('account_id').notNull(),
		isEnabled: boolean('is_enabled').default(true).notNull(),
		isShared: boolean('is_shared').default(false).notNull()
	},
	(table) => [
		foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: 'fk_account'
		})
	]
);

export const paymentDates = pgTable(
	'payment_dates',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: 'public.budget_payment_dates_id_seq',
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1
		}),
		userIds: varchar('user_ids', { length: 255 }).array().notNull(),
		expenseId: integer('expense_id').notNull(),
		month: integer().notNull()
	},
	(table) => [
		foreignKey({
			columns: [table.expenseId],
			foreignColumns: [expenses.id],
			name: 'fk_expense'
		}).onDelete('cascade')
	]
);

export const settings = pgTable(
	'settings',
	{
		id: integer().generatedAlwaysAsIdentity({
			name: 'public.budget_settings_id_seq',
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1
		}),
		userId: varchar('user_id', { length: 255 }).notNull(),
		locale: varchar({ length: 255 }).default('en').notNull(),
		income: numeric({ precision: 10, scale: 2 }).default('0.00').$type<number>().notNull(),
		partnerId: varchar('partner_id', { length: 255 })
	},
	(table) => [unique('settings_user_id_key').on(table.userId)]
);
