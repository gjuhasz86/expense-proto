import {Component, OnInit} from '@angular/core';
import {TodoService, Todo} from "./todo.service";
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';

@Component({
    selector: 'todo-list',
    templateUrl: 'app/todo/todo-list.component.html'
})
export class TodoListComponent implements OnInit {
    private todos: Observable<Todo[]> = this._todoSvc.list();

    constructor(private _todoSvc: TodoService) {
    }

    ngOnInit(): void {
        this._todoSvc.refresh();
    }

    delete(id: number, shouldDelete: boolean): void {
        if (shouldDelete) this._todoSvc.delete(id);
    }

}
