import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { ParameterMainGLedgerInputHelp } from '../interfaces/parameter-maintenance-gledger';
import { ApiResponse } from '../interfaces/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ParameterMainGLedgerService {
  readonly apiAction =
    environment.baseUrl + 'HouseKeeping/ParameterMainGLedger/';

  constructor(private httpClient: HttpClient) {}

  public getParameter() {
    return this.httpClient.get<ParameterMainGLedgerInputHelp>(
      this.apiAction + 'GetParameterValue'
    );
  }
  update(data: any): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.apiAction + 'Update', data);
  }
}
