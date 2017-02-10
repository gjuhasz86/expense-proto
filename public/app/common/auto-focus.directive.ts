import {Directive, ElementRef, AfterViewInit} from "@angular/core";
declare var $: JQueryStatic;

@Directive({
    selector: '[auto-focus]',
})
export class AutoFocusDirective extends AfterViewInit {
    constructor(private elementRef: ElementRef) {
        super();
    }

    ngAfterViewInit(): void {
        let input = $(this.elementRef.nativeElement).find("input").first();
        input.focus();
    }
}