import {Component, OnInit, Inject} from "angular2/core";
import {ExpenseService} from "./expense.service";
import {TransactionComponent} from "./transaction.component";
import {Observable} from "rxjs/Observable";
import {Transaction} from "./transaction";
import {CrudService, TransactionService, AccountService} from "./crud.service";
import {Account} from "./account";

@Component({
    selector: 'transaction-list',
    templateUrl: 'app/transaction-list.component.html',
    directives: [TransactionComponent]
})
export class TransactionListComponent implements OnInit {
    transactions:Observable<Transaction[]>;
    transactions2:Observable<Transaction[]>;

    constructor(@Inject(TransactionService) private _tnxService:CrudService<Transaction>) {
        this.transactions = this._tnxService.getAllItems();
        this.transactions2 = this._tnxService
            .getFilteredItems({accountId: "572fae7d0bb7f3e81c468b44"});
    }

    ngOnInit() {
        this.refresh();
    }

    debug() {
    }

    refresh() {
        this._tnxService.refresh();
    }
}