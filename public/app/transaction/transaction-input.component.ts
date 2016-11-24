import {Component, ViewChild} from '@angular/core';
import {Transaction} from "./transaction";
import {TransactionRelayComponent} from "./transaction-relay.component";
import {ActionRelayService} from "../common/action-relay-component";

@Component({
    selector: 'transaction-input',
    templateUrl: 'app/transaction/transaction-input.component.html'
})
export class TransactionInputComponent {
    private tnx: any = TransactionInputComponent.empty();

    @ViewChild(TransactionRelayComponent) private readonly relay: TransactionRelayComponent;

    constructor(actionRelay: ActionRelayService) {
        actionRelay.transaction.edit$.subscribe(t => (this.tnx = t));
    }

    save() {
        this.relay.save(this.tnx);
        this.reset();
    }

    update() {
        this.relay.update(this.tnx);
    }

    reset() {
        this.tnx = TransactionInputComponent.empty();
    }

    private static empty(): any {
        return Transaction.parse({
            description: "",
            amount: "",
            date: new Date()
        })
    }

    private parseDate(dateStr: string): Date {
        if (dateStr) {
            return new Date(dateStr);
        } else {
            return null;
        }
    }
}