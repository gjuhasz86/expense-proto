import {Component, ViewChild} from '@angular/core';
import {Transaction} from "./transaction";
import {TransactionRelayComponent} from "./transaction-relay.component";
import {LocalData, CompleterService, CompleterData} from "ng2-completer";
import {Account} from "../account/account";
import {AccountModelRelayService} from "../account/account-relay.component";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'transaction-input',
    templateUrl: 'app/transaction/transaction-input.component.html'
})
export class TransactionInputComponent {
    private tnx: any = TransactionInputComponent.empty();

    @ViewChild(TransactionRelayComponent) private readonly relay: TransactionRelayComponent;


    private accDataService$: Observable<CompleterData> = this.accountRelay.changed.map(as => this.createAccDataService(as));

    constructor(private accountRelay: AccountModelRelayService,
                private completerService: CompleterService) {
    }

    createAccDataService(acc: Account[]): LocalData {
        let accounts = acc.slice(0);
        return this.completerService.local(accounts, 'name', 'name');
    }

    save() {
        this.relay.save(Transaction.parse(this.tnx));
        this.reset();
    }

    update() {
        this.relay.update(Transaction.parse(this.tnx));
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