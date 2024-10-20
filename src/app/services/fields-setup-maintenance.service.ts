import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import {
  FieldsSetupMainInputHelp,
  FieldsSetupMainViewModel,
} from 'src/app/interfaces/fields-setup-maintenance';
import { ApiResponse } from '../interfaces/api-response';
import { environment } from 'src/environments/environment';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root',
})
export class FieldsSetupMainService {
  readonly apiAction =
    environment.baseUrl + 'HouseKeeping/FieldsSetupMaintenance/';

  constructor(private httpClient: HttpClient) {}

  public getAll() {
    return this.httpClient.get<FieldsSetupMainInputHelp>(
      this.apiAction + 'GetAll'
    );
  }

  public GetFieldList(data) {
    return this.httpClient.get(
      createUrl(`SystemControl/FieldSetup/GetFieldList?flagId=${data}`)
    );
  }

  public GetAllList() {
    return this.httpClient.get(createUrl(`SystemControl/FieldSetup/GetAll`));
  }

  public GetFieldDetails(cdata: any, fdata: any) {
    return this.httpClient.get(
      createUrl(
        `SystemControl/FieldSetup/GetFieldDetails?fieldId=${cdata}&flagId=${fdata}`
      )
    );
  }

  insert(data: any): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.apiAction + 'Insert', data);
  }

  submit(data: any): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.apiAction + 'Submit', data);
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
