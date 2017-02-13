import {Component} from '@angular/core';
import {AccountModelRelayService} from "./account-relay.component";
import {Account} from "./account";
import {ActionRelayService} from "../common/action-relay-component";

@Component({
    selector: 'account-input',
    templateUrl: 'app/account/account-input.component.html'
})
export class AccountInputComponent {
    private acc: any = AccountInputComponent.empty();

    constructor(private relay: AccountModelRelayService) {}

    private saveUpdate(acc: any): void {
        if (acc._id == null) {
            this.save(acc);
        } else {
            this.update(acc);
        }
    }

    private save(acc: any): void {
        this.relay.save(Account.parse(acc));
        this.reset();
    }

    private update(acc: any): void {
        this.relay.update(Account.parse(acc));
    }

    private reset(): void {
        this.acc = AccountInputComponent.empty();
    }

    private static empty(): any {
        return {
            name: "",
            initialBalance: 0,
            currency: "HUF",
            precision: 0
        };
    }
}