import { DatabaseRecord } from "./DatabaseRecord";
import { Expense } from "./Expense";

export class Account extends DatabaseRecord {

    private name: string
    private expenses: Expense[] = []
    private userIds: number[]

    constructor(id: number, name: string, userIds: number[]) {
        super(id)

        this.name = name
        this.userIds = userIds
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

    public getUserIds() {
        return this.userIds;
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
            userIds: this.getUserIds(),
            expenses: this.getExpenses().map((expense) => expense.serialize())
        })
    }

    public static parse(json: string): Account {
        const parsed = JSON.parse(json)
        const account = new Account(parsed.id, parsed.name, parsed.userIds)

        if (parsed.expenses) {
            account.setExpenses(parsed.expenses.map((expense: string) => Expense.parse(expense)))
        }

        return account
    }
}