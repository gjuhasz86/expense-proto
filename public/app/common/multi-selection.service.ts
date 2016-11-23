import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class MultiSelectionService {
    private selectedVal = {};
    selected = new BehaviorSubject<any>({});

    add(id: string) {
        console.log(`selecting ${id}`);
        this.selectedVal[id] = true;
        this.refresh();
    }

    remove(id: string) {
        console.log(`selecting ${id}`);
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