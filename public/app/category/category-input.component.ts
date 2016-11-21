import {Component, EventEmitter, Injectable} from '@angular/core';
import {CategoryModelRelayService} from "./category-relay.component";
import {Category} from "./category";
import {ActionRelayService} from "../common/action-relay-component";

@Component({
    selector: 'category-input',
    templateUrl: 'app/category/category-input.component.html'
})
export class CategoryInputComponent {
    cat: any = CategoryInputComponent.empty();

    constructor(private _relay: CategoryModelRelayService,
                _actionRelay: ActionRelayService) {
        _actionRelay.category.edit$.subscribe(c => (this.cat = c));
    }


    save(cat: any): void {
        this._relay.save(Category.parse(cat));
        this.reset();
    }


    update(cat: any): void {
        this._relay.update(Category.parse(cat));
    }


    private reset(): void {
        this.cat = CategoryInputComponent.empty();
    }


    static empty(): any {
        return {shortName: "", parentId: ""};
    }

}