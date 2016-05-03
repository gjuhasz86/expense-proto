import {Component, Inject} from "angular2/core";
import {CrudService, AccountService} from "./crud.service";
import {Account} from "./account";

@Component({
    selector: 'new-account',
    templateUrl: 'app/new-account.component.html'
})
export class NewAccountComponent {
    acc:Account;

    constructor(@Inject(AccountService) private _accService:CrudService<Account>) {
        this.reset()
    }

    reset() {
        this.acc = new Account();
    }

    save() {
        this._accService.saveItem(this.acc);
        this.reset()
    }
}