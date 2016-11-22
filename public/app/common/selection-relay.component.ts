import {Output, EventEmitter, Component, Input, Injectable} from "@angular/core";

@Injectable()
export class SelectionRelayService {
    setAll: EventEmitter<boolean> = new EventEmitter<boolean>();
    deleteSelected: EventEmitter<boolean> = new EventEmitter<boolean>();

    sendSetTo(value: boolean): void {
        this.setAll.emit(value)
    }

    sendDeleteSelected(): void {
        this.deleteSelected.emit(true);
    }
}

@Component({
    selector: "selection-relay",
    template: '<div *ngIf="false">relay: {{selected}}</div>'

})
export class SelectionRelayComponent {
    @Input() selected: boolean = false;
    @Output() selectedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output() deleteSelected: EventEmitter<boolean> = this.broadcast.deleteSelected;

    constructor(public broadcast: SelectionRelayService) {
        broadcast.setAll.subscribe(b => {
            this.selected = b;
            this.selectedChange.emit(b);
        })
    }
}