import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JournalReportInputHelp } from '../Models/journal-report.model';

import { createUrl } from '../utility/common';
import { UserModule, UserInfo } from '../Models/Common.model';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class JournalReportService {
  readonly apiAction = environment.baseUrl + 'Reports/JournalReport/';

  constructor(private httpClient: HttpClient) {}

  getInputHelp(): Observable<JournalReportInputHelp> {
    return this.httpClient.get<JournalReportInputHelp>(
      this.apiAction + 'GetInputHelpData'
    );
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
