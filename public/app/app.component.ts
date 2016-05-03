import {Component, provide, Inject, Optional} from 'angular2/core';
import {NewTransactionComponent} from "./new-transaction.component";
import {TransactionListComponent} from "./transaction-list.component";
import {CrudService, TransactionService, AccountService} from "./crud.service";
import {Transaction} from "./transaction";
import {Http} from "angular2/http";
import {NewAccountComponent} from "./new-account.component";
import {AccountListComponent} from "./account-list.component";
import {Account} from "./account";


@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [
        NewTransactionComponent,
        TransactionListComponent,
        NewAccountComponent,
        AccountListComponent],
    providers: [
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
export class AppComponent {
}
