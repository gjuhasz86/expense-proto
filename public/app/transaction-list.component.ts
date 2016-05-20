import {Component, OnInit, Inject} from "angular2/core";
import {TransactionComponent} from "./transaction.component";
import {Observable} from "rxjs/Observable";
import {Transaction} from "./transaction";
import {TransactionService} from "./crud.service";
import * as _ from 'underscore';
import {ReplaySubject} from "rxjs/ReplaySubject";

@Component({
    selector: 'transaction-list',
    templateUrl: 'app/transaction-list.component.html',
    directives: [TransactionComponent]
})
export class TransactionListComponent implements OnInit {
    transactions:Observable<Transaction[]>;
    page:ReplaySubject<number> = new ReplaySubject<number>(1);
    limit:number = 5;
    pages:Observable<number[]>;

    constructor(private _tnxService:TransactionService) {
    }

    ngOnInit() {
        this.transactions = this._tnxService.getPage(this.page, this.limit, "date", "desc");
        this.page.next(1);
        this.pages = this.genPages();
    }

    refresh() {
        this._tnxService.refresh();
    }

    genPages():Observable < number[] > {
        return this.page.map(p=> {
            let first = Math.max(1, p - 2);
            let last = first + 5;
            return _.range(first, last)
        })
    }

    setPage(p:number) {
        this.page.next(p);
    }
}