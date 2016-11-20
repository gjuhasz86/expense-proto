export class Account {

    constructor(private readonly _id: string,
                public readonly name: string,
                public readonly currency: string,
                public readonly initialBalance: number,
                public readonly precision: number) {
    }

    public id(): string {
        return this._id;
    }

    static of2(name: string, ccy: string): Account {
        return Account.of3(null, name, ccy)
    }

    static of3(id: string, name: string, ccy: string): Account {
        return new Account(id, name, ccy, 0, 0)
    }

    static parse(json: any): Account {
        return new Account(
            json._id,
            json.name,
            json.currency,
            parseInt(json.initialBalance) || 0,
            parseInt(json.precision) || 0,
        );
    }
}