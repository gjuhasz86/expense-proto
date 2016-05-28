import {Component, OnInit} from "@angular/core";
import {UserService} from "./user.service";
import {Observable} from "rxjs/Observable";
import {Router} from '@angular/router-deprecated';

@Component({
    selector: 'user-info',
    templateUrl: 'app/user-info.component.html',
})
export class UserInfoComponent implements OnInit {
    public user:Observable<any>;
    public loginData:any = {};

    constructor(private _userService:UserService,
                private router:Router) {
    }

    ngOnInit() {
        console.log("user-info component");
        this.user = this._userService.currentUser()
            .map(
                res => {
                    if (res) {
                        console.log("Logged in: " + res.json());
                        return res.json();
                    }
                    else {
                        console.log("user-info: not logged in, navigating to login");
                        this.router.navigate(['Login']);
                        return undefined;
                    }
                },
                err => {
                    console.log("user-info: err response");
                    console.log(err);
                    this.router.navigate(['Login']);
                    return undefined;
                });
    }

    login() {
        this._userService.login(this.loginData);
    }

    logout() {
        this._userService.logout();
    }
}