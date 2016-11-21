import {Component, Output, Injectable, OnInit} from '@angular/core';
import {CommonModelRelayService} from "../common/common-model-relay.service";
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
    @Output() transactions = this.relay.changed;

    constructor(relay: TransactionModelRelayService) {
        super(relay);
    }

    ngOnInit(): void {
        this.refresh();
    }

}