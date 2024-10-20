import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root'
})
export class LoanDefaulterReportService
{
    constructor(private httpClient: HttpClient) { }

    public GetInputHelpData(){
        return this.httpClient.get(createUrl(`Reports/LoanDefaulterReport/GetInputHelpData`));
      }

      public GetMemberName(data:any){
        return this.httpClient.get(createUrl(`Reports/LoanDefaulterReport/GetMemberName?MemNo=`+data));
      }

      public GetAccDesc(data:any){
        return this.httpClient.get(createUrl(`Reports/LoanDefaulterReport/GetAccDescName?AccNo=`+data));
      }

      public GenerateInfo(data:any)
      {
        
        return this.httpClient.post(createUrl(`Reports/LoanDefaulterReport/InsertInformation`),data);
      }

      public ViewTableInfo(){
        return this.httpClient.get(createUrl(`Reports/LoanDefaulterReport/GetViewInfo`));
      }

      

 
}