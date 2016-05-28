import {Component} from "@angular/core";
import {AccountService} from "./crud.service";
import {Account} from "./account";

@Component({
    selector: 'new-account',
    templateUrl: 'app/new-account.component.html'
})
export class NewAccountComponent {
    acc:Account;

    constructor(private _accService:AccountService) {
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