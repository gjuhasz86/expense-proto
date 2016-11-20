import {Component} from "@angular/core";
import {Account} from "./account";
import {AccountModelRelayService} from "./account-model.component";
@Component({
    selector: "account-list",
    templateUrl: 'app/account/account-list.component.html'
})
export class AccountListComponent {

    constructor(private _relay: AccountModelRelayService) {}

    remove(a: Account): void {
        this._relay.removeId(a.id());
    }
}