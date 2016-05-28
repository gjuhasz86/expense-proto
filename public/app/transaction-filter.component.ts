import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter
} from "@angular/core";
import {AccountService} from "./crud.service";
import {Account} from "./account";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'transaction-filter',
    templateUrl: 'app/transaction-filter.component.html',
    directives: []
})
export class TransactionFilterComponent implements OnInit {
    accounts:Observable<Account[]>;
    @Input() account:string;
    @Output() accountChange:EventEmitter<any> = new EventEmitter();

    constructor(private _accService:AccountService) {
    }

    onChange(e) {
        this.account = e;
        this.accountChange.emit(e);
    }

    ngOnInit() {
        this.accounts = this._accService.getAllItemsCached();
        this.accounts.subscribe((accs:Account[]) => {
            if (!this.account && accs[0]) {
                this.onChange(accs[0].id());
            }
        });
    }
}