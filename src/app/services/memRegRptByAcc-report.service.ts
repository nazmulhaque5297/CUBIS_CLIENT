import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  MemRegRptByAccReportInputHelp,
  MemRegRptByAccReportAccTypeDetails,
} from '../Models/memregrptbyacc-report.model';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root',
})
export class MemRegRptByAccService {
  readonly apiAction = environment.baseUrl + 'Reports/MemRegRptByAcc/';

  constructor(private httpClient: HttpClient) {}

  getInputHelp(): Observable<MemRegRptByAccReportInputHelp> {
    return this.httpClient.get<MemRegRptByAccReportInputHelp>(
      this.apiAction + 'GetInputHelpData'
    );
  }
}
