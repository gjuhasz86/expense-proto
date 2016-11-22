import {Component} from '@angular/core';
import {TransactionModelRelayService} from "./transaction-relay.component";
import {Filter} from "../common/common-model-relay.service";

@Component({
    selector: 'transaction-list',
    templateUrl: 'app/transaction/transaction-list.component.html'
})
export class TransactionListComponent {
    private filter: Filter = {page: 1, limit: 2};

    constructor(private relay: TransactionModelRelayService) {}

    delete(id: string, selected: boolean): void {
        if (selected) this.relay.removeId(id);
    }
}