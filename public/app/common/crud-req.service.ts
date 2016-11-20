import {Http, Headers} from "@angular/http";
import {ErrorLoggerService} from "./error-logger.service";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/throw";

export abstract class CrudReqService<T> {
    private static readonly _headers = {headers: CrudReqService.genHeaders()};

    constructor(protected coll: String,
                protected http: Http,
                protected errLog: ErrorLoggerService) {
    }

    list(): Observable<T[]> {
        return this.http.post(`/api/${this.coll}/list`, '{}', CrudReqService._headers)
                   .map(res => res.json() as T[])
                   .map(json => json.map(this.parse))
                   .catch(err => {
                       this.errLog.log(`Could not list items [${this.coll}]`, err);
                       return Observable.of([]);
                   });
    }

    save(item: T): Observable<void> {
        return this.http.post(`/api/${this.coll}/save`, JSON.stringify(item), CrudReqService._headers)
                   .catch(err => {
                       this.errLog.log(`Could not save item [${this.coll}]`, err);
                       return Observable.throw(err);
                   });
    }

    update(item: T): Observable<void> {
        return this.http.post(`/api/${this.coll}/update`, JSON.stringify(item), CrudReqService._headers)
                   .catch(err => {
                       this.errLog.log(`Could not save item [${this.coll}]`, err);
                       return Observable.throw(err);
                   });
    }

    remove(id: string): Observable<void> {
        let obj = {_id: id};
        return this.http.post(`/api/${this.coll}/delete`, JSON.stringify(obj), CrudReqService._headers)
                   .catch(err => {
                       this.errLog.log(`Could not save item [${this.coll}]`, err);
                       return Observable.throw(err);
                   });
    }

    abstract parse(json: T): T


    private static genHeaders(): Headers {
        let h = new Headers();
        h.append('Content-Type', 'application/json');
        return h;
    }
}