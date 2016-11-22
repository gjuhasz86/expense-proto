import {CrudReqService} from "./crud-req.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of"
import "rxjs/add/observable/combineLatest"
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/catch';

export interface Filter {
    page: number,
    limit: number
}
export abstract class CommonModelRelayService<T> {

    readonly changed = new BehaviorSubject<T[]>([]);

    protected readonly filter$ = new BehaviorSubject<Filter>(null);
    protected readonly refresh$ = new ReplaySubject<void>(1);
    protected readonly save$ = new ReplaySubject<T>(1);
    protected readonly update$ = new ReplaySubject<T>(1);
    protected readonly remove$ = new ReplaySubject<string>(1);

    constructor(protected _svc: CrudReqService<T>) {
        this.save$
            .subscribe(a => this.onSave(a));
        this.update$
            .subscribe(a => this.onUpdate(a));
        this.remove$
            .subscribe(a => this.onRemove(a));
        Observable.combineLatest(this.refresh$, this.filter$)
                  .debounceTime(200)
                  .subscribe(x => this.onRefresh(x[1]));
    }

    refresh() { this.refresh$.next(null); }

    save(t: T) { this.save$.next(t); }

    update(t: T) { this.update$.next(t); }

    removeId(id: string) { this.remove$.next(id); }

    filter(filt: Filter) { this.filter$.next(filt); }

    private onRefresh(filt: Filter): void {
        console.log("onRefresh" + JSON.stringify(filt));
        if (!filt) {
            this._svc.list()
                .subscribe(ts => this.changed.next(ts));
        } else {
            this._svc.search(filt.page, filt.limit)
                .subscribe(ts => this.changed.next(ts));
        }
    }

    private onSave(t: T): void {
        this._svc.save(t)
            .catch(e => Observable.of(null))
            .subscribe(x => this.refresh());
    }

    private onUpdate(t: T): void {
        this._svc.update(t)
            .catch(e => Observable.of(null))
            .subscribe(x => this.refresh());
    }

    private onRemove(id: string): void {
        this._svc.remove(id)
            .catch(e => Observable.of(null))
            .subscribe(x => this.refresh());
    }
}
