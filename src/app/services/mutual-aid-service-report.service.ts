import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root',
})
export class MutualAidServiceReportService {
  constructor(private httpClient: HttpClient) {}

  public GetInputHelpData() {
    return this.httpClient.get(
      createUrl(`Reports/MutualAidServiceReport/GetInputHelpData`)
    );
  }

  public GetGrid1Info(arbdata: any) {
    return this.httpClient.get(
      createUrl(
        `Reports/MutualAidServiceReport/GetGrid1Info?AccountServiceRb=${arbdata}`
      )
    );
  }

  
//For Detail list report
  public GetMiscAccGridInfo() {
    return this.httpClient.get(
      createUrl(`Reports/MutualAidServiceReport/GetMiscAccGridInfo`)
    );
  }

}
