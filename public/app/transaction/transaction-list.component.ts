import {Component, ElementRef, ViewChild, ViewChildren, QueryList} from '@angular/core';
import {TransactionModelRelayService} from "./transaction-relay.component";
import {Filter} from "../common/common-model-relay.service";
import {Transaction} from "./transaction";
import {MultiSelectionService} from "../common/multi-selection.service";
import {Observable} from "rxjs";
import {CompleterData, CompleterService, CompleterItem, LocalData} from "ng2-completer";
import {Category} from "../category/category";
import {CategoryModelRelayService} from "../category/category-relay.component";
import {ActionRelayService} from "../common/action-relay-component";

@Component({
    selector: 'transaction-list',
    templateUrl: 'app/transaction/transaction-list.component.html'
})
export class TransactionListComponent {

    @ViewChildren('completer') test: QueryList<any>;

    debug(x: any): void {
        console.log(this.elementRef.nativeElement);
    }

    private filter: Filter = {
        page: 1,
        limit: 20,
        account: null,
        description: "",
        category: null
    };

    private categoryId: String;
    private categories: Category[] = [];
    private catDataService$: Observable<CompleterData> = this.categoryRelay.changed.map(cs => this.createDataService(cs));

    constructor(private relay: TransactionModelRelayService,
                private selSvc: MultiSelectionService,
                private completerService: CompleterService,
                private categoryRelay: CategoryModelRelayService,
                private elementRef: ElementRef,
                private actionRelay: ActionRelayService) { }

    private trackById(index: number, tnx: Transaction) {return index;}

    private clearSelection(): void {
        this.selSvc.clear();
    }

    private selectedCount(): Observable<string> {
        return this.selSvc.selected
                   .map(x => Object.keys(x).length)
                   .map(c => c == 0 ? '' : `(${c})`);
    }

    private prevPage() {
        let page = parseInt(this.filter.page.toString());
        if (page > 1) {
            this.filter.page = page - 1;
            this.relay.filter(this.filter);
        }
    }

    private nextPage() {
        let page = parseInt(this.filter.page.toString());
        this.filter.page = page + 1;
        this.relay.filter(this.filter);
    }

    createDataService(cats: Category[]): LocalData {
        this.categories = cats.slice(0);
        let uncat = new Category("", "--Uncategorized--", null);
        uncat.name = "--Uncategorized--";
        let allCat = new Category(null, "--All--", null);
        allCat.name = "--All--";
        this.categories.push(uncat);
        this.categories.push(allCat);
        return this.completerService.local(this.categories, 'name', 'shortName');
    }

    onCategorySelected(item?: CompleterItem): void {
        if (item != null) {
            this.categoryId = item.originalObject.id();
        }
    }

    remove(id: string, selected: boolean): void {
        if (selected) {
            this.relay.removeId(id);
            this.selSvc.remove(id);
        }
    }

    addCategoryInline(t: Transaction, item?: CompleterItem): void {
        if (item != null) {
            let cl = t.clone();
            cl.categories.push(item.originalObject.id());
            this.actionRelay.transaction.edit(cl);
        }
    }

    removeCategoryInline(t: Transaction, cId: string): void {
        console.log(t);
        let cl = t.clone();
        let index = cl.categories.indexOf(cId);
        if (index > -1) {
            cl.categories.splice(index, 1);
        }
        this.actionRelay.transaction.edit(cl);
    }

    addCategory(t: Transaction, cId: string, selected: boolean) {
        if (selected) {
            let cl = t.clone();
            cl.categories.push(cId);
            this.relay.update(cl);
        }
    }

    removeCategory(t: Transaction, cId: string, selected: boolean) {
        if (selected) {
            let cl = t.clone();
            let index = cl.categories.indexOf(cId);
            if (index > -1) {
                cl.categories.splice(index, 1);
            }
            this.relay.update(cl);
        }
    }

    private parseDate(dateStr: string): Date {
        if (dateStr) {
            return new Date(dateStr);
        } else {
            return null;
        }
    }

}
