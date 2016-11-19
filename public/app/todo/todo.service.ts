import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

export class Todo {
    id: number;
    desc: string;
    done: boolean;
}

export class TodoService {
    _todos: Todo[] = this.genTodos();
    // _todos: Todo[] = [
    //     {id: 1, desc: "create todo app", done: false},
    //     {id: 4, desc: "test some stuff", done: false},
    //     {id: 2, desc: "have dinner", done: true},
    //     {id: 8, desc: "create expense app", done: false}
    // ];

    private todos$: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);

    list(): Observable<Todo[]> {
        return this.todos$;
    }

    add(desc: string): void {
        let id = Math.floor(Math.random() * 1000) + 1;
        this._todos.push({id: id, desc: desc, done: false});
        this.refresh();
    }

    delete(id: number): void {
        let i = this._todos.findIndex(t => t.id == id);
        if (i > -1) {
            this._todos.splice(i, 1);
        }
        this.refresh();
    }

    refresh(): void {
        console.log("Refreshing todos");
        this.todos$.next(this._todos);
    }

    private genTodos(): Todo[] {
        let ts = [];
        for (let i = 0; i < 30; i++) {
            ts.push(this.genRndTodo());
        }
        return ts;
    }

    private genRndTodo(): Todo {
        let id = Math.floor(Math.random() * 1000) + 1;
        let desc = this.genStr(10);
        return {id: id, desc: desc, done: false}
    }

    private genStr(length: number): string {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
