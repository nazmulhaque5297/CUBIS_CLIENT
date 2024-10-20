import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from 'src/app/utility/common';

@Injectable({
  providedIn: 'root'
})
export class CsLoanRescheduleService {
  constructor(
    private httpClient: HttpClient
  ) { }
  public pageLoadData(){
    return this.httpClient.get(createUrl(`Accounting/CSLoanReSchedule/ReSchedulePageLoad`));
  }
  public MemberNoChangeData(data:any){
    console.log("member no here is ",data);
    return this.httpClient.get(createUrl(`Accounting/CSLoanReSchedule/MemberNoChangeData?memberNo=`+data));
  }
  public LoanReScheduleAccTypeChng(data:any){
    return this.httpClient.post(createUrl(`Accounting/CSLoanReSchedule/LoanReScheduleAccTypeChng`),data);
  }
  public LoanReScheduleDueIntAmtChng(data:any){
    return this.httpClient.post(createUrl(`Accounting/CSLoanReSchedule/LoanReScheduleDueIntAmtChng`),data);
  }
  public LoanReScheduleNoInstlChng(data:any){
    return this.httpClient.post(createUrl(`Accounting/CSLoanReSchedule/LoanReScheduleNoInstlChng`),data);
  }
  public LoanReScheduleCalculateExpiryDate(data:any){
    return this.httpClient.post(createUrl(`Accounting/CSLoanReSchedule/LoanReScheduleCalculateExpiryDate`),data);
  }
  public LoanScheduleTrnVchDeplicate(data:any){
    return this.httpClient.get(createUrl(`Accounting/CSLoanReSchedule/LoanScheduleTrnVchDeplicate?voucherNo=`+data));
  }
  public ReScheduleApply(data:any){
    return this.httpClient.post(createUrl(`Accounting/CSLoanReSchedule/ReScheduleApply`),data);
  }

}
