import { Component, Input, OnInit } from '@angular/core';
import { IAdjustmentAccountDetails, AdjustmentAccountViewModel } from '../../../models/adjustment-transaction.model';

@Component({
  selector: 'app-adjustment-account-details',
  templateUrl: './adjustment-account-details.component.html',
  styleUrls: ['./adjustment-account-details.component.css']
})
export class AdjustmentAccountDetailsComponent implements OnInit {
  @Input() aData: IAdjustmentAccountDetails;
  @Input() vData: AdjustmentAccountViewModel; 
  constructor() { }

  ngOnInit(): void {
  }

}
