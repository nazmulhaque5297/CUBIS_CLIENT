import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from 'src/app/utility/common';

@Injectable({
  providedIn: 'root'
})
export class CsVerifyDailyTransactionService {
  constructor(
    private httpClient: HttpClient
  ) { }
  public pageLoadData(){
    return this.httpClient.get(createUrl(`Accounting/CSVerifyDailyTransaction/LoadData`));
  }
  public VerifyData(data:any,data2:any){
    return this.httpClient.get(createUrl(`Accounting/CSVerifyDailyTransaction/VerifyData?voucherNo=`+data+`&transactionDate=`+data2));
  }
  public ValidDataCheck(data:any){
    return this.httpClient.post(createUrl(`Accounting/CSVerifyDailyTransaction/ValidDataCheck`),data);
  }
}
