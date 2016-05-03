import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Transaction} from "./transaction";
import 'rxjs/Rx';

@Injectable()
export class ExpenseService {
    private transactions:Subject<Transaction[]>;
    private _headers:Headers;

    constructor(private _http:Http) {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');

        this.transactions = new Subject<Transaction[]>();
    }


    getTransactions():Observable<Transaction[]> {
        console.log("Getting all transactions");
        // return this._af.database.list('/transactions');
        this._http
            .get('/api/transactions/list')
            .map(res => res.json())
            .subscribe(res => this.transactions.next(res));

        return this.transactions;
    }

    // getTransactionsPage(startAt:string, endAt:string, limit:number):Observable<Transaction[]> {
    //     console.log("get tnx page");
    //     let q = this._ref.child('/transactions').orderByKey().startAt(startAt).limitToFirst(3);
    //     console.log(q.once('value', x=>console.log(x.val())));
    //     let r = q.ref();
    //     return FirebaseListFactory(r)
    // }

    saveTransaction(tnx:Transaction):void {
        console.log("calling transaction save");

        this._http
            .post('/api/transactions/save', JSON.stringify(tnx), {headers: this._headers})
            .map(res =>res.json())
            .subscribe(res => {
                console.log("Response came!!!");
                console.log(res);
                this.getTransactions();
            }, error => {
                console.log("ERROR came!!!");
                console.log(error);
            });
    }

    updateTransaction(tnx:Transaction):void {
        console.log("calling transaction update " + (<any>tnx)._id);

        this._http
            .post('/api/transactions/update', JSON.stringify(tnx), {headers: this._headers})
            .subscribe(res => {
                console.log("UPDATE Response came!!!");
                console.log(res);
                this.getTransactions();
            }, error => {
                console.log("UPDATE ERROR came!!!");
                console.log(error);
            });
    }

    deleteTransaction(tnx:Transaction):void {
        console.log("calling transaction delete " + (<any>tnx)._id);

        let obj = {_id: (<any>tnx)._id};
        this._http
            .post('/api/transactions/delete', JSON.stringify(obj), {headers: this._headers})
            .subscribe(res => {
                console.log("DELETE Response came!!!");
                console.log(res);
                this.getTransactions();
            }, error => {
                console.log("DELETE ERROR came!!!");
                console.log(error);
            });
    }
}