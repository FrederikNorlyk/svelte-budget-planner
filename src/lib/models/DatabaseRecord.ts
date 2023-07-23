export abstract class DatabaseRecord {
    
    private id: number

    constructor(id: number) {
        this.id = id
    }

    public getId() {
        return this.id
    }

    public abstract serialize(): string
}