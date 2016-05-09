import {Input, Component, Inject} from "angular2/core";
import {Transaction} from "./transaction";
import {CrudService, TransactionService, AccountService} from "./crud.service";
import {Account} from "./account";

@Component({
    selector: 'transaction',
    templateUrl: 'app/transaction.component.html',
})
export class TransactionComponent {
    @Input()
    tnx:Transaction;
    newTnx:Transaction;
    editing:boolean = false;

    constructor(@Inject(TransactionService) private _tnxService:CrudService<Transaction>,
                @Inject(AccountService) private _accService:CrudService<Account>) {
    }

    startEdit():void {
        this.newTnx = JSON.parse(JSON.stringify(this.tnx));
        this.editing = true;
    }

    stopEdit():void {
        this.editing = false;
    }

// save(tnx:Transaction):void {
//     this._expenseService.saveTransaction(tnx)
// }

    update(tnx:Transaction):void {
        console.log("updating");
        console.log(tnx);
        this._tnxService.updateItem(tnx);
    }

    delete(tnx:Transaction):void {
        this._tnxService.deleteItem(tnx);
    }


}