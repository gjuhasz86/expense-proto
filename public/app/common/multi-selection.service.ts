import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class MultiSelectionService {
    private selectedVal = {};
    selected = new BehaviorSubject<any>({});

    set(id: string, value: boolean) {
        if (value) {
            this.add(id);
        } else {
            this.remove(id);
        }
    }

    add(id: string) {
        this.selectedVal[id] = true;
        this.refresh();
    }

    remove(id: string) {
        delete this.selectedVal[id];
        this.refresh();
    }

    toggle(id: string) {
        if (this.isSelected(id)) {
            this.remove(id);
        } else {
            this.add(id);
        }
    }


    refresh() {
        this.selected.next(this.selectedVal);
    }

    isSelected(id: string): boolean {
        return this.selectedVal[id] == true;
    }

}