import {Component, EventEmitter, Output, Injectable} from "@angular/core";
import {Category} from "../categories/category";

@Injectable()
export class TransactionControlService {
    addCategory: EventEmitter<any> = new EventEmitter();
    remCategory: EventEmitter<any> = new EventEmitter();
    setSelection: EventEmitter<any> = new EventEmitter();
}

@Component({
    selector: 'transaction-control',
    template: `<div></div>`
})
export class TransactionControlComponent {
    @Output() addCategory: EventEmitter<any> = this._ctrlSvc.addCategory;
    @Output() remCategory: EventEmitter<any> = this._ctrlSvc.remCategory;
    @Output() setSelection: EventEmitter<any> = this._ctrlSvc.setSelection;

    constructor(private _ctrlSvc: TransactionControlService) {
    }


    public sendAddCategory(c: string) {
        console.log("TnxCtrl emitting: " + c);
        this.addCategory.emit(c);
    }


    public sendRemCategory(c: string) {
        console.log("TnxCtrl emitting: " + c);
        this.remCategory.emit(c);
    }

    public sendSetSelection(b: boolean) {
        console.log("TnxCtrl emitting: " + b);
        this.setSelection.emit(b);
    }
}
