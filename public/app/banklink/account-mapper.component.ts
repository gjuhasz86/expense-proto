import {Input, Component, Inject, OnInit} from "@angular/core";
import {Transaction} from "../transactions/transaction";
import {TransactionService, AccountService, PendingTransactionService} from "../crud.service";
import {Account} from "../accounts/account";
import {Observable} from "rxjs/Observable";
import * as _ from "underscore"

@Component({
    selector: 'account-mapper',
    templateUrl: 'app/banklink/account-mapper.component.html',
})
export class AccountMapperComponent implements OnInit {
    @Input()
    tnxs:Transaction[];
    @Input()
    pendingAccountIds:string[];
    accounts:Observable<Account[]>;
    selectedFrom:string;
    selectedTo:string;

    constructor(private _pTnxService:PendingTransactionService,
                private _tnxService:TransactionService,
                private _accService:AccountService) {
    }

    ngOnInit() {
        this.accounts = this._accService.getAllItemsCached();
    }

    update() {
        _.chain(this.tnxs)
            .filter(t=> t.accountId == this.selectedFrom)
            .forEach((t:Transaction) => {
                t.accountId = this.selectedTo;
                this._pTnxService.updateItem(t);
            });
    }

    save() {
        _.chain(this.tnxs)
            .forEach((t:Transaction) => {
                this._tnxService.saveItem(t);
                this._pTnxService.deleteItem(t);
            });
    }

    delete() {
        _.chain(this.tnxs)
            .forEach((t:Transaction) => {
                this._pTnxService.deleteItem(t);
            });
    }

}