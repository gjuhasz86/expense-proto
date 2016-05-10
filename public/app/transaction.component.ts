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

    constructor(@Inject(TransactionService) private _tnxService:CrudService<Transaction>,
                @Inject(AccountService) private _accService:CrudService<Account>) {
    }

    ngOnInit() {
        this.accountName = this.getAccountName(this.tnx.accountId);
        this.accounts = this.getAccounts();
    }

    startEdit():void {
        this.newTnx = JSON.parse(JSON.stringify(this.tnx));
        this.editing = true;
    }

    stopEdit():void {
        this.editing = false;
    }

    private undefToEmpty<T>(t:T):string {
        if (t === undefined)
            return "";
        else
            return t.toString();
    };

    getAccountName(id:string):Observable<String> {
        return this._accService.getAllItems()
            .map(accs => {
                    let r = accs.filter(acc => (<any>acc)._id == id)
                        .map(acc => acc.name)
                        .map(this.undefToEmpty)[0];
                    return r;
                }
            );
    }

    getAccounts():Observable<Account[]> {
        return this._accService.getAllItems()
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