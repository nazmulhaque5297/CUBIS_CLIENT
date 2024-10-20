import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.css']
})
export class AccountingComponent implements OnInit {
  module:string = "1"
  constructor() { }

  ngOnInit(): void {
  }

}
