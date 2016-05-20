import {Input, Component, Inject} from "angular2/core";
import {CrudService, AccountService, CategoryService} from "./crud.service";
import {Account} from "./account";
import {Category} from "./category";

@Component({
    selector: 'category',
    templateUrl: 'app/category.component.html',
})
export class CategoryComponent {
    @Input()
    cat:Category;
    newCat:Category;
    editing:boolean = false;

    constructor(private _catService:CategoryService) {
    }

    startEdit():void {
        this.newCat = JSON.parse(JSON.stringify(this.cat));
        this.editing = true;
    }

    stopEdit():void {
        this.editing = false;
    }

    update(cat:Category):void {
        this._catService.updateItem(cat);
    }

    delete(cat:Category):void {
        this._catService.deleteItem(cat);
    }


}