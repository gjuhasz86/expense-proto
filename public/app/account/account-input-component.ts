import {Component, ViewChild} from '@angular/core';
import {AccountModelRelayService, AccountRelayComponent} from "./account-relay.component";
import {Account} from "./account";

@Component({
    selector: 'account-input',
    templateUrl: 'app/account/account-input.component.html'
})
export class AccountInputComponent {
    private name: string = "";

    @ViewChild(AccountRelayComponent) private readonly relay: AccountRelayComponent;

    constructor(private _relay: AccountModelRelayService) { }

    save(name: string): void {
        this._relay.save(Account.of2(name, "HUF"));
        // this._relay.save(Account.of2(accName, "HUF"));
        this.name = "";
    }
}