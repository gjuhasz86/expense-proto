"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var UserReqService = (function () {
    function UserReqService(_http) {
        this._http = _http;
    }
    UserReqService.prototype.currentUser = function () {
        return this._http.get('/auth/currentuser')
            .map(function (res) { return res.json(); })
            .catch(function (err) {
            console.log('user service: not logged in');
            console.log(JSON.stringify(err));
            return {};
        });
    };
    UserReqService.prototype.login = function (loginData) {
        return this._http.post('/auth/login', JSON.stringify(loginData), { headers: UserReqService._headers })
            .map(function (res) { return res; })
            .catch(function (err) {
            console.log('user service: error during login');
            console.log(JSON.stringify(err));
            return {};
        });
    };
    UserReqService.prototype.logout = function () {
        return this._http.get('/auth/logout')
            .map(function (res) { return ({}); })
            .catch(function (err) {
            console.log('user service: error during logout');
            console.log(JSON.stringify(err));
            return {};
        });
    };
    UserReqService.genHeaders = function () {
        var h = new http_1.Headers();
        h.append('Content-Type', 'application/json');
        return h;
    };
    UserReqService._headers = UserReqService.genHeaders();
    UserReqService = __decorate([
        core_1.Injectable()
    ], UserReqService);
    return UserReqService;
}());
exports.UserReqService = UserReqService;
