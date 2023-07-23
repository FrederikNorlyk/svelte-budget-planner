import { DatabaseRecord } from "$lib/models/DatabaseRecord"

export class Expense extends DatabaseRecord {

    private name: string
    private amount: number
    private frequency: number
    private tag: string
    private accountId: number
    private enabled: boolean

    constructor(id: number, name: string, amount: number, frequency: number, tag: string, 
        accountId: number, enabled: boolean) {

        super(id)

        this.name = name
        this.amount = amount
        this.frequency = frequency
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

    public getFrequency() {
        return this.frequency
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

    public serialize() {
        return JSON.stringify({
            id: this.getId(),
            name: this.getName()
        })
    }

    public static parse(json: string) {
        const parsed = JSON.parse(json)
        
        return new Expense(
            parsed.id, 
            parsed.name, 
            parsed.amount, 
            parsed.frequency, 
            parsed.tag, 
            parsed.accountId, 
            parsed.enabled
        )
    }
}