import {Headers, Http} from "angular2/http";
import {Injectable} from "angular2/core";
import {Observable} from "rxjs/Observable";

@Injectable()
export class UserService {
    private _headers:Headers;

    constructor(private _http:Http) {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
    }

    currentUser():Observable<any> {
        return this._http.get('/auth/currentuser');
    }

    login(loginData:any):Observable<any> {
        return this._http.post('/auth/login', JSON.stringify(loginData), {headers: this._headers})
    }

    logout():Observable<any> {
        return this._http.get('/auth/logout')
    }
}