import {Injectable} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Transaction} from "./transaction";
import 'rxjs/Rx';
import {BehaviorSubject} from "rxjs/Rx";
import {ReplaySubject} from "rxjs/ReplaySubject";

export class TransactionService {
}
export class AccountService {
}

@Injectable()
export class CrudService<T> {
    private events:Subject<boolean> = new Subject<boolean>();
    private _headers:Headers;
    private allItems:ReplaySubject<T[]> = new ReplaySubject<T[]>(1);

    constructor(private collection:String, private _http:Http) {
        console.log("crudservice constructor");
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
        this.getAllItems().subscribe(res=> this.allItems.next(res));
    }

    refresh():void {
        this.events.next(true);
    }

    getAllItemsCached():Observable<T[]> {
        return this.allItems;
    }

    getAllItems():Observable<T[]> {
        return this.events.map(x=>`/api/${this.collection}/list`)
            .flatMap((url:string) => this._http.post(url, "{}", {headers: this._headers}))
            .map((res:Response) => res.json());
    }

    getFilteredItems(filter:any):Observable<T[]> {
        return this.events.map(x=>`/api/${this.collection}/list`)
            .flatMap((url:string) => this._http.post(url, JSON.stringify(filter), {headers: this._headers}))
            .map((res:Response) => res.json());
    }

    saveItem(tnx:T):void {
        console.log(`calling ${this.collection} save`);

        this._http
            .post(`/api/${this.collection}/save`, JSON.stringify(tnx), {headers: this._headers})
            .map(res =>res.json())
            .subscribe(res => {
                console.log("Response came!!!");
                console.log(res);
                this.refresh();
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
                this.refresh();
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
                this.refresh();
            }, error => {
                console.log("DELETE ERROR came!!!");
                console.log(error);
            });
    }
}