import {ElementRef, Directive} from "@angular/core";

@Directive({
    selector: '[focusable]',
    exportAs: 'focusable'
})
export class FocusableDirective {
    constructor(private elementRef: ElementRef) {}

    setFocus() {
        setTimeout(() => this.elementRef.nativeElement.focus(), 10);
    }
}