import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CoaReportInputHelp } from '../Models/coa-report.model';

@Injectable({
  providedIn: 'root'
})
export class CoaReportService {
  readonly apiAction=environment.baseUrl+"Reports/CoaReport/";
  
  constructor(private httpClient: HttpClient) { }

  getInputHelp(): Observable<CoaReportInputHelp> {
    return this.httpClient.get<CoaReportInputHelp>(this.apiAction+"GetInputHelpData");
  }

}
