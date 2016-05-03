import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Transaction} from "./transaction";
import 'rxjs/Rx';


export class TransactionService {
}
export class AccountService {
}

@Injectable()
export class CrudService<T> {
    private items:Subject<T[]>;
    private _headers:Headers;

    constructor(private collection:String, private _http:Http) {
        console.log("crudservice constructor");
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
        this.items = new Subject<T[]>();
    }


    getItems():Observable<T[]> {
        console.log("CrudService#getTransactions");
        this._http
            .get(`/api/${this.collection}/list`)
            .map(res => res.json())
            .subscribe(res => this.items.next(res));

        return this.items;
    }

    // getTransactionsPage(startAt:string, endAt:string, limit:number):Observable<Transaction[]> {
    //     console.log("get tnx page");
    //     let q = this._ref.child('/transactions').orderByKey().startAt(startAt).limitToFirst(3);
    //     console.log(q.once('value', x=>console.log(x.val())));
    //     let r = q.ref();
    //     return FirebaseListFactory(r)
    // }

    saveItem(tnx:T):void {
        console.log(`calling ${this.collection} save`);

        this._http
            .post(`/api/${this.collection}/save`, JSON.stringify(tnx), {headers: this._headers})
            .map(res =>res.json())
            .subscribe(res => {
                console.log("Response came!!!");
                console.log(res);
                this.getItems();
            }, error => {
                console.log("ERROR came!!!");
                console.log(error);
            });
    }

    updateItem(tnx:T):void {
        console.log(`calling ${this.collection} update ` + (<any>tnx)._id);

        this._http
            .post(`/api/${this.collection}/update`, JSON.stringify(tnx), {headers: this._headers})
            .subscribe(res => {
                console.log("UPDATE Response came!!!");
                console.log(res);
                this.getItems();
            }, error => {
                console.log("UPDATE ERROR came!!!");
                console.log(error);
            });
    }

    deleteItem(tnx:T):void {
        console.log(`calling ${this.collection} delete ` + (<any>tnx)._id);

        let obj = {_id: (<any>tnx)._id};
        this._http
            .post(`/api/${this.collection}/delete`, JSON.stringify(obj), {headers: this._headers})
            .subscribe(res => {
                console.log("DELETE Response came!!!");
                console.log(res);
                this.getItems();
            }, error => {
                console.log("DELETE ERROR came!!!");
                console.log(error);
            });
    }
}