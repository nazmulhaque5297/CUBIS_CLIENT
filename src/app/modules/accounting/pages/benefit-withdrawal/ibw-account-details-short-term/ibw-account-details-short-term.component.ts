import { Component, Input, OnInit } from '@angular/core';
import { IInterestAccountDetails } from '../../../models/interest-withdrawal.model';

@Component({
  selector: 'app-ibw-account-details-short-term',
  templateUrl: './ibw-account-details-short-term.component.html',
  styleUrls: ['./ibw-account-details-short-term.component.css']
})
export class IbwAccountDetailsShortTermComponent implements OnInit {

  @Input() aData: IInterestAccountDetails;

  constructor() { }

  ngOnInit(): void {
    console.log(this.aData)
  }

}
