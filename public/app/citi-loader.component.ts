import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {PendingTransactionService} from "./crud.service";
import {Response, Http, Headers} from "@angular/http";
import {Transaction} from "./transaction";
import {ReplaySubject} from "rxjs/Rx";
import {PAGINATION_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";
import {TransactionComponent} from "./transaction.component";
import {PendingTransactionComponent} from "./pending-transaction.component";

@Component({
    selector: 'citi-loader',
    templateUrl: 'app/citi-loader.component.html',
    directives: [
        PendingTransactionComponent,
        PAGINATION_DIRECTIVES]
})
export class CitiLoaderComponent implements OnInit {
    private transactions:Observable<Transaction[]>;
    private credentials = {};
    private _headers:Headers;

    page:number;
    pageSubj:ReplaySubject<number> = new ReplaySubject<number>(1);
    limit:number = 20;
    numOfTnxs:Observable<number>;

    constructor(private _http:Http,
                private _tnxService:PendingTransactionService) {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');

    }

    ngOnInit() {
        this.transactions = this._tnxService.getPage2(this.pageSubj, this.limit, "date", "desc");
        this.numOfTnxs = this._tnxService.getCount();
        // this.transactions = this._tnxService.getAllItemsCached();
        this.refresh();
    }


    refresh() {
        this._tnxService.refresh();
        this.pageSubj.next(1);
    }

    setPage(p:any) {
        this.pageSubj.next(p.page);
    }

    loadTransactions() {
        this._http.post('/api/banklink/citibank', JSON.stringify(this.credentials), {headers: this._headers})
            .map((res:Response) => res.json())
            .subscribe(res=> {
                console.log(res);
                return res;
            })
    }
}