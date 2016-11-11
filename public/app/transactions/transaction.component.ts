import {Input, Component, Inject, OnInit} from "@angular/core";
import {Transaction} from "./transaction";
import {TransactionService, AccountService} from "../crud.service";
import {Account} from "../accounts/account";
import {Observable} from "rxjs/Observable";
import {Category} from "../categories/category";
import {TransactionControlComponent} from "./transaction-control.component";

@Component({
    selector: '[transaction]',
    templateUrl: 'app/transactions/transaction.component.html',
    directives: [TransactionControlComponent]
})
export class TransactionComponent implements OnInit {
    @Input()
    tnx: Transaction;
    newTnx: Transaction;
    editing: boolean = false;
    selected: boolean = false;

    accountName: Observable<string>;
    accounts: Observable<Account[]>;

    constructor(private _tnxService: TransactionService,
                private _accService: AccountService) {
    }

    ngOnInit() {
        this.accounts = this._accService.getAllItemsCached();
        this.accountName = this.getAccountName(this.tnx.accountId);
        // this._accService.refresh();
    }

    clicked(): void {
        this.selected = !this.selected;
    }

    startEdit(): void {
        console.log("woah:" + this.selected);
        this.newTnx = JSON.parse(JSON.stringify(this.tnx));
        this.editing = true;
    }

    stopEdit(): void {
        this.editing = false;
    }

    getAccountName(id: string): Observable<string> {
        return this._accService.getAllItemsCached()
            .map(accs => {
                    let r = accs.filter(acc => (<any>acc)._id == id)
                        .map(acc => acc.name)[0];
                    return r;
                }
            );
    }

    update(tnx: Transaction): void {
        console.log("updating");
        console.log(tnx);
        this._tnxService.updateItem(tnx);
    }

    delete(tnx: Transaction): void {
        this._tnxService.deleteItem(tnx);
    }

    addCat(c: string) {
        if (this.selected) {
            this.newTnx = JSON.parse(JSON.stringify(this.tnx));
            this.newTnx.categories.push(c);
            this.update(this.newTnx);
        }
    }

    remCat(c: string) {
        if (this.selected) {
            this.newTnx = JSON.parse(JSON.stringify(this.tnx));
            let i = this.newTnx.categories.indexOf(c);
            if (i > -1) {
                this.newTnx.categories.splice(i, 1);
                this.update(this.newTnx);
            }
        }
    }
}