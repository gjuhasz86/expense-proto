import {Input, Component, Inject, OnInit} from "angular2/core";
import {Transaction} from "./transaction";
import {CrudService, TransactionService, AccountService} from "./crud.service";
import {Account} from "./account";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

@Component({
    selector: 'transaction',
    templateUrl: 'app/transaction.component.html',
})
export class TransactionComponent implements OnInit {
    @Input()
    tnx:Transaction;
    newTnx:Transaction;
    editing:boolean = false;

    accountName:Observable<string>;
    accounts:Observable<Account[]>;

    constructor(private _tnxService:TransactionService,
                private _accService:AccountService) {
    }

    ngOnInit() {
        this.accounts = this._accService.getAllItemsCached();
        this.accountName = this.getAccountName(this.tnx.accountId);
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
        this._tnxService.updateItem(tnx);
    }

    delete(tnx:Transaction):void {
        this._tnxService.deleteItem(tnx);
    }

}