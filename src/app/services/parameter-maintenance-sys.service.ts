import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { ParameterMainSysInputHelp } from '../interfaces/parameter-maintenance-sys';
import { ApiResponse } from '../interfaces/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ParameterMainSysService {
  readonly apiAction =
    environment.baseUrl + 'HouseKeeping/SYSParameterMaintenance/';

  constructor(private httpClient: HttpClient) {}

  public getParameter() {
    return this.httpClient.get<ParameterMainSysInputHelp>(
      this.apiAction + 'GetAll'
    );
  }
  update(data: any): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.apiAction + 'Update', data);
  }
}
