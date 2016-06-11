import {Component, OnInit} from "@angular/core";
import {ConfigService} from "../crud.service";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'admin',
    templateUrl: 'app/admin/admin.component.html',
    directives: []
})
export class AdminComponent implements OnInit {

    config:any;

    constructor(private _confService:ConfigService) {
    }

    ngOnInit() {
        this._confService.getGlobalConfig()
            .subscribe(c => this.config = c);
        this._confService.refresh();
    }

    setSignupEnabled(isEnabled) {
        let newConf = JSON.parse(JSON.stringify(this.config));
        newConf.signupEnabled = isEnabled;
        this._confService.updateItem(newConf);
    }
}