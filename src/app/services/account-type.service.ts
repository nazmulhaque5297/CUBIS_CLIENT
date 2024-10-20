import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import {
  AccountTypeDisplayModel,
  AccountTypeGLDetailsModel,
  AccountTypeInputHelp,
  AccountTypeViewModel,
} from '../interfaces/account-type';
import { ApiResponse } from '../interfaces/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountTypeService {
  readonly apiAction =
    environment.baseUrl + 'SystemControl/AccountTypeMaintenance/';

  constructor(private httpClient: HttpClient) {}

  public getInputHelp() {
    return this.httpClient.get<AccountTypeInputHelp>(
      this.apiAction + 'GetInputHelp'
    );
  }

  public GetDetails(id: number): Observable<AccountTypeViewModel> {
    return this.httpClient
      .get<AccountTypeViewModel>(this.apiAction + `GetDetails?id=` + id)
      .pipe(catchError(this.handleError));
  }

  public getGLDetails(
    glCode: number,
    type: number
  ): Observable<AccountTypeGLDetailsModel> {
    return this.httpClient
      .get<AccountTypeGLDetailsModel>(
        this.apiAction + `GetGLDetails?glCode=` + glCode + '&type=' + type
      )
      .pipe(catchError(this.handleError));
  }

  public getViewDisplayList() {
    return this.httpClient.get<AccountTypeDisplayModel[]>(
      this.apiAction + `GetViewDisplayList`
    );
  }

  update(data: any): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.apiAction + 'Update', data);
  }

  submit(data: any): Observable<any> {
    return this.httpClient.post<any>(this.apiAction + 'Submit', data);
  }

  public updateMiscellaneousAcc() {
    return this.httpClient.get<ApiResponse>(
      this.apiAction + `UpdateMisellaneousAcc`
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
