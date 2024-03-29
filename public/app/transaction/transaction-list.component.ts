import {Component, ElementRef, ViewChild, ViewChildren, QueryList} from '@angular/core';
import {TransactionModelRelayService} from "./transaction-relay.component";
import {Filter} from "../common/common-model-relay.service";
import {Transaction} from "./transaction";
import {MultiSelectionService} from "../common/multi-selection.service";
import {Observable} from "rxjs/Observable";
import {CompleterData, CompleterService, CompleterItem, LocalData} from "ng2-completer";
import {Category} from "../category/category";
import {CategoryModelRelayService} from "../category/category-relay.component";
import {ActionRelayService} from "../common/action-relay-component";
import {AccountModelRelayService} from "../account/account-relay.component";
import {Account} from "../account/account";

@Component({
    selector: 'transaction-list',
    templateUrl: 'app/transaction/transaction-list.component.html'
})
export class TransactionListComponent {

    private filter: Filter = {
        page: 1,
        limit: 20,
        account: null,
        description: "",
        category: null
    };

    private categoryId: String;
    private catDataService$: Observable<CompleterData> = this.categoryRelay.changed.map(cs => this.createCatDataService(cs));
    private accDataService$: Observable<CompleterData> = this.accountRelay.changed.map(as => this.createAccDataService(as));

    constructor(private relay: TransactionModelRelayService,
                private selSvc: MultiSelectionService,
                private completerService: CompleterService,
                private categoryRelay: CategoryModelRelayService,
                private accountRelay: AccountModelRelayService,
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
