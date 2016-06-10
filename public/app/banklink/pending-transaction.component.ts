import {Input, Component, Inject, OnInit} from "@angular/core";
import {Transaction} from "../transactions/transaction";
import {TransactionService, AccountService, PendingTransactionService} from "../crud.service";
import {Account} from "../accounts/account";
import {Observable} from "rxjs/Observable";

@Component({
    selector: '[pending-transaction]',
    templateUrl: 'app/banklink/pending-transaction.component.html',
})
export class PendingTransactionComponent implements OnInit {
    @Input()
    tnx:Transaction;
    newTnx:Transaction;
    editing:boolean = false;

    accountName:Observable<string>;
    accounts:Observable<Account[]>;

    constructor(private _pTnxService:PendingTransactionService,
                private _tnxService:TransactionService,
                private _accService:AccountService) {
    }

    ngOnInit() {
        this.accounts = this._accService.getAllItemsCached();
        this.accountName = this.getAccountName(this.tnx.accountId);
        // this._accService.refresh();
    }

    startEdit():void {
        this.newTnx = JSON.parse(JSON.stringify(this.tnx));
        this.editing = true;
    }

    stopEdit():void {
        this.editing = false;
    }

    getAccountName(id:string):Observable<string> {
        return this._accService.getAllItemsCached()
            .map(accs => {
                    let r = accs.filter(acc => (<any>acc)._id == id)
                        .map(acc => acc.name)[0];
                    return r;
                }
            );
    }

    update(tnx:Transaction):void {
        console.log("updating");
        console.log(tnx);
        this._pTnxService.updateItem(tnx);
    }

    delete(tnx:Transaction):void {
        this._pTnxService.deleteItem(tnx);
    }

    save(tnx:Transaction):void {
        this._tnxService.saveItem(tnx);
        this.delete(tnx);
    }

}