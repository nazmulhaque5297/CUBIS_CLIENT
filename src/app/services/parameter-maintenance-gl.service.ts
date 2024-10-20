import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import {
  ParameterMainGLInputHelp,
  ParameterMainGLViewModel,
} from '../interfaces/parameter-maintenance-gl';
import { ApiResponse } from '../interfaces/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ParameterMainGLService {
  readonly apiAction =
    environment.baseUrl + 'HouseKeeping/ParameterMaintenanceGeneral/';

  constructor(private httpClient: HttpClient) {}

  public getParameter() {
    return this.httpClient.get<ParameterMainGLInputHelp>(
      this.apiAction + 'GetParameter'
    );
  }

  update(data: any): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.apiAction + 'Update', data);
  }

  public GetIndexChangeDetails(
    data: any
  ): Observable<ParameterMainGLViewModel> {
    return this.httpClient.post<ParameterMainGLViewModel>(
      this.apiAction + 'GetIndexChangeDetails',
      data
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
