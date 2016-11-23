import {Component} from '@angular/core';

@Component({
    selector: 'transaction-page',
    template: `
<transaction-input></transaction-input>
<transaction-list></transaction-list>
`
})
export class TransactionPageComponent {
}