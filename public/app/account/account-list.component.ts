import {Component} from "@angular/core";
import {Account} from "./account";
import {AccountModelRelayService} from "./account-model.component";
@Component({
    selector: "account-list",
    template: `
<account-model #accountsModel [(accounts)]="accounts"></account-model>

<input type="text" [(ngModel)]="accName" (keyup.enter)="save(accName)"/>
<button type="button" (click)="save(accName)">Save</button>

<button type="button" (click)="accountsModel.refresh()">Refresh</button>
<div>
<div *ngFor="let a of accounts">
  <button type="button" (click)="remove(a)">x</button>
  <span>{{a.name}}</span>
</div>
</div>
`
})
export class AccountListComponent {

    accName: string = "";

    constructor(private _relay: AccountModelRelayService) {

    }

    save(accName: string): void {
        this._relay.save(Account.of2(accName, "HUF"));
        this.accName = "";
    }

    remove(a: Account): void {
        this._relay.removeId(a.id());
    }
}