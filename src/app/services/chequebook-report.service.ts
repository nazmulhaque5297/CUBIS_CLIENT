import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ChequeBookReportInputHelp,
  ChequeBookReportAccTypeDetails,
  ChequeBookReportAccNoDetails,
} from '../Models/chequebook-report.model';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root',
})
export class ChequeBookReportService {
  readonly apiAction = environment.baseUrl + 'Reports/ChequeBookReport/';

  constructor(private httpClient: HttpClient) {}

  getInputHelp(): Observable<ChequeBookReportInputHelp> {
    return this.httpClient.get<ChequeBookReportInputHelp>(
      this.apiAction + 'GetInputHelpData'
    );
  }
  getAccountTypeDetails(data: any): Observable<ChequeBookReportAccTypeDetails> {
    return this.httpClient.get<ChequeBookReportAccTypeDetails>(
      // this.apiAction +
      //   'GetAccountTypeDetails' +
      //   '?' +
      //   'accTypeCode=' +
      //   '${data}'
      createUrl(
        `Reports/ChequeBookReport/GetAccountTypeDetails?accTypeCode=${data}`
      )
    );
  }

  getAccountNo(
    memdata: any,
    accdata: any
  ): Observable<ChequeBookReportAccNoDetails> {
    return this.httpClient.get<ChequeBookReportAccNoDetails>(
      createUrl(
        `Reports/ChequeBookReport/GetAccountNo?MemNo=${memdata}&accTypeCode=${accdata}`
      )
    );
  }


  public GetMemName(data:any){
    return this.httpClient.get(createUrl(`Reports/ChequeBookReport/GetMemName?memNo=`+data));
  }
  public getAccountInfo(data:any,data2:any){
    return this.httpClient.get(createUrl(`Reports/ChequeBookReport/GetAccInfo?accType=`+data+`&memNo=`+data2));
  }

}
