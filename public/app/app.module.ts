import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent}   from './app.component';
import {TodoInputComponent}   from './todo/todo-input.component';
import {TodoListComponent} from "./todo/todo-list.component";
import {TodoService} from "./todo/todo.service";
import {SelectionRelayComponent, SelectionRelayService} from "./todo/selection-relay.component";
import {FormsModule} from "@angular/forms";
import {UserReqService} from "./login/user-req.service";
import {UserModelComponent, UserModelRelayService} from "./login/user-model.component";
import {LoginComponent} from "./login/login.component";
import {HttpModule} from "@angular/http";
import {ErrorLoggerService} from "./common/error-logger.service";
import {AccountReqService} from "./account/account-req.service";
import {AccountModelRelayService, AccountModelComponent} from "./account/account-model.component";
import {AccountListComponent} from "./account/account-list.component";

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule],
    declarations: [
        AppComponent,
        TodoInputComponent,
        TodoListComponent,
        SelectionRelayComponent,
        UserModelComponent,
        LoginComponent,
        AccountModelComponent,
        AccountListComponent],
    providers: [
        TodoService,
        SelectionRelayService,
        UserReqService,
        UserModelRelayService,
        ErrorLoggerService,
        AccountReqService,
        AccountModelRelayService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
