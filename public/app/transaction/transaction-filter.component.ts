import {Component, Output, EventEmitter, Input} from '@angular/core';
import {CompleterService, CompleterData, CompleterItem, LocalData} from 'ng2-completer';
import {Category} from "../category/category";
import {Account} from "../account/account";
import {Observable} from "rxjs";
import {CategoryModelRelayService} from "../category/category-relay.component";
import {AccountModelRelayService} from "../account/account-relay.component";

@Component({
    selector: 'transaction-filter',
    templateUrl: 'app/transaction/transaction-filter.component.html'
})
export class TransactionFilterComponent {

    private categories: Category[] = [];
    private dataService: CompleterData;
    private categorySearchStr: String;

    private catDataService$: Observable<CompleterData> = this.categoryRelay.changed.map(cs => this.createCatDataService(cs));
    private accDataService$: Observable<CompleterData> = this.accountRelay.changed.map(as => this.createAccDataService(as));


    constructor(private categoryRelay: CategoryModelRelayService,
                private accountRelay: AccountModelRelayService,
                private completerService: CompleterService) { }

    @Input() account: string;
    @Output() accountChange = new EventEmitter<string>();
    @Input() description: string;
    @Output() descriptionChange = new EventEmitter<string>();
    @Input() category: string;
    @Output() categoryChange = new EventEmitter<string>();

    @Output() filtered = new EventEmitter<void>();

    clearCategory(): void {
        this.category = null;
        this.categorySearchStr = null;
        this.categoryChange.emit(null);
    }

    createCatDataService(cats: Category[]): LocalData {
        let categories = cats.slice(0);
        let uncat = new Category("", "--Uncategorized--", null);
        uncat.name = "--Uncategorized--";
        let allCat = new Category(null, "--All--", null);
        allCat.name = "--All--";
        categories.push(uncat);
        categories.push(allCat);
        return this.completerService.local(categories, 'name', 'shortName');
    }

    createAccDataService(acc: Account[]): LocalData {
        let accounts = acc.slice(0);
        return this.completerService.local(accounts, 'name', 'name');
    }

    onCategorySelected(item?: CompleterItem): void {
        if (item != null) {
            this.category = item.originalObject.id();
            this.categoryChange.emit(this.category)
        }
    }
}