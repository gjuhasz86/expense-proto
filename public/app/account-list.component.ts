import {Component, OnInit, Inject} from "angular2/core";
import {Observable} from "rxjs/Observable";
import {CrudService, AccountService} from "./crud.service";
import {Account} from "./account";
import {AccountComponent} from "./account.component";

@Component({
    selector: 'account-list',
    templateUrl: 'app/account-list.component.html',
    directives: [AccountComponent]
})
export class AccountListComponent implements OnInit {
    accounts:Observable<Account[]>;

    constructor(@Inject(AccountService) private _accService:CrudService<Account>) {
        this.accounts = this._accService.getAllItems();
    }

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this._accService.refresh();
    }
}