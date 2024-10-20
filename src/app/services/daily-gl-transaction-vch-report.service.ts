import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root',
})
export class DailyGLTransactionVchReportService {
  constructor(private httpClient: HttpClient) {}

  public GetInputHelpData() {
    return this.httpClient.get(
      createUrl(`Reports/DailyGLVchTransactionReport/GetInputHelpData`)
    );
  }


  public GetVchData(data:any,data2:any,data3:any)
  {
      return this.httpClient.get(createUrl(`Reports/DailyGLVchTransactionReport/GetVchInfo?processDate=`+data+`&changesDate=`+data2+`&vchNo=`+data3))
  }
}
