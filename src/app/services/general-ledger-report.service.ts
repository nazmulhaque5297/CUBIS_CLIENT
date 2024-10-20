import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root',
})
export class GeneralLedgerReportService {
  constructor(private httpClient: HttpClient) {}

  public GetInputHelpData() {
    return this.httpClient.get(
      createUrl(`Reports/GeneralLedgerReport/GetInputHelpData`)
    );
  }
  public MemberNumber(data: any) {
    return this.httpClient.get(
      createUrl(`Reports/GeneralLedgerReport/GetTableData?memberNum=` + data)
    );
  }
}
