import {Injectable, Component, Input, Output, OnInit} from "@angular/core";
import {AccountReqService} from "./account-req.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Account} from "./account";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs";

@Injectable()
export class AccountModelRelayService {

    readonly accountChange = new BehaviorSubject<Account[]>([]);

    private readonly refresh$ = new ReplaySubject<boolean>();
    private readonly save$ = new ReplaySubject<Account>();
    private readonly remove$ = new ReplaySubject<string>();

    constructor(private _svc: AccountReqService) {
        this.refresh$.debounceTime(200)
            .subscribe(x => this.doRefresh());
        this.save$
            .subscribe(a => this.doSave(a));
        this.remove$
            .subscribe(a => this.doRemove(a));
    }

    refresh() {
        this.refresh$.next(true);
    }

    save(a: Account) {
        this.save$.next(a);
    }

    remove(acc: Account) {
        this.remove$.next(acc.id());
    }

    removeId(id: string) {
        this.remove$.next(id);
    }


    private doRefresh(): void {
        this._svc.list()
            .subscribe(a => this.accountChange.next(a));
    }

    private doSave(a: Account): void {
        this._svc.save(a)
            .catch(e => null)
            .subscribe(x => this.refresh());
    }

    private doRemove(id: string): void {
        this._svc.remove(id)
            .subscribe(x => this.refresh());
    }

}

@Component({
    selector: "account-model",
    template: `<div> Accounts: {{accounts | json}}</div>`
})
export class AccountModelComponent implements OnInit {
    @Input() accounts: Account[];
    @Output() accountsChange = this._relay.accountChange;

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