import {Input, Component, Inject} from "angular2/core";
import {Transaction} from "./transaction";
import {CrudService, TransactionService} from "./crud.service";

@Component({
    selector: 'transaction',
    templateUrl: 'app/transaction.component.html',
})
export class TransactionComponent {
    @Input()
    tnx:Transaction;
    newTnx:Transaction;
    editing:boolean = false;

    constructor(@Inject(TransactionService) private _tnxService:CrudService<Transaction>) {
    }

    startEdit():void {
        this.newTnx = JSON.parse(JSON.stringify(this.tnx))
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