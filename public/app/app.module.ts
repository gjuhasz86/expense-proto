import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from "./app.component";
import {TodoInputComponent} from "./todo/todo-input.component";
import {TodoListComponent} from "./todo/todo-list.component";
import {TodoService} from "./todo/todo.service";
import {SelectionRelayComponent, SelectionRelayService} from "./common/selection-relay.component";
import {FormsModule} from "@angular/forms";
import {UserReqService} from "./login/user-req.service";
import {UserModelComponent, UserModelRelayService} from "./login/user-model.component";
import {LoginComponent} from "./login/login.component";
import {HttpModule} from "@angular/http";
import {ErrorLoggerService} from "./common/error-logger.service";
import {AccountReqService} from "./account/account-req.service";
import {AccountModelRelayService, AccountRelayComponent} from "./account/account-relay.component";
import {AccountListComponent} from "./account/account-list.component";
import {AccountInputComponent} from "./account/account-input-component";
import {CategoryRelayComponent, CategoryModelRelayService} from "./category/category-relay.component";
import {CategoryListComponent} from "./category/category-list.component";
import {CategoryInputComponent} from "./category/category-input.component";
import {CategoryReqService} from "./category/category-req.service";
import {CategoryPageComponent} from "./category/category-page.component";
import {ActionRelayService, ActionRelayComponent} from "./common/action-relay-component";
import {TransactionListComponent} from "./transaction/transaction-list.component";
import {TransactionInputComponent} from "./transaction/transaction-input.component";
import {TransactionReqService} from "./transaction/transaction-req.service";
import {TransactionModelRelayService, TransactionRelayComponent} from "./transaction/transaction-relay.component";
import {TransactionFilterComponent} from "./transaction/transaction-filter.component";
import {MultiSelectionService} from "./common/multi-selection.service";
import {AccountPageComponent} from "./account/account-page.component";
import {TransactionPageComponent} from "./transaction/transaction-page.component";
import {PageNotFoundComponent} from "./misc/page-not-found.component";

const appRoutes: Routes = [
    {path: 'main/accounts', component: AccountPageComponent},
    {path: 'main/categories', component: CategoryPageComponent},
    {path: 'main/transactions', component: TransactionPageComponent},
    {path: '', component: TransactionListComponent},
    {path: '**', component: PageNotFoundComponent}
];

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [
        AccountInputComponent,
        CategoryInputComponent,
        TransactionInputComponent,

        AccountRelayComponent,
        CategoryRelayComponent,
        TransactionRelayComponent,

        AccountListComponent,
        CategoryListComponent,
        TransactionListComponent,

        AccountPageComponent,
        CategoryPageComponent,
        TransactionPageComponent,

        TransactionFilterComponent,
        PageNotFoundComponent,

        AppComponent,
        TodoInputComponent,
        TodoListComponent,
        SelectionRelayComponent,
        UserModelComponent,
        LoginComponent,
        ActionRelayComponent
    ],
    providers: [
        AccountReqService,
        CategoryReqService,
        TransactionReqService,
        UserReqService,

        AccountModelRelayService,
        CategoryModelRelayService,
        TransactionModelRelayService,
        UserModelRelayService,

        MultiSelectionService,

        TodoService,
        SelectionRelayService,
        ErrorLoggerService,
        ActionRelayService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
