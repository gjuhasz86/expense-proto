import {Directive, ElementRef, AfterViewInit} from "@angular/core";
declare var $: JQueryStatic;

@Directive({
    selector: '[auto-shrink]',
})
export class AutoShrinkDirective extends AfterViewInit {
    constructor(private elementRef: ElementRef) {
        super();
    }

    ngAfterViewInit(): void {
        let input = $(this.elementRef.nativeElement).find("input").first();
        input.prop("size", "1");
        input.keypress(x => input.prop("size", input.prop("value").length <= 1 ? 1 : input.prop("value").length));
    }
}