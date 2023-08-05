import { DatabaseRecord } from "$lib/models/DatabaseRecord"
import { PaymentDate } from "./PaymentDate"

export class Expense extends DatabaseRecord {

    private name: string
    private amount: number
    private tag: string | null
    private accountId: number
    private enabled: boolean
    private paymentDates: PaymentDate[] = []

    constructor(id: number, name: string, amount: number, tag: string | null | undefined,
        accountId: number, enabled: boolean) {

        super(id)

        this.name = name
        this.amount = amount
        this.tag = tag === undefined ? null : tag
        this.accountId = accountId
        this.enabled = enabled
    }

    public getName() {
        return this.name
    }

    public getAmount() {
        return this.amount
    }

    public getMonthlyAmount() {
        if (this.isMonthlyExpense()) {
            return this.amount;
        }
        
        const numberOfTransfers = 12 / this.getPaymentDates().length;
        return this.amount / numberOfTransfers;
    }

    public isMonthlyExpense() {
        const numberOfDates = this.getPaymentDates().length;
        return numberOfDates === 0 || numberOfDates === 12;
    }

    public getTag() {
        return this.tag
    }

    public getAccountId() {
        return this.accountId
    }

    public isEnabled() {
        return this.enabled
    }

    public getPaymentDates() {
        return this.paymentDates
    }

    public setPaymentDates(paymentDates: PaymentDate[]) {
        this.paymentDates = paymentDates
    }

    public serialize() {
        return JSON.stringify({
            id: this.getId(),
            name: this.getName(),
            amount: this.getAmount(),
            tag: this.getTag(),
            accountId: this.getAccountId(),
            enabled: this.isEnabled(),
            paymentDates: this.getPaymentDates().map((paymentDate) => paymentDate.serialize())
        })
    }

    public static parse(json: string) {
        const parsed = JSON.parse(json)

        const expense = new Expense(
            parsed.id,
            parsed.name,
            parsed.amount,
            parsed.tag,
            parsed.accountId,
            parsed.enabled
        )

        if (parsed.paymentDates) {
            expense.setPaymentDates(parsed.paymentDates.map((paymentDate: string) =>  PaymentDate.parse(paymentDate)))
        }

        return expense
    }
}