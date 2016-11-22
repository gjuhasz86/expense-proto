import {Component, Output, EventEmitter, Input} from '@angular/core';

@Component({
    selector: 'transaction-filter',
    templateUrl: 'app/transaction/transaction-filter.component.html'
})
export class TransactionFilterComponent {

    @Input() account: string;
    @Output() accountChange = new EventEmitter<string>();
    @Input() description: string;
    @Output() descriptionChange = new EventEmitter<string>();
    @Input() category: string;
    @Output() categoryChange = new EventEmitter<string>();

    @Output() filtered = new EventEmitter<void>();

    clearCategory(): void {
        this.category = null;
        this.categoryChange.emit(null);
    }
}