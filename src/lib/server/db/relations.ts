import { relations } from 'drizzle-orm/relations';
import { accounts, expenses, paymentDates } from './schema';

export const paymentDatesRelations = relations(paymentDates, ({ one }) => ({
	expense: one(expenses, {
		fields: [paymentDates.expenseId],
		references: [expenses.id]
	})
}));

export const expensesRelations = relations(expenses, ({ one, many }) => ({
	paymentDates: many(paymentDates),
	account: one(accounts, {
		fields: [expenses.accountId],
		references: [accounts.id]
	})
}));

export const accountsRelations = relations(accounts, ({ many }) => ({
	expenses: many(expenses)
}));
