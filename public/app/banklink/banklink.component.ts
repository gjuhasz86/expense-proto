import {Component, OnInit, EventEmitter, Output} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {PendingTransactionService} from "../crud.service";
import {Response, Http, Headers} from "@angular/http";
import {Transaction} from "../transactions/transaction";
import {ReplaySubject} from "rxjs/Rx";
import {PAGINATION_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";
import {PendingTransactionComponent} from "./pending-transaction.component";
import {AccountMapperComponent} from "./account-mapper.component";
import * as _ from "underscore"

@Component({
    selector: 'citi-loader',
    templateUrl: 'app/banklink/banklink.component.html',
    directives: [
        PendingTransactionComponent,
        AccountMapperComponent,
        PAGINATION_DIRECTIVES]
})
export class BankLinkComponent implements OnInit {
    private transactions: Observable<Transaction[]>;
    private credentials = {};
    private _headers: Headers;

    private pendingAccounts: Observable<String[]>;

    loadDisabled = false;
    page: number;
    pageSubj: ReplaySubject<number> = new ReplaySubject<number>(1);
    limit: number = 20;
    numOfTnxs: Observable<number>;

    constructor(private _http: Http,
                private _tnxService: PendingTransactionService) {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');

    }

    ngOnInit() {
        this.transactions = this._tnxService.getPage(this.pageSubj, this.limit, "date", "desc", "", undefined, undefined, false);
        this.numOfTnxs = this._tnxService.getCount();
        this.pendingAccounts = this.transactions.map((tnxs: Transaction[]) => {
            return _.chain(tnxs).map(t=>t.accountId).uniq().value();
        });

        this.refresh();
    }


    refresh() {
        this._tnxService.refresh();
        this.pageSubj.next(1);
    }

    setPage(p: any) {
        this.pageSubj.next(p.page);
    }

    loadTransactions() {
        this.loadDisabled = true;
        this._http.post('/api/banklink/citibank', JSON.stringify(this.credentials), {headers: this._headers})
            .map((res: Response) => res.json())
            .subscribe(res=> {
                console.log(res);
                this.loadDisabled = false;
                this.refresh();
            })
    }

}