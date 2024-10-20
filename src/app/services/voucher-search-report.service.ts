import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root'
})
export class VoucherSearchReportComponentService
{
    constructor(private httpClient: HttpClient) { }

    public convertDateToString(value:any){
      if(value==null) return;
      let num = value;
      num = num.toString();
      num = num.split("-");
      let date = num[0];
      let month = num[1];
      let year = num[2]; 
      let result = date + "/" + month + "/" + year;
      return result;
    }

  public VoucherSearchReportPageLoad(){
    return this.httpClient.get(createUrl(`Reports/VoucherSearchReport/VoucherSearchReportPageLoad`));
  }

  public VoucherSearchButton(data:any,data2:any){
    return this.httpClient.get(createUrl(`Reports/VoucherSearchReport/VoucherSearchButton?voucherDate=`+data+`&customerServiceRb=`+data2));
  }

}