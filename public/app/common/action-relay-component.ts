import {Component, Injectable, EventEmitter, Output} from '@angular/core';
import {Category} from "../category/category";
import {Account} from "../account/account";
import {Transaction} from "../transaction/transaction";

export class ActionRelay<T extends Cloneable> {
    edit$ = new EventEmitter<any>();

    edit(t: T): void {
        this.edit$.emit(t.clone());
    }

    stopEdit(): void {
        this.edit$.emit(null);
    }

}

@Injectable()
export class ActionRelayService {
    account = new ActionRelay<Account>();
    category = new ActionRelay<Category>();
    transaction = new ActionRelay<Transaction>();

    deleteSelected$ = new EventEmitter<void>();
    invertSelection$ = new EventEmitter<void>();
    setAllSelection$ = new EventEmitter<boolean>();

    addCategory$ = new EventEmitter<string>();
    removeCategory$ = new EventEmitter<string>();

    deleteSelected() {
        this.deleteSelected$.emit(null);
    }

    invertSelection() {
        this.invertSelection$.emit(null);
    }

    setAllSelection(value: boolean) {
        this.setAllSelection$.emit(value);
    }

    addCategory(id: string) {
        this.addCategory$.emit(id);
    }

    removeCategory(id: string) {
        this.removeCategory$.emit(id);
    }
}

@Component({
    selector: 'action-relay',
    template: `<div *ngIf="false">Action relay</div>`
})
export class ActionRelayComponent {

    @Output() deleteSelected = this.relay.deleteSelected$;
    @Output() invertSelection = this.relay.invertSelection$;
    @Output() setAllSelection = this.relay.setAllSelection$;

    @Output() addCategory = this.relay.addCategory$;
    @Output() removeCategory = this.relay.removeCategory$;

    constructor(public relay: ActionRelayService) { }


}