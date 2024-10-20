import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from 'src/app/utility/common';

@Injectable({
  providedIn: 'root'
})
export class LoanPaymentScheduleService {
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

  public pageLoadData() {
    return this.httpClient.get(createUrl(`Accounting/LoanPaymentSchedule/PageLoadData`));
  }
  public installmentAmountChange(data:any, data2: any){
    return this.httpClient.get(createUrl(`Accounting/LoanPaymentSchedule/InstallmentAmountChange?installmentAmount=`+data+`&loanAmount=`+data2));
  }
  public noOfInstallmentChange(data:any, data2: any){
    return this.httpClient.get(createUrl(`Accounting/LoanPaymentSchedule/NoOfInstallmentChange?loanAmount=`+data+`&noOfInstallment=`+data2));
  } 
  public loanScheduleCalculate(data:any){
    return this.httpClient.post(createUrl(`Accounting/LoanPaymentSchedule/LoanScheduleCalculate`),data);
  }

}
