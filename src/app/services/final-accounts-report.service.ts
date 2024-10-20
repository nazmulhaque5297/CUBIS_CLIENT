import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root',
})
export class FinalAccountsReportService {
  readonly apiAction = environment.baseUrl + 'Reports/FinalAccountsReport/';

  constructor(private httpClient: HttpClient) {}

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

  public GetGrid1Info(rdata: any, fdata: any, tdata: any) {
    return this.httpClient.get(
      createUrl(
        `Reports/FinalAccountsReport/GetGrid1Info?ReportOpt=${rdata}&fDate=${fdata}&tDate=${tdata}`
      )
    );
  }
  public GetGrid2Info(rdata: any, sdata: any) {
    return this.httpClient.get(
      createUrl(
        `Reports/FinalAccountsReport/GetGrid2Info?ReportOpt=${rdata}&selectedGLAccNo=${sdata}`
      )
    );
  }
  public GetGrid3Info(rdata: any, sdata: any) {
    return this.httpClient.get(
      createUrl(
        `Reports/FinalAccountsReport/GetGrid3Info?ReportOpt=${rdata}&selectedGLAccNo=${sdata}`
      )
    );
  }
  public GetGrid4Info(sdata: any, fdata: any, tdata: any) {
    return this.httpClient.get(
      createUrl(
        `Reports/FinalAccountsReport/GetGrid4Info?selectedGLAccNo=${sdata}&fDate=${fdata}&tDate=${tdata}`
      )
    );
  }
}
