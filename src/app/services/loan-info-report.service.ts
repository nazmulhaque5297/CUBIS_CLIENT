import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { createUrl } from '../utility/common';
//import { CoaReportInputHelp } from '../Models/coa-report.model';

@Injectable({
  providedIn: 'root',
})
export class LoanInfoReportService {
  readonly apiAction = environment.baseUrl + 'Reports/LoanInfoReport/';

  constructor(private httpClient: HttpClient) {}

  //   getInputHelp(): Observable<CoaReportInputHelp> {
  //     return this.httpClient.get<CoaReportInputHelp>(this.apiAction+"GetInputHelpData");
  //   }

  public GetMemberDetails(cdata: any, mdata: any) {
    return this.httpClient.get(
      createUrl(
        `Reports/LoanInfoReport/GetMemberDetails?IsOldMem=${cdata}&MemNo=${mdata}`
      )
    );
  }

  public GetMemberDetailsByOld(accType: number, oldMem: number){
    return this.httpClient.get(
      createUrl(
        `Reports/LoanInfoReport/GetMemberDetailsByOld?accType=${accType}&oldMem=${oldMem}`
      )
    );
  }

  public GetMemberDetailsByOldAccNo(cdata: any, mdata: any, idata: any) {
    return this.httpClient.get(
      createUrl(
        `Reports/LoanInfoReport/GetMemberDetailsByOldAccNo?AccType=${cdata}&AccOldNumber=${mdata}&IsActive=${idata}`
      )
    );
  }

  public GetMemberDetailsByAccNo(cdata: any, mdata: any, idata: any) {
    return this.httpClient.get(
      createUrl(
        `Reports/LoanInfoReport/GetMemberDetailsByAccNo?AccType=${cdata}&AccNumber=${mdata}&IsActive=${idata}`
      )
    );
  }

  public GetMemberDetailsByMemNo(cdata: any, mdata: any, idata: any) {
    return this.httpClient.get(
      createUrl(
        `Reports/LoanInfoReport/GetMemberDetailsByMemNo?AccType=${cdata}&MemNumber=${mdata}&IsActive=${idata}`
      )
    );
  }

  public GetAccountInfo(cdata: any, mdata: any, idata: any) {
    return this.httpClient.get(
      createUrl(
        `Reports/LoanInfoReport/GetAccountInfo?AccType=${cdata}&MemNumber=${mdata}&IsActive=${idata}`
      )
    );
  }

  public GetAccountInfoLedger(mdata: any, idata: any) {
    return this.httpClient.get(
      createUrl(
        `Reports/LoanInfoReport/GetAccountInfoLedger?MemNumber=${mdata}&WithCloseAc=${idata}`
      )
    );
  }
}
