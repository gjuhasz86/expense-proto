import {Component, Injectable, EventEmitter} from '@angular/core';
import {Category} from "../category/category";
import {Account} from "../account/account";

export class ActionRelay<T> {
    edit$ = new EventEmitter<any>();

    edit(t: any): void {
        this.edit$.emit(JSON.parse(JSON.stringify(t)));
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