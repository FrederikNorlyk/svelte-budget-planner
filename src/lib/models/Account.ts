import { DatabaseRecord } from "./DatabaseRecord";
import { Expense } from "./Expense";

export class Account extends DatabaseRecord {

    private name: string
    private expenses: Expense[] = []

    constructor(id: number, name: string) {
        super(id)

        this.name = name
    }

    public getName() {
        return this.name
    }

    public getExpenses() {
        return this.expenses
    }

    public setExpenses(expenses: Expense[]) {
        this.expenses = expenses
    }

    public getMonthlyAmount(): number {
        let amount = 0

        this.getExpenses().forEach(expense => {
            if (!expense.isEnabled()) {
                return
            }
            amount += expense.getMonthlyAmount()
        })

        return amount
    }

    public serialize() {
        return JSON.stringify({
            id: this.getId(),
            name: this.getName(),
            expenses: this.getExpenses().map((expense) => expense.serialize())
        })
    }

    public static parse(json: string): Account {
        const parsed = JSON.parse(json)
        const account = new Account(parsed.id, parsed.name)

        if (parsed.expenses) {
            account.setExpenses(parsed.expenses.map((expense: string) => Expense.parse(expense)))
        }

        return account
    }
}