import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserModelRelayService} from "./login/user-model.component";
import 'rxjs/add/operator/first';

@Component({
    selector: 'main',
    template: `<div>Please wait...</div>`
})
export class MainComponent implements OnInit {

    constructor(private router: Router,
                private userSvc: UserModelRelayService) {
        this.userSvc.userChange.first().subscribe(user => {
            console.log("Main router routing");
            let mainActive = this.router.isActive('', true);
            if (user.id && mainActive) {
                this.router.navigate(['main/transactions'])
            } else {
                this.router.navigate(['main/login'])
            }
        })
    }

    ngOnInit(): void {
        this.userSvc.refresh();
    }

}
