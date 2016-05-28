import {
    ViewContainerRef,
    DynamicComponentLoader,
    Attribute, // eslint-disable-line no-unused-vars
    Directive
} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router-deprecated';
import {UserService} from "./user.service";


@Directive({
    selector: '[protected]'
})
export class LoggedInRouterOutletDirective extends RouterOutlet {
    publicRoutes = [
        '', 'login'
    ];

    constructor(containerRef:ViewContainerRef,
                componentLoader:DynamicComponentLoader,
                protected parentRouter:Router,
                @Attribute('name') name,
                private userService:UserService) {
        super(containerRef, componentLoader, parentRouter, name);
    }

    activate(instruction) {
        if (this._canActivate(instruction.urlPath)) {
            return super.activate(instruction);
        }
        this.parentRouter.navigate(['Login']);
    }

    _canActivate(url) {
        return this.publicRoutes.indexOf(url) !== -1 || this.userService.isLoggedIn();
    }
}