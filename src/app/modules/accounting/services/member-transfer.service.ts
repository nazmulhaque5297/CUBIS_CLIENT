import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from 'src/app/utility/common';

@Injectable({
  providedIn: 'root'
})
export class MemberTransferService {

  constructor(private httpClient: HttpClient) { }

  public MemberNoChange(data:any){
    return this.httpClient.get(createUrl(`Accounting/AccountTransactionTransfer/MemberNoChange?memNo=`+data));
  }

  public MemberTransferProcess(data:any, data2:any){
    return this.httpClient.get(createUrl(`Accounting/AccountTransactionTransfer/MemberTransferProcess?memNo=`+data+`&toMemTitle=`+data2));
  }

}
