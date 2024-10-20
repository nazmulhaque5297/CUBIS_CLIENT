import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root'
})
export class CashCollectionReportByAccService
{
    constructor(private httpClient: HttpClient) { }

    public GetInputHelpData(){
        return this.httpClient.get(createUrl(`Reports/CashCollectionReport/GetInputHelpData`));
      }
      public MemberNoChangeData(){
        return this.httpClient.get(createUrl(`Reports/CashCollectionReport/MemberNoChangeData`));
      }
      public AccountClassReturn(data:any){
        return this.httpClient.get(createUrl(`Reports/CashCollectionReport/AccountClassReturn?accType=`+data));
      }
      public RegistrationNumber(data:any){
        return this.httpClient.get(createUrl(`Reports/CashCollectionReport/RegistrationNumber?groupCode=`+data));
      }
      public MemberType(data:any){
        return this.httpClient.get(createUrl(`Reports/CashCollectionReport/RegistrationNumber?memNo=`+data));
      }
      public  TellerIdReturn(data:any){
        return this.httpClient.get(createUrl(`Reports/CashCollectionReport/ TellerIdReturn?useId=`+data));
      }
      public  CollectorCode(data:any){
        return this.httpClient.get(createUrl(`Reports/CashCollectionReport/ CollectorCode?collectorId=`+data));
      }
      

      

      
}