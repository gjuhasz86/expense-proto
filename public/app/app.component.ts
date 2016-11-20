import {Component} from '@angular/core';
@Component({
    selector: 'my-app',
    template: `
<h1>Hello Angular!</h1>
<login></login>
<hr>
<category-page></category-page>
<hr>
<account-input></account-input>
<account-list></account-list>
<hr>
<todo-input></todo-input>
<todo-list></todo-list>

`
})
export class AppComponent {
}
