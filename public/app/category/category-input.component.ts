import {Component} from '@angular/core';
import {CategoryModelRelayService} from "./category-relay.component";
import {Category} from "./category";

@Component({
    selector: 'category-input',
    templateUrl: 'app/category/category-input.component.html'
})
export class CategoryInputComponent {
    name: string = "";
    pId: string = "";

    constructor(private _relay: CategoryModelRelayService) { }

    save(n: string, p: string): void {
        this._relay.save(Category.of2(n, p && p != "" ? p : null));
        this.name = "";
        this.pId = "";
    }

}