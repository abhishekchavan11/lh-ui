import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appRawHtml]'
})
export class RawHtmlDirective implements OnChanges {
  @Input() appRawHtml : string = ''
  constructor(private el : ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.el.nativeElement.innerHTML = this.appRawHtml;
  }

}
