import {Component, OnInit, Input, OnChanges} from "@angular/core";
import {Transaction} from "./transaction";
import {TransactionService, AccountService} from "./crud.service";
import {Observable} from "rxjs/Observable";
import {Account} from "./account";

@Component({
    selector: 'new-transaction',
    templateUrl: 'app/new-transaction.component.html'
})
export class NewTransactionComponent implements OnInit, OnChanges {
    tnx:any;
    accounts:Observable<Account[]>;

    @Input() defaultAccount:string = "";

    constructor(private _tnxService:TransactionService,
                private _accService:AccountService) {
        this.reset()
    }

    ngOnChanges(changes) {
        if (changes.defaultAccount) {
            this.tnx.accountId = this.defaultAccount;
        }
    }

    ngOnInit() {
        this.accounts = this._accService.getAllItemsCached()
    }

    reset() {
        this.tnx = {accountId: this.defaultAccount};
    }

    save() {
        this._tnxService.saveItem(Transaction.parse(this.tnx));
        this.reset()
    }
}