import { DatabaseRecord } from "$lib/models/DatabaseRecord"
import { Frequency } from "./Frequency"
import { PaymentDate } from "./PaymentDate"

export class Expense extends DatabaseRecord {

    private name: string
    private amount: number
    private frequencyNumber: number
    private tag: string
    private accountId: number
    private enabled: boolean
    private paymentDates: PaymentDate[] = []

    constructor(id: number, name: string, amount: number, frequency: number, tag: string,
        accountId: number, enabled: boolean) {

        super(id)

        this.name = name
        this.amount = amount
        this.frequencyNumber = frequency
        this.tag = tag
        this.accountId = accountId
        this.enabled = enabled
    }

    public getName() {
        return this.name
    }

    public getAmount() {
        return this.amount
    }

    public getFrequencyNumber() {
        return this.frequencyNumber
    }

    public getFrequency() {
        switch (this.frequencyNumber) {
            case 12:
                return Frequency.YEARLY
            case 6:
                return Frequency.HALF_YEARLY
            case 4:
                return Frequency.QUARTERLY
            case 1:
                return Frequency.MONTHLY
            default:
                return Frequency.CUSTOM
        }
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
            frequency: this.getFrequencyNumber(),
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
            parsed.frequency,
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