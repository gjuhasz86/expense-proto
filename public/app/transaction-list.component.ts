import {Component, OnInit, Inject} from "@angular/core";
import {TransactionComponent} from "./transaction.component";
import {Observable} from "rxjs/Observable";
import {Transaction} from "./transaction";
import {TransactionService} from "./crud.service";
import * as _ from 'underscore';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {NewTransactionComponent} from "./new-transaction.component";
import {PAGINATION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap'

@Component({
    selector: 'transaction-list',
    templateUrl: 'app/transaction-list.component.html',
    directives: [
        NewTransactionComponent,
        TransactionComponent,
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

    constructor(private _tnxService:TransactionService) {
    }

    ngOnInit() {
        this.transactions = this._tnxService.getPage(this.pageSubj, this.limit, "date", "desc");
        this.pageSubj.next(1);
        this.pages = this.genPages();
        this.numOfTnxs = this._tnxService.getCount();
    }

    refresh() {
        this._tnxService.refresh();
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