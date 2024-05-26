import type { Month } from "$lib/enums/Month";
import { DatabaseRecord } from "./DatabaseRecord";

export class PaymentDate extends DatabaseRecord {

    private expenseId: number
    private month: Month
    private dayOfMonth: number
    private userIds: number[]

    /**
     * Constructor.
     * 
     * @param id payment date id
     * @param expenseId id of the expense that the payment date belongs to
     * @param dayOfMonth the day of the month where the payment will take place
     * @param month the 0-indexed month, that the payment will take place in
     */
    constructor(id: number, expenseId: number, month: Month, dayOfMonth: number, userIds: number[]) {
        super(id)
        
        this.expenseId = expenseId
        this.month = month
        this.dayOfMonth = dayOfMonth;
        this.userIds = userIds;
    }

    public getExpenseId() {
        return this.expenseId
    }

    public getMonth() {
        return this.month
    }

    public getDayOfMonth() {
        return this.dayOfMonth
    }

    public getUserIds() {
        return this.userIds;
    }

    public serialize() {
        return JSON.stringify({
            id: this.getId(),
            expenseId: this.getExpenseId(),
            month: this.getMonth(),
            dayOfMonth: this.getDayOfMonth(),
            userIds: this.getUserIds()
        })
    }

    public static parse(json: string) {
        const parsed = JSON.parse(json)
        return new PaymentDate(parsed.id, parsed.expenseId, parsed.month, parsed.dayOfMonth, parsed.userIds)
    }
}