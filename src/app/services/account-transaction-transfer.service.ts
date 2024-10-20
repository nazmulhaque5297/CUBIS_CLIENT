
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root'
})

export class AccountTransactionTransferService {

  constructor(private httpClient: HttpClient) { }

  public TranDateChange(data:any){
    return this.httpClient.get(createUrl(`Accounting/AccountTransactionTransfer/TranDateChange?tranDate=`+data));
  }

  public FromMemAccTypeInfo(data:any){
    return this.httpClient.post(createUrl(`Accounting/AccountTransactionTransfer/FromMemAccTypeInfo`),data);
  }

  public AccountNoChangeFromData(data:any){
    return this.httpClient.get(createUrl(`Accounting/AccountTransactionTransfer/AccountNoChangeFromData?accNo=`+data));
  }

  public AccountNoChangeToData(data:any){
    return this.httpClient.get(createUrl(`Accounting/AccountTransactionTransfer/AccountNoChangeToData?accNo=`+data));
  }


  public ToMemAccTypeInfo(data:any, data1: any, data2: any){
    return this.httpClient.get(createUrl(`Accounting/AccountTransactionTransfer/ToMemAccTypeInfo?memberNo=`+data+`&fromAccType=`+data1+`&fromAccNo=`+data2));
  }
  // public CSDailyTrnReverseData(data:any){
  //   return this.httpClient.post(createUrl(`Accounting/CSDailyReverseTransaction/ReverseData`),data);
  // }

  public Transfer(body){
    return this.httpClient.post(createUrl(`Accounting/AccountTransactionTransfer/TransferData`), body);
  }
}
