import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from 'src/app/utility/common';

@Injectable({
  providedIn: 'root'
})
export class SuretyReleaseTransactionService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public pageLoadData(){
    return this.httpClient.get(createUrl(`Accounting/LoanSuretyRelease/PageLoad`));
  }
  public memberNoChngData(data:any){
    return this.httpClient.get(createUrl(`Accounting/LoanSuretyRelease/MemberNoData?memberNo=`+data));
  }
  public btnSubmitData(data:any, data2:any){
    return this.httpClient.get(createUrl(`Accounting/LoanSuretyRelease/LoanSuretyBtnSubmitData?suretyMemNo=`+data+`&loanMemberNo=`+data2));
  }

  public updateReleaseStatusGuarantorAccount(data:any){
    return this.httpClient.post(createUrl(`Accounting/LoanSuretyRelease/UpdateReleaseStatusGuarantorAccount`), data);
  }

  public loanSuretyReleaseDataGet(data:any){
    return this.httpClient.post(createUrl(`Accounting/LoanSuretyRelease/LoanSuretyReleaseDataGet`), data);
  }

  public loanSuretyUpdateData(data:any){
    return this.httpClient.post(createUrl(`Accounting/LoanSuretyRelease/LoanSuretyReleaseUpdateData`), data);
  }

  public loanSuretyRefundData(data1: any, data2: any){
    return this.httpClient.get(createUrl(`Accounting/LoanSuretyRefund/LoanSuretyBtnSubmitData?suretyMemNo=`+data1+`&loanMemberNo=`+data2));
  }

  public loanSuretyRefundPageLoad(){
    return this.httpClient.get(createUrl(`Accounting/LoanSuretyRefund/LoanSuretyRefundPageLoad`));
  }

  public loanSuretyRefundUpdateData(data: any){
    return this.httpClient.post(createUrl(`Accounting/LoanSuretyRefund/LoanSuretyRefundUpdateData`), data);
  }
}
