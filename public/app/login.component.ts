import {Component, OnInit} from "@angular/core";
import {UserService} from "./user.service";
import {Router} from '@angular/router-deprecated';
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'login',
    templateUrl: 'app/login.component.html',
})
export class LoginComponent implements OnInit {
    public user:Observable<any>;
    public loginData:any = {};

    constructor(private _userService:UserService,
                private router:Router) {
    }

    ngOnInit() {
        console.log("login component");
        this.user = this._userService.currentUser();
        this.user.subscribe(res => {
            if (res) {
                this.router.navigate(['Transactions'])
            }
        })
    }

    login() {
        this._userService.login(this.loginData);
    }

    logout() {
        this._userService.logout();
    }
}