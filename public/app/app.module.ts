import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent}   from './app.component';
import {TodoInputComponent}   from './todo/todo-input.component';
import {TodoListComponent} from "./todo/todo-list.component";
import {TodoService} from "./todo/todo.service";
import {SelectionRelayComponent, SelectionRelayService} from "./todo/selection-relay.component";
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule],
    declarations: [
        AppComponent,
        TodoInputComponent,
        TodoListComponent,
        SelectionRelayComponent],
    providers: [
        TodoService,
        SelectionRelayService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
