import { Component, Input, OnInit } from '@angular/core';
import { IInterestAccountDetails } from '../../../models/interest-withdrawal.model';

@Component({
  selector: 'app-ibw-account-details-long-term',
  templateUrl: './ibw-account-details-long-term.component.html',
  styleUrls: ['./ibw-account-details-long-term.component.css']
})
export class IbwAccountDetailsLongTermComponent implements OnInit {
  @Input() aData: IInterestAccountDetails;
  constructor() { }

  ngOnInit(): void {
    console.log(this.aData)
  }

}
