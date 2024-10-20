import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  IReportResponse,
  ReportCommonModel,
} from '../Models/report-common.model';

@Injectable({
  providedIn: 'root',
})
export class ReportCommonService {
  readonly apiAction = environment.baseUrl + 'ReportToken/';

  constructor(private httpClient: HttpClient) {}

  getReportToken(data: ReportCommonModel): Observable<IReportResponse> {
    return this.httpClient.post<IReportResponse>(
      this.apiAction + 'GetReportDetails',
      data
    );
  }

  public convertDateToString(value: any) {
    if (value == null) return;
    let num = value;
    num = num.toString();
    num = num.split('-');
    let date = num[0];
    let month = num[1];
    let year = num[2];
    let result = date + '/' + month + '/' + year;
    return result;
  }
}
