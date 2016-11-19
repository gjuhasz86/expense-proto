import {Component} from '@angular/core';
import {TodoService} from "./todo.service";

@Component({
    selector: 'todo-input',
    templateUrl: 'app/todo/todo-input.component.html'
})
export class TodoInputComponent {
    desc: string;

    constructor(private _todoSvc: TodoService) {
    }

    add(desc: string): void {
        this._todoSvc.add(desc);
        this.desc = "";
    }
}
