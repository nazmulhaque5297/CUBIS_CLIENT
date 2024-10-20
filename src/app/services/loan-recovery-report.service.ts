import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUrl } from '../utility/common';
import {
  
  AccClassDetails,
} from '../Models/loanreceived-report.model';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanRecoveryReportService
{
    constructor(private httpClient: HttpClient) { }

    public GetInputHelpData(){
        return this.httpClient.get(createUrl(`Reports/LoanRecoveryReport/GetInputHelpData`));
      }

      getAccTypeClassDetails(data: any): Observable<AccClassDetails> {
        return this.httpClient.get<AccClassDetails>(
          
          createUrl(`Reports/LoanRecoveryReport/GetAccTypeMode?accTypeCode=${data}`)
        );
      }

     
}