export class Transaction {
    constructor(private readonly _id: string,
                public readonly description: string,
                public readonly accountId: string,
                public readonly amount: number,
                public readonly date: Date,
                public readonly reference: string,
                public readonly extra: string,
                public readonly categories: string[],
                public readonly owner?: string) {}

    id(): string {
        return this._id;
    }

    clone(): any {
        return {
            _id: this._id,
            description: this.description,
            accountId: this.accountId,
            amount: this.amount,
            date: this.date,
            reference: this.reference,
            extra: this.extra,
            categories: this.categories.slice(0),
            owner: this.owner
        }
    }

    static parse(json: any): Transaction {
        let ref = json.reference ? json.reference : "";
        let extra = json.extra ? json.extra : "";
        let cats = json.categories ? json.categories : [];

        return new Transaction(
            json._id,
            json.description,
            json.accountId,
            parseInt(json.amount) || 0,
            new Date(json.date),
            ref,
            extra,
            cats,
            json.owner
        )
    }
}