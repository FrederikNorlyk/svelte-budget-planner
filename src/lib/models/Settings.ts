import { DatabaseRecord } from "./DatabaseRecord";

/**
 * A record for storing user settings.
 */
export class Settings extends DatabaseRecord {

    private locale: string
    private income: number

    constructor(id: number, locale: string, income: number) {
        super(id)

        this.locale = locale
        this.income = income
    }

    public getIncome() {
        return this.income
    }

    public setIncome(income: number) {
        this.income = income
    }

    public getLocale() {
        return this.locale
    }

    public serialize() {
        return JSON.stringify({
            id: this.getId(),
            locale: this.getLocale(),
            income: this.getIncome()
        })
    }

    public static parse(json: string) {
        const parsed = JSON.parse(json)
        return new Settings(parsed.id, parsed.locale, parsed.income)
    }
}