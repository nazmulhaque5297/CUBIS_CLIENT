import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserInfo } from '../Models/Common.model';
import {
  AccClassDetails,
  LoanReceivedReportInputHelp,
} from '../Models/loanreceived-report.model';
import { createUrl } from '../utility/common';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class LoanReceivedReportService {
  readonly apiAction = environment.baseUrl + 'Reports/LoanReceived/';

  constructor(private httpClient: HttpClient) {}

  public getUserInformation(): Observable<UserInfo> {
    return this.httpClient
      .get<UserInfo>(createUrl(`Account/GetUserDetails`))
      .pipe(catchError(this.handleError));
  }

  getInputHelp(): Observable<LoanReceivedReportInputHelp> {
    return this.httpClient.get<LoanReceivedReportInputHelp>(
      this.apiAction + 'GetInputHelpData'
    );
  }

  getAccTypeClassDetails(data: any): Observable<AccClassDetails> {
    return this.httpClient.get<AccClassDetails>(
      // this.apiAction +
      //   'GetAccountTypeDetails' +
      //   '?' +
      //   'accTypeCode=' +
      //   '${data}'
      createUrl(`Reports/LoanReceived/GetAccTypeClass?accTypeCode=${data}`)
    );
  }

  public Submit(data: any): Observable<ApiResponse> {
    console.log('This is Submit method data :', data);
    return this.httpClient.post<ApiResponse>(this.apiAction + 'Insert', data);
  }

  public GetVchInfo(vdata: any, fdata: any, pdata: any) {
    return this.httpClient.get(
      createUrl(
        `Reports/LoanReceived/GetVchInfo?vchNo=${vdata}&vchFlag=${fdata}&processDate=${pdata}`
      )
    );
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
