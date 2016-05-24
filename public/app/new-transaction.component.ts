import {Component, OnInit} from "@angular/core";
import {Transaction} from "./transaction";
import {TransactionService, AccountService} from "./crud.service";
import {Observable} from "rxjs/Observable";
import {Account} from "./account";

@Component({
    selector: 'new-transaction',
    templateUrl: 'app/new-transaction.component.html'
})
export class NewTransactionComponent implements OnInit {
    tnx:any;
    accounts:Observable<Account[]>;

    constructor(private _tnxService:TransactionService,
                private _accService:AccountService) {
        this.reset()
    }

    ngOnInit() {
        this.accounts = this._accService.getAllItemsCached()
    }

    reset() {
        this.tnx = {};
    }

    save() {
        this._tnxService.saveItem(Transaction.parse(this.tnx));
        this.reset()
    }

    debug() {
        console.log(JSON.stringify(this.tnx));
    }
}