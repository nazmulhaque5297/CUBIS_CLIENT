import { Directive, HostListener, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]',
})
export class OnlyNumberDirective {
  private regex: RegExp = new RegExp(/^[0-9,.,v,V]*$/);
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
      const regEx = new RegExp(/^[0-9,.,v,V]*$/);
      if (!regEx.test(clipboardData)) {
        event.preventDefault();
      }
    }
    return;
  }
}
