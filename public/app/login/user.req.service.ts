import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';

@Injectable()
export class UserReqService {

    private static readonly _headers = UserReqService.genHeaders();

    constructor(private _http: Http) {
    }

    currentUser(): Observable<any> {
        return this._http.get('/auth/currentuser')
            .map(res => res.json())
            .catch(
                err => {
                    console.log('user service: not logged in');
                    console.log(JSON.stringify(err));
                    return Observable.of({});
                });
    }

    login(loginData: any): Observable<any> {
        return this._http.post('/auth/login', JSON.stringify(loginData), {headers: UserReqService._headers})
            .map(res => res)
            .catch(
                err => {
                    console.log('user service: error during login');
                    console.log(JSON.stringify(err));
                    return Observable.of({});
                });
    }

    logout(): Observable<any> {
        return this._http.get('/auth/logout')
            .map(res => ({}))
            .catch(
                err => {
                    console.log('user service: error during logout');
                    console.log(JSON.stringify(err));
                    return Observable.of({});
                });
    }


    private static genHeaders(): Headers {
        let h = new Headers();
        h.append('Content-Type', 'application/json');
        return h;
    }
}