import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root'
})
export class LedgerBalanceReportReportService
{
    constructor(private httpClient: HttpClient) { }

    public GetInputHelpData(){
        return this.httpClient.get(createUrl(`Reports/ProductLedgerBalanceReport/GetInputHelpData`));
      }
 
}