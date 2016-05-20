import {Component, OnInit} from 'angular2/core';
import {NewTransactionComponent} from "./new-transaction.component";
import {TransactionListComponent} from "./transaction-list.component";
import {TransactionService, AccountService, CategoryService} from "./crud.service";
import {NewAccountComponent} from "./new-account.component";
import {AccountListComponent} from "./account-list.component";
import {UserService} from "./user.service";
import {CategoryListComponent} from "./category-list.component";
import {NewCategoryComponent} from "./new-category.component";

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [
        NewTransactionComponent,
        TransactionListComponent,
        NewAccountComponent,
        AccountListComponent,
        NewCategoryComponent,
        CategoryListComponent],
    providers: [
        UserService,
        TransactionService,
        AccountService,
        CategoryService
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
