import { Component, OnInit } from '@angular/core';
import { HouseKeepingService } from '../../house-keeping/house-keeping.service';

@Component({
  selector: 'app-booth',
  templateUrl: './booth.component.html',
  styleUrls: ['./booth.component.css']
})
export class BoothComponent implements OnInit {

  module:string = "3"
  constructor(private houseKeepingService: HouseKeepingService) { }

  ngOnInit(): void {
  }

}
