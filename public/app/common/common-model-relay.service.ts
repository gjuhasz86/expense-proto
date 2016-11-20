import {CrudReqService} from "./crud-req.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of"
import 'rxjs/add/operator/debounceTime'

export abstract class CommonModelRelayService<T> {

    readonly onChange = new BehaviorSubject<T[]>([]);

    protected readonly refresh$ = new ReplaySubject<void>(1);
    protected readonly save$ = new ReplaySubject<T>(1);
    protected readonly remove$ = new ReplaySubject<string>(1);

    constructor(protected _svc: CrudReqService<T>) {
        this.refresh$.debounceTime(200)
            .subscribe(x => this.doRefresh());
        this.save$
            .subscribe(a => this.doSave(a));
        this.remove$
            .subscribe(a => this.doRemove(a));
    }

    refresh() { this.refresh$.next(null); }

    save(t: T) { this.save$.next(t); }

    // remove(t: T) { this.remove$.next(acc.id()); }

    removeId(id: string) { this.remove$.next(id); }


    private doRefresh(): void {
        this._svc.list()
            .subscribe(ts => this.onChange.next(ts));
    }

    private doSave(t: T): void {
        this._svc.save(t)
            .catch(e => Observable.of(null))
            .subscribe(x => this.refresh());
    }

    private doRemove(id: string): void {
        this._svc.remove(id)
            .catch(e => Observable.of(null))
            .subscribe(x => this.refresh());
    }
}
