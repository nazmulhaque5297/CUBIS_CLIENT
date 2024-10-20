import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root'
})
export class DailyReverseCsTransactionService {

  constructor(
    private httpClient: HttpClient
  ) { }
  public CSDailyReverseTrnLoadData(){
    return this.httpClient.get(createUrl(`Accounting/CSDailyReverseTransaction/LoadData`));
  }
  public FindDailyReverseCSTrnData(data:any){
    return this.httpClient.post(createUrl(`Accounting/CSDailyReverseTransaction/TransactionSearch`),data);
  }
  public CSDailyTrnReverseData(data:any){
    return this.httpClient.post(createUrl(`Accounting/CSDailyReverseTransaction/ReverseData`),data);
  }
}
