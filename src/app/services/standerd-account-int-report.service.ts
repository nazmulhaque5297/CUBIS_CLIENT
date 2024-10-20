import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Observable } from 'rxjs';
import { periodStringDetails } from 'src/app/modules/accounting/models/standerd-account-int-report.model';

@Injectable({
  providedIn: 'root',
})
export class StandardAccountIntReportService {
  constructor(private httpClient: HttpClient) {}

  public GetInputHelpData() {
    return this.httpClient.get(
      createUrl(`Reports/StandardAccountIntReport/GetInputHelpData`)
    );
  }

  public getPeriodString(
    adata: any,
    mdata: any,
    ydata: any
  ): Observable<periodStringDetails> {
    return this.httpClient.get<periodStringDetails>(
      createUrl(
        `Reports/StandardAccountIntReport/GetPeriodString?accType=${adata}&currentMonth=${mdata}&currentYear=${ydata}`
      )
    );
  }

  public GetGrid1Info(adata: any) {
    return this.httpClient.get(
      createUrl(
        `Reports/StandardAccountIntReport/GetGrid1Info?accType=${adata}`
      )
    );
  }

  public GetGrid2Info(acdata: any) {
    return this.httpClient.get(
      createUrl(
        `Reports/StandardAccountIntReport/GetGrid2Info?accType=${acdata}`
      )
    );
  }
}
