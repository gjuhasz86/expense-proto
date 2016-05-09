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

    constructor(@Inject(TransactionService) private _tnxService:CrudService<Transaction>) {
    }

    ngOnInit() {
        this.getTransactions();
    }

    private getTransactions() {
        console.log("get tnx");
        this.transactions = this._tnxService.getAllItems();
        // this.transactions = this._expenseService.getTransactionsPage("", "", 2);
    }
}