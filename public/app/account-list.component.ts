import {Component, OnInit, Inject} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {AccountService} from "./crud.service";
import {Account} from "./account";
import {AccountComponent} from "./account.component";
import {NewAccountComponent} from "./new-account.component";

@Component({
    selector: 'account-list',
    templateUrl: 'app/account-list.component.html',
    directives: [
        NewAccountComponent,
        AccountComponent]
})
export class AccountListComponent implements OnInit {
    accounts:Observable<Account[]>;

    constructor(private _accService:AccountService) {
    }

    ngOnInit() {
        this.accounts = this._accService.getAllItemsCached();
        this.refresh();
    }

    refresh() {
        this._accService.refresh();
    }
}