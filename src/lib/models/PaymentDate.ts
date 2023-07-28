import { DatabaseRecord } from "./DatabaseRecord";

export class PaymentDate extends DatabaseRecord {

    private expenseId: number
    private dayOfMonth: number
    private month: number

    constructor(id: number, expenseId: number, dayOfMonth: number, month: number) {
        super(id)
        
        this.expenseId = expenseId
        this.dayOfMonth = dayOfMonth;
        this.month = month
    }

    public getExpenseId() {
        return this.expenseId
    }

    public getDayOfMonth() {
        return this.dayOfMonth
    }

    public getMonth() {
        return this.month
    }

    public serialize() {
        return JSON.stringify({
            id: this.getId(),
            expenseId: this.getExpenseId(),
            dayOfMonth: this.getDayOfMonth(),
            month: this.getMonth()
        })
    }

    public static parse(json: string) {
        const parsed = JSON.parse(json)
        return new PaymentDate(parsed.id, parsed.expenseId, parsed.dayOfMonth, parsed.month)
    }
}