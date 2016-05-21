import {Component} from "@angular/core";
import {CategoryService} from "./crud.service";
import {Category} from "./category";

@Component({
    selector: 'new-category',
    templateUrl: 'app/new-category.component.html'
})
export class NewCategoryComponent {
    cat:Category;

    constructor(private _catService:CategoryService) {
        this.reset()
    }

    reset() {
        this.cat = new Category();
    }

    save() {
        this._catService.saveItem(this.cat);
        this.reset()
    }
}