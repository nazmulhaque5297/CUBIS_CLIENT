import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root'
})
export class ReceivedAndPaymentReportService
{
    constructor(private httpClient: HttpClient) { }

    public GetInputHelpData(){
        return this.httpClient.get(createUrl(`Reports/ReceivedAndPaymentReport/GetInputHelpData`));
      }

    //   public GetVchInfo(data1:any,data2:any,data3:any,data4:any,data5:any,data6:any){
    //     return this.httpClient.get(createUrl(`Reports/DailyCsTransactionVoucherReport/GetVchInfo?vchNo=`+data1+`&vchFlag=`+data2+`&processDate=`+data3+`&applicationDate=`+data4+`&glCashCode=`+data5+`&ddlValue=`+data6));
    //   }

}