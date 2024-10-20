import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accounting-wrapper',
  templateUrl: './accounting-wrapper.component.html',
  styleUrls: ['./accounting-wrapper.component.css']
})
export class AccountingWrapperComponent implements OnInit {
  module: string = "1"
  constructor() { }

  ngOnInit(): void {
  }

}
