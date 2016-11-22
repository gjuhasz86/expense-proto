import {Component} from '@angular/core';
import {ActionRelayService} from "../common/action-relay-component";
import {TransactionModelRelayService} from "./transaction-relay.component";

@Component({
    selector: 'transaction-list',
    templateUrl: 'app/transaction/transaction-list.component.html'
})
export class TransactionListComponent {

    constructor(private relay: TransactionModelRelayService) {}

    delete(id: string, selected: boolean): void {
        if (selected) this.relay.removeId(id);
    }
}