"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var SelectionRelayService = (function () {
    function SelectionRelayService() {
        this.setAll = new core_1.EventEmitter();
        this.deleteSelected = new core_1.EventEmitter();
    }
    SelectionRelayService.prototype.sendSetAll = function (value) {
        console.log("selecting all");
        this.setAll.emit(value);
    };
    SelectionRelayService.prototype.sendDeleteSelected = function () {
        this.deleteSelected.emit(true);
    };
    return SelectionRelayService;
}());
exports.SelectionRelayService = SelectionRelayService;
var SelectionRelayComponent = (function () {
    function SelectionRelayComponent(broadcast) {
        var _this = this;
        this.broadcast = broadcast;
        this.selected = false;
        this.selectedChange = new core_1.EventEmitter();
        this.deleteSelected = this.broadcast.deleteSelected;
        broadcast.setAll.subscribe(function (b) {
            _this.selected = b;
            _this.selectedChange.emit(b);
        });
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SelectionRelayComponent.prototype, "selected", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], SelectionRelayComponent.prototype, "selectedChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], SelectionRelayComponent.prototype, "deleteSelected", void 0);
    SelectionRelayComponent = __decorate([
        core_1.Component({
            selector: "selection-relay",
            template: '<div *ngIf="false">relay: {{selected}}</div>'
        }), 
        __metadata('design:paramtypes', [SelectionRelayService])
    ], SelectionRelayComponent);
    return SelectionRelayComponent;
}());
exports.SelectionRelayComponent = SelectionRelayComponent;
//# sourceMappingURL=selection.component.js.map