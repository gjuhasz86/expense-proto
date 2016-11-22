import {Component, Injectable, EventEmitter, Output} from '@angular/core';
import {Category} from "../category/category";
import {Account} from "../account/account";
import {Transaction} from "../transaction/transaction";

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
    transaction = new ActionRelay<Transaction>();

    deleteSelected$ = new EventEmitter<void>();
    setAllSelection$ = new EventEmitter<boolean>();

    deleteSelected() {
        this.deleteSelected$.emit(null);
    }

    setAllSelection(value: boolean) {
        this.setAllSelection$.emit(value);
    }
}

@Component({
    selector: 'action-relay',
    template: `<div *ngIf="false">Action relay</div>`
})
export class ActionRelayComponent {

    @Output() deleteSelected = this.relay.deleteSelected$;
    @Output() setAllSelection = this.relay.setAllSelection$;

    constructor(public relay: ActionRelayService) { }


}