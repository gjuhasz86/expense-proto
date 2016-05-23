export class Transaction {
    private _id:string;
    public description:string;
    public accountId:string;
    public amount:number;
    public date:Date;

    id():string {
        return _id;
    }

    static parse(json:any):Transaction {
        let res = new Transaction();
        res._id = json._id;
        res.description = json.description;
        res.accountId = json.accountId;
        res.amount = parseInt(json.amount) || 0;
        res.date = new Date(json.date);
        return res;
    }
}