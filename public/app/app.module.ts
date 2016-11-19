import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent}   from './app.component';
import {TodoInputComponent}   from './todo/todo-input.component';
import {TodoListComponent} from "./todo/todo-list.component";
import {TodoService} from "./todo/todo.service";
import {SelectionRelayComponent, SelectionRelayService} from "./todo/selection-relay.component";
import {FormsModule} from "@angular/forms";
import {UserReqService} from "./login/user.req.service";
import {UserModelComponent} from "./login/user-model.component";
import {LoginComponent} from "./login/login.component";
import {HttpModule} from "@angular/http";

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
        LoginComponent],
    providers: [
        TodoService,
        SelectionRelayService,
        UserReqService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
