export class Account implements Cloneable, HasId {

    constructor(private readonly _id: string,
                public readonly name: string,
                public readonly currency: string,
                public readonly initialBalance: number,
                public readonly precision: number,
                public readonly owner: string) {
    }

    id(): string {
        return this._id;
    }

    clone(): any {
        return {
            _id: this._id,
            name: this.name,
            currency: this.currency,
            initialBalance: this.initialBalance,
            precision: this.precision,
            owner: this.owner
        }
    }

    static of2(name: string, ccy: string): Account {
        return Account.of3(null, name, ccy)
    }

    static of3(id: string, name: string, ccy: string): Account {
        return new Account(id, name, ccy, 0, 0, null)
    }

    static parse(json: any): Account {
        return new Account(
            json._id,
            json.name,
            json.currency,
            parseInt(json.initialBalance) || 0,
            parseInt(json.precision) || 0,
            json.owner
        );
    }
}