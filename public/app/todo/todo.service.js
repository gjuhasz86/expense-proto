"use strict";
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Todo = (function () {
    function Todo() {
    }
    return Todo;
}());
exports.Todo = Todo;
var TodoService = (function () {
    function TodoService() {
        this._todos = this.genTodos();
        // _todos: Todo[] = [
        //     {id: 1, desc: "create todo app", done: false},
        //     {id: 4, desc: "test some stuff", done: false},
        //     {id: 2, desc: "have dinner", done: true},
        //     {id: 8, desc: "create expense app", done: false}
        // ];
        this.todos$ = new BehaviorSubject_1.BehaviorSubject([]);
    }
    TodoService.prototype.list = function () {
        return this.todos$;
    };
    TodoService.prototype.add = function (desc) {
        var id = Math.floor(Math.random() * 1000) + 1;
        this._todos.push({ id: id, desc: desc, done: false });
        this.refresh();
    };
    TodoService.prototype.delete = function (id) {
        var i = this._todos.findIndex(function (t) { return t.id == id; });
        if (i > -1) {
            this._todos.splice(i, 1);
        }
        this.refresh();
    };
    TodoService.prototype.refresh = function () {
        console.log("Refreshing todos");
        this.todos$.next(this._todos);
    };
    TodoService.prototype.genTodos = function () {
        var ts = [];
        for (var i = 0; i < 3000; i++) {
            ts.push(this.genRndTodo());
        }
        return ts;
    };
    TodoService.prototype.genRndTodo = function () {
        var id = Math.floor(Math.random() * 1000) + 1;
        var desc = this.genStr(10);
        return { id: id, desc: desc, done: false };
    };
    TodoService.prototype.genStr = function (length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
    return TodoService;
}());
exports.TodoService = TodoService;
//# sourceMappingURL=todo.service.js.map