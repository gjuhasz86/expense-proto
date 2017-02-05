import {Component, Output, EventEmitter, Input} from '@angular/core';
import {CompleterService, CompleterData, CompleterItem} from 'ng2-completer';
import {Category} from "../category/category";

@Component({
    selector: 'transaction-filter',
    templateUrl: 'app/transaction/transaction-filter.component.html'
})
export class TransactionFilterComponent {

    private categories: Category[] = [];
    private dataService: CompleterData;
    private categorySearchStr: String;

    constructor(private completerService: CompleterService) {
    }

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

    onCategoriesChange(cats: Category[]): void {
        this.categories = cats;
        let uncat = new Category("", "--Uncategorized--", null);
        uncat.name = "--Uncategorized--";
        let allCat = new Category(null, "--All--", null);
        allCat.name = "--All--";
        this.categories.push(uncat);
        this.categories.push(allCat);
        console.log(this.categories);
        this.dataService = this.completerService.local(this.categories, 'name', 'shortName');
    }

    onCategorySelected(item?: CompleterItem): void {
        if (item != null) {
            this.category = item.originalObject.id();
            this.categoryChange.emit(this.category)
        }
    }
}