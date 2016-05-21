import {Component, OnInit} from '@angular/core';
import {NewTransactionComponent} from "./new-transaction.component";
import {TransactionListComponent} from "./transaction-list.component";
import {TransactionService, AccountService, CategoryService} from "./crud.service";
import {NewAccountComponent} from "./new-account.component";
import {AccountListComponent} from "./account-list.component";
import {UserService} from "./user.service";
import {CategoryListComponent} from "./category-list.component";
import {NewCategoryComponent} from "./new-category.component";
import {Router, Routes, ROUTER_DIRECTIVES} from '@angular/router';
import {LoginComponent} from "./login.component";
import {UserInfoComponent} from "./user-info.component";

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [
        UserInfoComponent,
        LoginComponent,
        TransactionListComponent,
        AccountListComponent,
        CategoryListComponent,
        ROUTER_DIRECTIVES],
    providers: [
        UserService,
        TransactionService,
        AccountService,
        CategoryService
    ]
})
@Routes([
    {path: '/login', component: LoginComponent},
    {path: '/accounts', component: AccountListComponent},
    {path: '/category', component: CategoryListComponent},
    {path: '/transactions', component: TransactionListComponent}
])
export class AppComponent implements OnInit {

    constructor(private _userService:UserService,
                private router:Router) {
    }

    ngOnInit() {
        // this._userService.currentUser()
        //     .subscribe(res=> {
        // this.router.navigate(['/transactions']);
        // }, err => {
        //     console.log(err);
        //     this.router.navigate(['/login']);
        // });

    }

}
