import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from 'src/app/utility/common';

@Injectable({
  providedIn: 'root'
})
export class ApproveLoanApplicationService {
  constructor(private httpClient: HttpClient) { }

  public convertDateToString(value:any){
    if(value==null) return;
    let num = value;
    num = num.toString();
    num = num.split("-");
    let date = num[0];
    let month = num[1];
    let year = num[2]; 
    let result = date + "/" + month + "/" + year;
    return result;
  }

  public getLoanApplicationInfo() {
    return this.httpClient.get(createUrl(`Accounting/ApproveLoanApplication/LoadData`));
  }
  public getSelectDataInfo(data:any){
    return this.httpClient.post(createUrl(`Accounting/ApproveLoanApplication/GetSelectData`),data);
  }
  public RejectLoanApplication(data:any){
    return this.httpClient.post(createUrl(`Accounting/ApproveLoanApplication/RejectLoanApp`),data);
  } 
  public ApproveLoanApplication(data:any){
    return this.httpClient.post(createUrl(`Accounting/ApproveLoanApplication/ApproveLoanData`),data);
  }
  public SancAmountChangeData(data:any){
    return this.httpClient.post(createUrl(`Accounting/ApproveLoanApplication/SancAmtChange`),data);
  } 
}
