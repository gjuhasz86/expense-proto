export class Account {

    private _id:string;
    public name:string;
    public initialBalance:number;
    public currency:string;
    public precision:number;

    public id():string {
        return this._id;
    }

    static parse(json:any):Account {
        let res = new Account();
        res._id = json._id;
        res.name = json.name;
        res.initialBalance = parseInt(json.initialBalance) || 0;
        res.currency = json.currency;
        res.precision = parseInt(json.precision) || 0;
        return res;
    }
}