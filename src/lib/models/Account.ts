import { DatabaseRecord } from "./DatabaseRecord";

export class Account extends DatabaseRecord {

    private name: string

    constructor(id: number, name: string) {
        super(id)
        
        this.name = name
    }

    public getName() {
        return this.name
    }

    public serialize() {
        return JSON.stringify({
            id: this.getId(),
            name: this.getName()
        })
    }

    public static parse(json: string): Account {
        const parsed = JSON.parse(json)
        return new Account(parsed.id, parsed.name)
    }
}