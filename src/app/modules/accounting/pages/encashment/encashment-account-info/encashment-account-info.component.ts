import { Component, OnInit, Input } from '@angular/core';
import {IEncashmentAccountDetails, EncashmentAccountViewModel} from "./../../../models/encashment.model"

@Component({
  selector: 'app-encashment-account-info',
  templateUrl: './encashment-account-info.component.html',
  styleUrls: ['./encashment-account-info.component.css']
})
export class EncashmentAccountInfoComponent implements OnInit {
  @Input() accInfo: IEncashmentAccountDetails;
  @Input() accView: EncashmentAccountViewModel;
  constructor() { }

  ngOnInit(): void {
  }

}
