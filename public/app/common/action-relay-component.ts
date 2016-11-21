import {Component, Injectable, EventEmitter} from '@angular/core';
import {Category} from "../category/category";
import {Account} from "../account/account";

export class ActionRelay<T extends Cloneable> {
    edit$ = new EventEmitter<any>();

    edit(t: T): void {
        this.edit$.emit(t.clone());
    }
}

@Injectable()
export class ActionRelayService {
    account = new ActionRelay<Account>();
    category = new ActionRelay<Category>();
}

@Component({
    selector: 'action-relay',
    template: `<div>Action relay</div>`
})
export class ActionRelayComponent {

    constructor(public relay: ActionRelayService) { }


}