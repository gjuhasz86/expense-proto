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
    template: `<div *ngIf="false"> Categories: {{stringify(categories|async)|json}}</div>`
})
export class CategoryRelayComponent extends CommonRelayComponent<Category> implements OnInit {

    @Output() categories = this.relay.changed;

    constructor(relay: CategoryModelRelayService) {
        super(relay);
    }

    ngOnInit(): void {
        this.refresh();
    }

    private stringify(cats: Category[]): any[] {
        return cats.map(c => c.clone());
    }

}