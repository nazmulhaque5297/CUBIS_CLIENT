import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-house-keeping-wrapper',
  templateUrl: './house-keeping-wrapper.component.html',
  styleUrls: ['./house-keeping-wrapper.component.css']
})
export class HouseKeepingWrapperComponent implements OnInit {
  module: string = "2"
  constructor() { }

  ngOnInit(): void {
  }

}
