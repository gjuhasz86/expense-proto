import {Component} from '@angular/core';
import {TransactionModelRelayService} from "./transaction-relay.component";
import {Filter} from "../common/common-model-relay.service";
import {Transaction} from "./transaction";
import {MultiSelectionService} from "../common/multi-selection.service";
import {Observable} from "rxjs";

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

    private trackById(index: number, tnx: Transaction) {return index;}

    private selectedCount(): Observable<string> {
        return this.selSvc.selected
                   .map(x => Object.keys(x).length)
                   .map(c => c == 0 ? '' : `(${c})`);
    }

    private prevPage() {
        if (this.filter.page > 1) {
            this.filter.page = this.filter.page - 1;
            this.relay.filter(this.filter);
        }
    }

    private nextPage() {
        this.filter.page = this.filter.page + 1;
        this.relay.filter(this.filter);
    }

    remove(id: string, selected: boolean): void {
        if (selected) {
            this.relay.removeId(id);
            this.selSvc.remove(id);
        }
    }

    addCategory(t: Transaction, cId: string, selected: boolean) {
        if (selected) {
            let cl = t.clone();
            cl.categories.push(cId);
            this.relay.update(cl);
        }
    }

    removeCategory(t: Transaction, cId: string, selected: boolean) {
        if (selected) {
            let cl = t.clone();
            let index = cl.categories.indexOf(cId);
            if (index > -1) {
                cl.categories.splice(index, 1);
            }
            this.relay.update(cl);
        }
    }

}