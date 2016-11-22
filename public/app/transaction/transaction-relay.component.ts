import {Component, Output, Injectable, OnInit, Input, OnChanges} from '@angular/core';
import {CommonModelRelayService, Filter} from "../common/common-model-relay.service";
import {Transaction} from "./transaction";
import {TransactionReqService} from "./transaction-req.service";
import {CommonRelayComponent} from "../common/common-relay.component";

@Injectable()
export class TransactionModelRelayService extends CommonModelRelayService<Transaction> {
    constructor(svc: TransactionReqService) { super(svc); }

}

@Component({
    selector: 'transaction-relay',
    template: `<div *ngIf="false"> Transactions: {{transactions | async | json}}</div>`
})
export class TransactionRelayComponent extends CommonRelayComponent<Transaction> implements OnInit {
    @Input('filter') filterField: Filter;
    @Output() transactions = this.relay.changed;


    constructor(relay: TransactionModelRelayService) {
        super(relay);
    }

    ngOnInit(): void {
        this.filter(this.filterField);
        this.refresh();
    }

    //TODO change name
    sendFilter() {
        this.filter(this.filterField);
    }


}