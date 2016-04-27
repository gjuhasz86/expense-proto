import {Injectable, Inject} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {AngularFire, FirebaseRef, FirebaseListFactory} from 'angularfire2';
import {Transaction} from "./transaction";

@Injectable()
export class ExpenseService {
    // private ref:Firebase;
    // private transactionsDb:FirebaseListObservable<Transaction[]>;
    private transactions:Observable<Transaction[]>;

    constructor(private _af:AngularFire, @Inject(FirebaseRef) private _ref:Firebase) {
        // this.transactionsDb = _af.database.list('/transactions');
        // this.transactions = this.transactionsDb;
        // this.ref = new Firebase('https://jaysicks-sample2.firebaseio.com/');
    }

    getTransactions():Observable<Transaction[]> {
        console.log("Getting all transactions");
        return this._af.database.list('/transactions');
    }

    getTransactionsPage(startAt:string, endAt:string, limit:number):Observable<Transaction[]> {
        console.log("get tnx page");
        let q = this._ref.child('/transactions').orderByKey().startAt(startAt).limitToFirst(3);
        console.log(q.once('value', x=>console.log(x.val())));
        let r = q.ref();
        return FirebaseListFactory(r)
    }

    saveTransaction(tnx:Transaction):void {
        this._af.database.list('/transactions').push(tnx);
    }

    updateTransaction(tnx:Transaction):void {
        let newTnx = {
            accountId: tnx.accountId,
            description: tnx.description,
            amount: tnx.amount
        };
        this._af.database.list('/transactions').update((<any>tnx).$key, newTnx);
    }

    deleteTransaction(tnx:Transaction):void {
        this._af.database.list('/transactions').remove(<any>tnx);
    }
}