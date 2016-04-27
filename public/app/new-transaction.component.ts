import {Component} from "angular2/core";
import {ExpenseService} from "./expense.service";
import {Transaction} from "./transaction";

@Component({
    selector: 'new-transaction',
    templateUrl: 'app/new-transaction.component.html'
})
export class NewTransactionComponent {
    tnx:Transaction;

    constructor(private _expenseService:ExpenseService) {
        this.reset()
    }

    reset() {
        this.tnx = new Transaction();
    }

    save() {
        this._expenseService.saveTransaction(this.tnx);
        this.reset()
    }
}