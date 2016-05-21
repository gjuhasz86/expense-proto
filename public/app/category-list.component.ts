import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {CategoryService} from "./crud.service";
import {Category} from "./category";
import {CategoryComponent} from "./category.component";
import {NewCategoryComponent} from "./new-category.component";

@Component({
    selector: 'category-list',
    templateUrl: 'app/category-list.component.html',
    directives: [
        NewCategoryComponent,
        CategoryComponent]
})
export class CategoryListComponent implements OnInit {
    categories:Observable<Category[]>;

    constructor(private _catService:CategoryService) {
    }

    ngOnInit() {
        this.categories = this._catService.getAllInflatedCategories();
    }

    refresh() {
        this._catService.refresh();
    }
}