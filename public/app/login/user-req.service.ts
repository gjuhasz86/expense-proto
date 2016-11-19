import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ErrorLoggerService} from "../common/error-logger.service";

@Injectable()
export class UserReqService {

    private static readonly _headers = UserReqService.genHeaders();

    constructor(private _http: Http,
                private errLog: ErrorLoggerService) {
    }

    currentUser(): Observable<any> {
        return this._http.get('/auth/currentuser')
            .map(res => res.json())
            .catch(err => {
                this.errLog.log('user service: not logged in', err);
                return Observable.of({});
            });
    }

    login(loginData: any): Observable<any> {
        return this._http.post('/auth/login', JSON.stringify(loginData), {headers: UserReqService._headers})
            .map(res => res)
            .catch(
                err => {
                    this.errLog.log('user service: error during login', err);
                    return Observable.of({});
                });
    }

    logout(): Observable<any> {
        return this._http.get('/auth/logout')
            .map(res => ({}))
            .catch(
                err => {
                    this.errLog.log('user service: error during logout', err);
                    return Observable.of({});
                });
    }


    private static genHeaders(): Headers {
        let h = new Headers();
        h.append('Content-Type', 'application/json');
        return h;
    }
}