import { Component, Input, OnInit } from '@angular/core';
import { IDisbursementAccountDetails } from '../../../models/loan-disbursement.model';

@Component({
  selector: 'app-loan-disbursement-account-details',
  templateUrl: './loan-disbursement-account-details.component.html',
  styleUrls: ['./loan-disbursement-account-details.component.css']
})
export class LoanDisbursementAccountDetailsComponent implements OnInit {
  @Input() aData: IDisbursementAccountDetails;
  constructor() { }

  ngOnInit(): void {
  }

}
