import {Component, Inject} from "angular2/core";
import {ExpenseService} from "./expense.service";
import {Transaction} from "./transaction";
import {CrudService, TransactionService} from "./crud.service";

@Component({
    selector: 'new-transaction',
    templateUrl: 'app/new-transaction.component.html'
})
export class NewTransactionComponent {
    tnx:Transaction;

    constructor(@Inject(TransactionService) private _tnxService:CrudService<Transaction>) {
        this.reset()
    }

    reset() {
        this.tnx = new Transaction();
    }

    save() {
        this._tnxService.saveItem(this.tnx);
        this.reset()
    }
}