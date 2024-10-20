import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root'
})
export class GeneralJournalTransactionService {

  constructor(private httpClient: HttpClient) { }

  public generalJournalTrnPageLoad(){
    return this.httpClient.get(createUrl(`Accounting/GLDailyJournalTransaction/LoadData`));
  }
  public generalJournalTrnPageNewLoad(data:any){
    return this.httpClient.get(createUrl(`Accounting/GLDailyJournalTransaction/NewLoadData?moduleNo=`+data));
  }
  public generalJournalTrnTempDataAdd(data:any){
    return this.httpClient.post(createUrl(`Accounting/GLDailyJournalTransaction/GetAndSetTempUpdate`),data);
  }
  public generalJournalFinalUpdateData(data:any){
    return this.httpClient.post(createUrl(`Accounting/GLDailyJournalTransaction/FinalUpdateData`),data);
  }
  public generalJournalEditVoucharData(data:any){
    return this.httpClient.get(createUrl(`Accounting/GLDailyJournalTransaction/EditVoucherData?voucherNo=`+data));
  }
}
