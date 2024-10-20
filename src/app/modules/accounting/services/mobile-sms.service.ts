import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from 'src/app/utility/common';

@Injectable({
  providedIn: 'root'
})
export class MobileSmsService {

  constructor(private httpClient: HttpClient) { }

  public SMSMemberBalanceLedgerPageLoad(){
    return this.httpClient.get(createUrl(`Accounting/SMSMemberBalanceLedgerBalance/PageLoad`));
  }

  public accLedBalCollectorCodeChangeData(data:any){
    return this.httpClient.get(createUrl(`Accounting/SMSMemberBalanceLedgerBalance/AccLedBalCollectorCodeChangeData?collectorCode=`+data));
  }

  public AccLedBalSMSGenerate(body:any) {
    return this.httpClient.post(createUrl(`Accounting/SMSMemberBalanceLedgerBalance/AccLedBalSMSGenerate`), body);
  }

  public AccLedBalSMSSend(data:any) {
    return this.httpClient.get(createUrl(`Accounting/SMSMemberBalanceLedgerBalance/AccLedBalSMSSend?accountList=`+data));
    //return this.httpClient.post(createUrl(`Accounting/SMSMemberBalanceLedgerBalance/AccLedBalSMSSend`), body);
  }

  public SendMsg(data:any){
    return this.httpClient.post(createUrl(`Accounting/SMSMemberBalanceLedgerBalance/SendSMS`), data);
  }
}
