import {Component, provide, Inject, Optional, OnInit, Input} from 'angular2/core';
import {NewTransactionComponent} from "./new-transaction.component";
import {TransactionListComponent} from "./transaction-list.component";
import {CrudService, TransactionService, AccountService} from "./crud.service";
import {Transaction} from "./transaction";
import {Http, Headers} from "angular2/http";
import {NewAccountComponent} from "./new-account.component";
import {AccountListComponent} from "./account-list.component";
import {Account} from "./account";
import {UserService} from "./user.service";

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [
        NewTransactionComponent,
        TransactionListComponent,
        NewAccountComponent,
        AccountListComponent],
    providers: [
        UserService,
        provide(TransactionService, {
            useFactory: (http:Http) => {
                return new CrudService<Transaction>("transactions", http);
            },
            deps: [Http]
        }),
        provide(AccountService, {
            useFactory: (http:Http) => {
                return new CrudService<Account>("accounts", http);
            },
            deps: [Http]
        })
    ]
})
export class AppComponent implements OnInit {
    public user:any = false;
    public loginData:any = {};

    constructor(private _userService:UserService) {
    }

    ngOnInit() {
        this._userService.currentUser()
            .subscribe(res=> {
                this.user = res.json()
            }, err => console.log(err));
    }

    login() {
        this._userService.login(this.loginData)
            .subscribe(res=> this.user = res.json());
    }

    logout() {
        this._userService.logout()
            .subscribe(res=> this.user = undefined);
    }
}
