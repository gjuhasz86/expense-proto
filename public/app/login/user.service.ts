import {Headers, Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {ReplaySubject} from "rxjs/ReplaySubject";

@Injectable()
export class UserService {
    private _headers:Headers;
    private user:ReplaySubject<any> = new ReplaySubject<any>(1);
    private loggedIn:boolean = false;
    public globalConf:ReplaySubject<any> = new ReplaySubject<any>(1);

    constructor(private _http:Http) {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
        this._http.get('/auth/currentuser')
            .subscribe(
                res => this.user.next(res),
                err => {
                    console.log('user service: not logged in');
                    console.log(err);
                    this.user.next(undefined);
                });
        this.user.subscribe(res=> {
            console.log("user change: " + res);
            if (res) {
                this.loggedIn = true;
            } else {
                this.loggedIn = false;
            }
        });
        this._http.get('/public/globalconfig')
            .subscribe(res => this.globalConf.next(res.json()));

    }

    currentUser():Observable<any> {
        return this.user;
    }

    isLoggedIn():boolean {
        return this.loggedIn;
    }

    login(loginData:any):void {
        this._http.post('/auth/login', JSON.stringify(loginData), {headers: this._headers})
            .subscribe(
                res => this.user.next(res),
                err => {
                    console.log(err);
                    this.user.next(undefined);
                });
    }

    logout():void {
        this._http.get('/auth/logout')
            .subscribe(
                res => {
                    console.log('logged out');
                    this.user.next(undefined);
                },
                err => {
                    console.log('ERR: while logged out');
                    console.log(err);
                    this.user.next(undefined);
                });
    }
}