import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Transaction} from "./transaction";
import 'rxjs/Rx';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Account} from "./account";
import {Category} from "./category";
import 'rxjs/add/operator/debounceTime';

@Injectable()
export class ReportsService {
    private _headers:Headers;
    private events:ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

    constructor(protected _http:Http) {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
    }

    refresh() {
        this.events.next(true);
    }

    getMonthly():Observable<any> {
        return this.events
            .map(x=>`/api/transactions/stats/monthly`)
            .flatMap((url:string) => this._http.get(url))
            .map((res:Response) => {
                console.log("report received");
                console.log(res);
                return res.json()
            });
    }
}