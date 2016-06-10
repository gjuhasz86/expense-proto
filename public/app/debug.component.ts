import {Component, OnInit} from "@angular/core";
import {Account} from "./accounts/account";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {AccountService} from "./crud.service";
import {NewTransactionComponent} from "./transactions/new-transaction.component";
import {Debug2Component} from "./debug2.component";

@Component({
    selector: 'debug',
    templateUrl: 'app/debug.component.html',
    directives: [NewTransactionComponent, Debug2Component]
})
export class DebugComponent implements OnInit {

    constructor(private _accService:AccountService) {
    }

    ngOnInit() {
    }

}