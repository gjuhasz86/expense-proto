import {Component, OnInit, Inject} from "@angular/core";
import {TransactionComponent} from "./transaction.component";
import {Observable} from "rxjs/Observable";
import {Transaction} from "./transaction";
import {TransactionService} from "./crud.service";
import * as _ from 'underscore';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {NewTransactionComponent} from "./new-transaction.component";
import {PAGINATION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap'
import {TransactionFilterComponent} from "./transaction-filter.component";
import {Debug2Component} from "./debug2.component";

@Component({
    selector: 'transaction-list',
    templateUrl: 'app/transaction-list.component.html',
    directives: [
        NewTransactionComponent,
        TransactionComponent,
        TransactionFilterComponent,
        Debug2Component,
        PAGINATION_DIRECTIVES
    ]
})
export class TransactionListComponent implements OnInit {
    transactions:Observable<Transaction[]>;
    page:number;
    pageSubj:ReplaySubject<number> = new ReplaySubject<number>(1);
    limit:number = 20;
    pages:Observable<number[]>;
    numOfTnxs:Observable<number>;
    defaultAccount:string;//= "574218a2fa58b0b820f5b936";

    constructor(private _tnxService:TransactionService) {
    }

    ngOnInit() {
        this.transactions = this._tnxService.getPage(this.pageSubj, this.limit, "date", "desc", this.defaultAccount)
        this.pages = this.genPages();
        this.numOfTnxs = this._tnxService.getCount();
        this.refresh();
    }

    refresh() {
        this._tnxService.refresh();
        this.pageSubj.next(1);
    }

    onAccountChanged(accId):void {
        this.defaultAccount = accId;
        this.transactions = this._tnxService.getPage(this.pageSubj, this.limit, "date", "desc", this.defaultAccount);
        this.refresh();
    }

    genPages():Observable < number[] > {
        return this.pageSubj.map(p=> {
            let first = Math.max(1, p - 2);
            let last = first + 5;
            return _.range(first, last)
        })
    }

    setPage(p:any) {
        this.pageSubj.next(p.page);
    }
}