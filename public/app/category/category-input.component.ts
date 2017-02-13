import {Component} from '@angular/core';
import {CategoryModelRelayService} from "./category-relay.component";
import {Category} from "./category";
import {ActionRelayService} from "../common/action-relay-component";

@Component({
    selector: 'category-input',
    templateUrl: 'app/category/category-input.component.html'
})
export class CategoryInputComponent {
    private cat: any = CategoryInputComponent.empty();

    constructor(private relay: CategoryModelRelayService) { }

    private saveUpdate(cat: any): void {
        if (cat._id == null) {
            this.save(cat);
        } else {
            this.update(cat);
        }
    }

    private save(cat: any): void {
        this.relay.save(Category.parse(cat));
        this.reset();
    }


    private update(cat: any): void {
        this.relay.update(Category.parse(cat));
    }


    private reset(): void {
        this.cat = CategoryInputComponent.empty();
    }


    private static empty(): any {
        return {shortName: "", parentId: ""};
    }

}