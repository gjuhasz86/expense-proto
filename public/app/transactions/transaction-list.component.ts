import {Component, OnInit, Inject} from "@angular/core";
import {TransactionComponent} from "./transaction.component";
import {Observable} from "rxjs/Observable";
import {Transaction} from "./transaction";
import {TransactionService, CategoryService} from "../crud.service";
import * as _ from 'underscore';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {NewTransactionComponent} from "./new-transaction.component";
import {PAGINATION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap'
import {TransactionFilterComponent} from "./transaction-filter.component";
import {Debug2Component} from "../debug2.component";
import {TransactionControlComponent, TransactionControlService} from "./transaction-control.component";
import {Category} from "../categories/category";

@Component({
    selector: 'transaction-list',
    templateUrl: 'app/transactions/transaction-list.component.html',
    directives: [
        NewTransactionComponent,
        TransactionComponent,
        TransactionFilterComponent,
        Debug2Component,
        PAGINATION_DIRECTIVES,
        TransactionControlComponent
    ],
    providers: [TransactionControlService]
})
export class TransactionListComponent implements OnInit {
    transactions: Observable<Transaction[]>;
    page: number;
    pageSubj: ReplaySubject<number> = new ReplaySubject<number>(1);
    limit: number = 20;
    pages: Observable<number[]>;
    numOfTnxs: Observable<number>;
    defaultAccount: string;//= "574218a2fa58b0b820f5b936";
    descriptionRegex: string = "";
    defaultCategory: string;
    categories: Observable<Category[]>;
    allSelected: boolean;

    constructor(private _tnxService: TransactionService, private _catService: CategoryService) {
    }

    ngOnInit() {
        this.transactions = this._tnxService.getPage(this.pageSubj, this.limit, "date", "desc", this.defaultAccount, this.descriptionRegex, this.defaultCategory, false)
        this.pages = this.genPages();
        this.numOfTnxs = this._tnxService
            .getSize(
                this.pageSubj,
                this.limit,
                "date",
                "desc",
                this.defaultAccount,
                this.descriptionRegex,
                this.defaultCategory,
                false);
        this.categories = this._catService.getAllInflatedCategories();
        this.refresh();
    }

    refresh() {
        this._tnxService.refresh();
        this._catService.refresh();
        this.pageSubj.next(1);
    }

    onLimitChange(e) {
        this.limit = e;
        this.transactions = this._tnxService
            .getPage(
                this.pageSubj,
                this.limit,
                "date",
                "desc",
                this.defaultAccount,
                this.descriptionRegex,
                this.defaultCategory,
                false);
    }

    onFilterChanged(e): void {
        this.defaultAccount = e.accountId;
        this.descriptionRegex = e.description;
        this.defaultCategory = e.category;
        this.transactions = this._tnxService
            .getPage(
                this.pageSubj,
                this.limit,
                "date",
                "desc",
                this.defaultAccount,
                this.descriptionRegex,
                this.defaultCategory,
                e.categoryFilterOn);
        this.numOfTnxs = this._tnxService
            .getSize(
                this.pageSubj,
                this.limit,
                "date",
                "desc",
                this.defaultAccount,
                this.descriptionRegex,
                this.defaultCategory,
                e.categoryFilterOn);
        this.refresh();
    }

    genPages(): Observable < number[] > {
        return this.pageSubj.map(p=> {
            let first = Math.max(1, p - 2);
            let last = first + 5;
            return _.range(first, last)
        })
    }

    setPage(p: any) {
        this.pageSubj.next(p.page);
    }

    toggleSelection() {
        this.allSelected = !this.allSelected;

    }
}