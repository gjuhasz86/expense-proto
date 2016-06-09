import {Component, OnInit} from "@angular/core";
import {TransactionListComponent} from "./transactions/transaction-list.component";
import {TransactionService, AccountService, CategoryService, PendingTransactionService} from "./crud.service";
import {AccountListComponent} from "./accounts/account-list.component";
import {UserService} from "./login/user.service";
import {CategoryListComponent} from "./categories/category-list.component";
import {Router, RouteConfig, ROUTER_DIRECTIVES, RouterOutlet} from "@angular/router-deprecated";
import {LoginComponent} from "./login/login.component";
import {UserInfoComponent} from "./login/user-info.component";
import {LoggedInRouterOutletDirective} from "./login/logged-in-router-outlet.directive";
import {ReportsComponent} from "./reports/reports.component";
import {ReportsService} from "./reports/reports.service";
import {DebugComponent} from "./debug.component";
import {CitiLoaderComponent} from "./banklink/citi-loader.component";

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
        PendingTransactionService,
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
    {path: '/citibank', name: 'Citibank', component: CitiLoaderComponent},
    {path: '/reports', name: 'Reports', component: ReportsComponent},
    {path: '/debugger', name: 'Debug', component: DebugComponent},
    {path: '/', name: 'Home', component: TransactionListComponent}
])
export class AppComponent implements OnInit {

    constructor(private _userService:UserService,
                private router:Router) {
    }

    ngOnInit() {
    }

}
