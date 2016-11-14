import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter
} from "@angular/core";
import {AccountService, CategoryService} from "../crud.service";
import {Account} from "../accounts/account";
import {Observable} from "rxjs/Observable";
import {Category} from "../categories/category";

@Component({
    selector: 'transaction-filter',
    templateUrl: 'app/transactions/transaction-filter.component.html',
    directives: []
})
export class TransactionFilterComponent implements OnInit {
    accounts: Observable<Account[]>;
    categories: Observable<Category[]>;
    categoryFilterOn: boolean;
    @Input() account: string;
    @Input() description: string;
    @Input() category: string;
    @Output() filterChange: EventEmitter<any> = new EventEmitter();

    constructor(private _accService: AccountService, private _catService: CategoryService) {
    }

    emitFilterChange() {
        let e = {
            accountId: this.account,
            description: this.description,
            category: this.category,
            categoryFilterOn: this.categoryFilterOn
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

    onCategoryChange(e) {
        this.category= e;
        this.emitFilterChange();
    }

    ngOnInit() {
        this.categories = this._catService.getAllInflatedCategories();
        this.accounts = this._accService.getAllItemsCached();
        this.accounts.subscribe((accs: Account[]) => {
            if (!this.account && accs[0]) {
                this.onAccountChange(accs[0].id());
            }
        });
    }
}