import {Injectable, Component, Input, Output, OnInit} from "@angular/core";
import {AccountReqService} from "./account-req.service";
import {Account} from "./account";
import {CommonModelRelayService} from "../common/common-model-relay.service";
import {CommonRelayComponent} from "../common/common-relay.component";


@Injectable()
export class AccountModelRelayService extends CommonModelRelayService<Account> {
    constructor(_svc: AccountReqService) { super(_svc); }
}

@Component({
    selector: "account-relay",
    template: `<div> Accounts: {{accounts | async | json}}</div>`
})
export class AccountRelayComponent extends CommonRelayComponent<Account> implements OnInit {
    @Output() accounts = this.relay.onChange;

    constructor(_relay: AccountModelRelayService) {
        super(_relay);
    }

    ngOnInit(): void {
        this.refresh();
    }


}