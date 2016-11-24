import {Component, Output, OnInit, Input, Injectable} from "@angular/core";
import {UserReqService} from "./user-req.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {ReplaySubject} from "rxjs/ReplaySubject";
import 'rxjs/add/operator/debounceTime'

@Injectable()
export class UserModelRelayService {
    readonly userChange = new ReplaySubject<any>(1);

    private readonly refresh$ = new ReplaySubject<void>(1);
    private readonly logout$ = new ReplaySubject<void>(1);

    constructor(private _svc: UserReqService) {
        this.refresh$.debounceTime(200)
            .subscribe(x => this.doRefresh());
        this.logout$.debounceTime(200)
            .subscribe(x => this.doLogout());
    }

    refresh() {
        this.refresh$.next(null);
    }

    logout() {
        this.logout$.next(null);
    }

    private doRefresh(): void {
        this._svc.currentUser()
            .subscribe(u => this.userChange.next(u));
    }

    private doLogout(): void {
        this._svc.logout()
            .subscribe(u => this.userChange.next(u));
    }

}

@Component({
    selector: "user-model",
    template: `<div *ngIf="false">User: {{user|async|json}}</div>`

})
export class UserModelComponent implements OnInit {
    @Output() readonly user = this.relay.userChange;

    constructor(private relay: UserModelRelayService) { }

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.relay.refresh();
    }

    logout(): void {
        this.relay.logout();
    }

    // private login(data: any): void {
    //     this._svc.login(data).subscribe(u => this.user.next(u));
    // }

}