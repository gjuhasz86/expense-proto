import {Component} from '@angular/core';
import {TransactionModelRelayService} from "./transaction-relay.component";
import {Filter} from "../common/common-model-relay.service";
import {Transaction} from "./transaction";
import {MultiSelectionService} from "../common/multi-selection.service";

@Component({
    selector: 'transaction-list',
    templateUrl: 'app/transaction/transaction-list.component.html'
})
export class TransactionListComponent {
    private filter: Filter = {
        page: 1,
        limit: 20,
        account: null,
        description: "",
        category: null
    };


    constructor(private relay: TransactionModelRelayService,
                private selSvc: MultiSelectionService) {}

    trackById(index: number, tnx: Transaction) {return index;}

    remove(id: string, selected: boolean): void {
        if (selected) {
            this.relay.removeId(id);
            this.selSvc.remove(id);
        }
    }

}