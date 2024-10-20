import { Directive, HostListener, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appOnlyNumberWithoutDecimal]',
})
export class OnlyNumberWithoutDecimalDirective {
  private regex: RegExp = new RegExp('^[0-9]*$');
  private specialKeys: Array<string> = [
    'Backspace',
    'ArrowLeft',
    'ArrowRight',
    'Control',
    'Tab',
    'Enter',
  ];

  constructor(private elementRef: ElementRef) {}
  /**
   * key board action
   * @param event
   */
  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const inputValue: string = this.elementRef.nativeElement.value.concat(
      event.key
    );
    if (inputValue && !String(inputValue).match(this.regex)) {
      event.preventDefault();
    }
    return;
  }

  /**
   * Copy Paste action
   * @param event
   */
  @HostListener('paste', ['$event']) onPaste(event) {
    const clipboardData = (event.originalEvent || event).clipboardData.getData(
      'text/plain'
    );
    if (clipboardData) {
      const regEx = new RegExp('^[0-9]*$');
      if (!regEx.test(clipboardData)) {
        event.preventDefault();
      }
    }
    return;
  }
}
