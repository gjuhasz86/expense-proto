import {Component, Output, OnInit} from "@angular/core";
import {UserReqService} from "./user.req.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
    selector: "user-model",
    template: `<div>User: {{userChange|async|json}}</div>`

})
export class UserModelComponent implements OnInit {
    @Output() readonly userChange = new BehaviorSubject<any>({});

    constructor(private _svc: UserReqService) {
    }

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this._svc.currentUser()
            .subscribe(u => this.userChange.next(u));
    }

    logout(): void {
        this._svc.logout()
            .subscribe(u => this.userChange.next(u));
    }

    private login(data: any): void {
        this._svc.login(data).subscribe(u => this.userChange.next(u));
    }

}