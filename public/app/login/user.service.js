"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var UserModelComponent = (function () {
    function UserModelComponent(_svc) {
        this._svc = _svc;
        this.userChange = new BehaviorSubject_1.BehaviorSubject({});
    }
    UserModelComponent.prototype.ngOnInit = function () {
        this.refresh();
    };
    UserModelComponent.prototype.refresh = function () {
        var _this = this;
        this._svc.currentUser()
            .subscribe(function (u) { return _this.userChange.next(u); });
    };
    UserModelComponent.prototype.logout = function () {
        this._svc.logout();
    };
    UserModelComponent.prototype.login = function (data) {
        var _this = this;
        this._svc.login(data).subscribe(function (u) { return _this.userChange.next(u); });
    };
    __decorate([
        core_1.Output()
    ], UserModelComponent.prototype, "userChange", void 0);
    UserModelComponent = __decorate([
        core_1.Component({
            selector: "user-model",
            template: "<div>User: {{userChange|async|json}}</div>"
        })
    ], UserModelComponent);
    return UserModelComponent;
}());
exports.UserModelComponent = UserModelComponent;
