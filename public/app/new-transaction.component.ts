import {Component, Inject, OnInit} from "angular2/core";
import {ExpenseService} from "./expense.service";
import {Transaction} from "./transaction";
import {CrudService, TransactionService, AccountService} from "./crud.service";
import {Observable} from "rxjs/Observable";
import {Account} from "./account";

@Component({
    selector: 'new-transaction',
    templateUrl: 'app/new-transaction.component.html'
})
export class NewTransactionComponent implements OnInit {
    tnx:Transaction;
    accounts:Observable<Account[]>;

    constructor(@Inject(TransactionService) private _tnxService:CrudService<Transaction>,
                @Inject(AccountService) private _accService:CrudService<Account>) {
        this.reset()
    }

    ngOnInit() {
        this.accounts = this._accService.getAllItemsCached()
    }

    reset() {
        this.tnx = new Transaction();
    }

    save() {
        this._tnxService.saveItem(this.tnx);
        this.reset()
    }
}