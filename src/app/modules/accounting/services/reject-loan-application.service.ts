import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from 'src/app/utility/common';

@Injectable({
  providedIn: 'root'
})
export class RejectLoanApplicationService {

  constructor(private httpClient: HttpClient) { }

  public pageLoadData() {
    return this.httpClient.get(createUrl(`Accounting/RejectLoanAccount/LoadData`));
  }

  public applicationNoChange(data) {
    return this.httpClient.get(createUrl(`Accounting/RejectLoanAccount/ApplicationNoChange?applicationNo=`+data));
  }

  public rejectAccount(body) {
    return this.httpClient.post(createUrl(`Accounting/RejectLoanAccount/LoanAccountReject`), body);
  }
}
