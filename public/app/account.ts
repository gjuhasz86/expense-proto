export class Account {
    public id():string {
        return (<any>this)._id;
    }

    public name:string;
}