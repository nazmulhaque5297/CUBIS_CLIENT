import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MemRegRptReportInputHelp } from '../Models/memregrpt-report.model';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root',
})
export class MemRegRptService {
  readonly apiAction = environment.baseUrl + 'Reports/MemRegRpt/';

  constructor(private httpClient: HttpClient) {}

  getInputHelp(): Observable<MemRegRptReportInputHelp> {
    return this.httpClient.get<MemRegRptReportInputHelp>(
      this.apiAction + 'GetInputHelpData'
    );
  }
}
