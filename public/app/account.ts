export class Account {
    id():string {
        return (<any>this)._id
    }

    name:string;
}