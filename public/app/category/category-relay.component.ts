import {Injectable, Component, OnInit, Output, Input} from '@angular/core';
import {CommonModelRelayService} from "../common/common-model-relay.service";
import {Category} from "./category";
import {CategoryReqService} from "./category-req.service";
import {CommonRelayComponent} from "../common/common-relay.component";

@Injectable()
export class CategoryModelRelayService extends CommonModelRelayService<Category> {
    constructor(_svc: CategoryReqService) { super(_svc); }
}


@Component({
    selector: 'category-relay',
    template: `<div> Categories: {{stringify(categories)|json}}</div>`
})
export class CategoryRelayComponent extends CommonRelayComponent<Category> implements OnInit {

    @Input() categories: Category[];
    @Output() categoriesChange = this._relay.onChange;

    constructor(_relay: CategoryModelRelayService) {
        super(_relay);
        this.categoriesChange.subscribe(c => (this.categories = c));
    }

    ngOnInit(): void {
        this.refresh();
    }

    private stringify(cats: Category[]): any[] {
        return cats.map(c => c.toSimpleObj());
    }

}