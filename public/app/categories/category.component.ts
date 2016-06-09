import {Input, Component} from "@angular/core";
import {CategoryService} from "../crud.service";
import {Category} from "./category";

@Component({
    selector: '[category]',
    templateUrl: 'app/categories/category.component.html',
})
export class CategoryComponent {
    @Input()
    cat:Category;
    newCat:Category;
    editing:boolean = false;

    constructor(private _catService:CategoryService) {
    }

    startEdit():void {
        this.newCat = <Category>{
            _id: this.cat._id,
            shortName: this.cat.shortName,
            parentId: this.cat.parentId
        };
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