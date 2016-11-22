import {Http, Headers} from "@angular/http";
import {ErrorLoggerService} from "./error-logger.service";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/throw";
import {Filter} from "./common-model-relay.service";


class FilterImpl implements Filter {
    constructor(public readonly page: number,
                public readonly limit: number,
                public readonly account: string,
                public readonly description: string,
                public readonly category: string) {}

    static of(f: Filter): Filter {
        return new FilterImpl(
            f.page,
            f.limit,
            f.account == "" ? null : f.account,
            f.description == "" ? null : f.description,
            f.category)
    }
}

export abstract class CrudReqService<T> {
    private static readonly _headers = {headers: CrudReqService.genHeaders()};

    constructor(public coll: String,
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


    search(f0: Filter): Observable<T[]> {
        let z = (o: any) => { return o == undefined };
        let f = FilterImpl.of(f0);

        let skip = f.limit * (f.page - 1);
        let qSkip = `skip=${skip}`;
        let qLimit = `limit=${f.limit}`;

        let qSort = `sort=date`;
        let qOrder = `order=desc`;

        let qAccount = z(f.account) ? "" : `account=${f.account}`;
        let qDesc = z(f.description) ? "" : `description=${f.description}`;
        let qCategory = z(f.category) ? "" : `category=${f.category}`;

        return this.http.get(`/api/${this.coll}/search?${qSkip}&${qLimit}&${qSort}&${qOrder}&${qAccount}&${qDesc}&${qCategory}`)
                   .map(res => res.json() as T[])
                   .map(json => json.map(this.parse))
                   .catch(err => {
                       this.errLog.log(`Could not list items [${this.coll}]`, err);
                       return Observable.of([]);
                   });
    }

    abstract parse(json: T): T


    private static genHeaders(): Headers {
        let h = new Headers();
        h.append('Content-Type', 'application/json');
        return h;
    }
}