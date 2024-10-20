import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MemberNumberGenerateReportInputHelp } from '../Models/generate-new-memberno-report.model';

@Injectable({
  providedIn: 'root',
})
export class GMemNoReportService {
  readonly apiAction = environment.baseUrl + 'Reports/GMemNoReport/';

  constructor(private httpClient: HttpClient) {}

  getInputHelp(): Observable<MemberNumberGenerateReportInputHelp> {
    return this.httpClient.get<MemberNumberGenerateReportInputHelp>(
      this.apiAction + 'GetInputHelpData'
    );
  }
}
