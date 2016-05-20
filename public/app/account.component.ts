import {Input, Component, Inject} from "angular2/core";
import {CrudService, AccountService} from "./crud.service";
import {Account} from "./account";

@Component({
    selector: 'account',
    templateUrl: 'app/account.component.html',
})
export class AccountComponent {
    @Input()
    acc:Account;
    newAcc:Account;
    editing:boolean = false;

    constructor(private _accService:AccountService) {
    }

    startEdit():void {
        this.newAcc = JSON.parse(JSON.stringify(this.acc));
        this.editing = true;
    }

    stopEdit():void {
        this.editing = false;
    }

    update(acc:Account):void {
        this._accService.updateItem(acc);
    }

    delete(acc:Account):void {
        this._accService.deleteItem(acc);
    }


}