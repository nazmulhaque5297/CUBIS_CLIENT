import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-main-wrapper',
  templateUrl: './main-wrapper.component.html',
  styleUrls: ['./main-wrapper.component.css'],
})
export class MainWrapperComponent implements OnInit {
  @Input() module = '';

  constructor() {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
}
