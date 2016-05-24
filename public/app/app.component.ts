import {Component, OnInit} from "@angular/core";
import {TransactionListComponent} from "./transaction-list.component";
import {TransactionService, AccountService, CategoryService} from "./crud.service";
import {AccountListComponent} from "./account-list.component";
import {UserService} from "./user.service";
import {CategoryListComponent} from "./category-list.component";
import {Router, RouteConfig, ROUTER_DIRECTIVES, RouterOutlet} from "@angular/router-deprecated";
import {LoginComponent} from "./login.component";
import {UserInfoComponent} from "./user-info.component";
import {LoggedInRouterOutletDirective} from "./logged-in-router-outlet.directive";
import {ReportsComponent} from "./reports.component";
import {ReportsService} from "./reports.service";

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [
        UserInfoComponent,
        LoginComponent,
        TransactionListComponent,
        AccountListComponent,
        CategoryListComponent,
        ROUTER_DIRECTIVES.filter(d=>d != RouterOutlet),
        LoggedInRouterOutletDirective,
    ],
    providers: [
        UserService,
        TransactionService,
        AccountService,
        CategoryService,
        ReportsService
    ]
})
@RouteConfig([
    {path: '/login', name: 'Login', component: LoginComponent},
    {path: '/accounts', name: 'Accounts', component: AccountListComponent},
    {path: '/categories', name: 'Categories', component: CategoryListComponent},
    {path: '/transactions', name: 'Transactions', component: TransactionListComponent},
    {path: '/reports', name: 'Reports', component: ReportsComponent},
    {path: '/', name: 'Home', component: ReportsComponent}
])
export class AppComponent implements OnInit {

    constructor(private _userService:UserService,
                private router:Router) {
    }

    ngOnInit() {
    }

}
