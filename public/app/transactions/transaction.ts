export class Transaction {
    private _id:string;
    public description:string;
    public accountId:string;
    public amount:number;
    public date:Date;
    public reference:string;
    public extra:string;

    id():string {
        return this._id;
    }

    static parse(json:any):Transaction {
        let res = new Transaction();
        res._id = json._id;
        res.description = json.description;
        res.accountId = json.accountId;
        res.amount = parseInt(json.amount) || 0;
        res.date = new Date(json.date);
        res.reference = json.reference;
        res.extra = json.extra;
        return res;
    }
}