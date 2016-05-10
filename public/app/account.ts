export class Account {
    public id():string {
        return (<any>this)._id;
    }

    constructor(public name:string, public _id:string) {
    }
}