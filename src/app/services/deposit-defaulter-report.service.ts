import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root',
})
export class DepositDefaulterReportService {
  constructor(private httpClient: HttpClient) {}

  public GetInputHelpData() {
    return this.httpClient.get(
      createUrl(`Reports/DepositDefaulterReport/GetInputHelpData`)
    );
  }

  public GetGrid1Info(
    ldata: any,
    amdata: any,
    adata: any,
    mdata: any,
    ydata: any,
    cdata: any,
    gdata: any,
    dfdata: any,
    dtdata: any
  ) {
    return this.httpClient.get(
      createUrl(
        `Reports/DepositDefaulterReport/GetGrid1Info?loanInfoRb=${ldata}&accTypeMode=${amdata}&accType=${adata}&monthDdl=${mdata}&yearDdl=${ydata}&collector=${cdata}&group=${gdata}&defaulterInputFrom=${dfdata}&defaulterInputTo=${dtdata}`
      )
    );
  }

  public GetGrid2Info(
    mtdata: any,
    mndata: any,
    andata: any,
    amdata: any,
    acdata: any,
    mdata: any,
    ydata: any
  ) {
    return this.httpClient.get(
      createUrl(
        `Reports/DepositDefaulterReport/GetGrid2Info?MemType=${mtdata}&MemNo=${mndata}&AccNo=${andata}&accTypeMode=${amdata}&accType=${acdata}&monthDdl=${mdata}&yearDdl=${ydata}`
      )
    );
  }
}
