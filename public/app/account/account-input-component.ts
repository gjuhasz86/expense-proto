import {Component} from '@angular/core';
import {AccountModelRelayService} from "./account-model.component";
import {Account} from "./account";

@Component({
    selector: 'account-input',
    templateUrl: 'app/account/account-input.component.html'
})
export class AccountInputComponent {
    private accName: string = "";

    constructor(private _relay: AccountModelRelayService) { }

    save(accName: string): void {
        this._relay.save(Account.of2(accName, "HUF"));
        this.accName = "";
    }
}