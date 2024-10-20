import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../house-keeping.service'

@Component({
  selector: 'app-house-keeping',
  templateUrl: './house-keeping.component.html',
  styleUrls: ['./house-keeping.component.css']
})
export class HouseKeepingComponent implements OnInit {
  module:string = "2"
  constructor(private houseKeepingService: HouseKeepingService) { }
  ngOnInit(): void {
  }
}
