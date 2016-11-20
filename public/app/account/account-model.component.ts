import {Injectable, Component, Input, Output, OnInit} from "@angular/core";
import {AccountReqService} from "./account-req.service";
import {Account} from "./account";
import {CommonModelRelayService} from "../common/common-model-relay.service";


@Injectable()
export class AccountModelRelayService extends CommonModelRelayService<Account> {
    constructor(_svc: AccountReqService) {
        super(_svc);
    }
}

@Component({
    selector: "account-model",
    template: `<div> Accounts: {{accounts | json}}</div>`
})
export class AccountModelComponent implements OnInit {
    @Input() accounts: Account[];
    @Output() accountsChange = this._relay.onChange;

    constructor(private _relay: AccountModelRelayService) {
        this.accountsChange.subscribe(a => (this.accounts = a));
    }

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this._relay.refresh();
    }

}