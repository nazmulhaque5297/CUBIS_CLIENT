import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from 'src/app/utility/common';

@Injectable({
  providedIn: 'root'
})
export class YearEndService {

  constructor(private httpClient: HttpClient) { }

  public YERevTrnPageLoad(){
    return this.httpClient.get(createUrl(`Accounting/GLYearEndReverseTransaction/LoadData`));
  }
  public YERevTrnSearchVoucher(data:any, data2: any){
    return this.httpClient.get(createUrl(`Accounting/GLYearEndReverseTransaction/VoucherSearch?voucherNo=`+data+`&ctrlTrnDate=`+data2));
  }
  public YERevTrnDeleteData(data:any, data2:any){
    return this.httpClient.get(createUrl(`Accounting/GLYearEndReverseTransaction/ReverseData?voucherNo=`+data+`&ctrlTrnDate=`+data2));
  }

  public YEPostTrnLoad(){
    return this.httpClient.get(createUrl(`Accounting/GLYearEndPostTransaction/LoadData`));
  }

  public YEPostData(){
    return this.httpClient.get(createUrl(`Accounting/GLYearEndPostTransaction/PostData`));
  }

  public YEProfLossAppTrnLoad(){
    return this.httpClient.get(createUrl(`Accounting/GLYEProfLossAppTrn/LoadData`));
  }

  public GLYEProfLossApproProcessData(data:any){
    return this.httpClient.get(createUrl(`Accounting/GLYEProfLossAppTrn/GLYEProfLossApproProcessData?prmYEDate=`+data));
  }

  public GLYEPoroLossAppPostData(data:any, data2:any){
    return this.httpClient.get(createUrl(`Accounting/GLYEProfLossAppTrn/GLYEPoroLossAppPostData?voucherNo=`+data+`&cashCode=`+data2));
  }

}
