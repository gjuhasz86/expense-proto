import {Component, Inject, OnInit} from "angular2/core";
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

    constructor(private _tnxService:TransactionService,
                private _accService:AccountService) {
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