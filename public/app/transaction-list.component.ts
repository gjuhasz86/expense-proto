import {Component, OnInit} from "angular2/core";
import {ExpenseService} from "./expense.service";
import {TransactionComponent} from "./transaction.component";
import {Observable} from "rxjs/Observable";
import {Transaction} from "./transaction";

@Component({
    selector: 'transaction-list',
    templateUrl: 'app/transaction-list.component.html',
    directives: [TransactionComponent]
})
export class TransactionListComponent implements OnInit {
    transactions:Observable<Transaction[]>;

    constructor(private _expenseService:ExpenseService) {
    }

    ngOnInit() {
        this.getTransactions();
    }

    private getTransactions() {
        console.log("get tnx");
        this.transactions = this._expenseService.getTransactions();
        // this.transactions = this._expenseService.getTransactionsPage("", "", 2);
    }
}