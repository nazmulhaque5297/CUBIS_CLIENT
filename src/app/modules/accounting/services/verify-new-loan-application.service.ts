import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from 'src/app/utility/common';

@Injectable({
  providedIn: 'root'
})
export class VerifyNewLoanApplicationService {

  constructor(private httpClient: HttpClient) { }

  public getLoanApplicationInfo() {
    return this.httpClient.get(createUrl(`Accounting/VerifyLoanApplication/LoadData`));
  }
  public getSelectDataInfo(data:any){
    return this.httpClient.post(createUrl(`Accounting/VerifyLoanApplication/GetSelectData`),data);
  }
  public RejectLoanApplication(data:any){
    return this.httpClient.post(createUrl(`Accounting/VerifyLoanApplication/RejectLoanApp`),data);
  } 
  public VerifyLoanApplication(data:any){
    return this.httpClient.post(createUrl(`Accounting/VerifyLoanApplication/VerifyLoanApp`),data);
  }
  public SancAmountChangeData(data:any){
    return this.httpClient.post(createUrl(`Accounting/VerifyLoanApplication/SancAmtChange`),data);
  } 
}
