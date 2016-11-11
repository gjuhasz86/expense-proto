import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter
} from "@angular/core";
import {AccountService} from "../crud.service";
import {Account} from "../accounts/account";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'transaction-filter',
    templateUrl: 'app/transactions/transaction-filter.component.html',
    directives: []
})
export class TransactionFilterComponent implements OnInit {
    accounts:Observable<Account[]>;
    @Input() account:string;
    @Input() description:string;
    @Output() filterChange:EventEmitter<any> = new EventEmitter();

    constructor(private _accService:AccountService) {
    }

    emitFilterChange() {
        let e = {
            accountId: this.account,
            description: this.description
        };
        this.filterChange.emit(e);
    }

    onAccountChange(e) {
        this.account = e;
        this.emitFilterChange();
    }

    onDesriptionChange(e) {
        this.description = e;
        this.emitFilterChange();
    }

    ngOnInit() {
        this.accounts = this._accService.getAllItemsCached();
        this.accounts.subscribe((accs:Account[]) => {
            if (!this.account && accs[0]) {
                this.onAccountChange(accs[0].id());
            }
        });
    }
}