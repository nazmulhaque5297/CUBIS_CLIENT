import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root',
})
export class DailyCsTransactionVchRptService {
  constructor(private httpClient: HttpClient) {}

  public GetInputHelpData() {
    return this.httpClient.get(
      createUrl(`Reports/DailyCsTransactionVoucherReport/GetInputHelpData`)
    );
  }

  public GetVchInfo(data: any) {
    return this.httpClient.post(
      createUrl(`Reports/DailyCsTransactionVoucherReport/GetVchInfo`),
      data
    );
  }
}
