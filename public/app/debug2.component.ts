import {Account} from "./account";
import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {AccountService, TransactionService} from "./crud.service";
import {ReplaySubject} from "rxjs/ReplaySubject";

@Component({
    selector: 'debug2',
    templateUrl: 'app/debug2.component.html'
})
export class Debug2Component implements OnInit {
    @Input() accountId:ReplaySubject<string> = new ReplaySubject<string>(1);
    accountIdStr:string;
    @Output() accountChange:EventEmitter<any> = new EventEmitter();

    accounts:Observable<Account[]>;

    constructor(private _tnxService:TransactionService,
                private _accService:AccountService) {
        this.reset();
    }

    selected() {
        return true;
    }

    debug() {
        console.log(JSON.stringify(this.accountId));
    }

    onChange(e) {
        this.accountIdStr = e;
        // this.accountId.next(e);
        // this.accountChange.emit(e);
    }

    ngOnInit() {
        console.log("fvve33");
        this.accounts = this._accService.getAllItemsCached();
        this.accounts.subscribe((r:any[])=> {
            console.log("hc76c6");
            this.accountId.next(this.accountIdStr);
        });
    }

    reset() {
        this._accService.refresh();
    }

}