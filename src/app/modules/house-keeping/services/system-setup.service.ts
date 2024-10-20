import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/interfaces/api-response';
import { environment } from 'src/environments/environment';
import { IAutoVoucherModel } from '../models/system-setup-model';

@Injectable({
  providedIn: 'root',
})
export class SystemSetupService {
  readonly apiAction = environment.baseUrl + 'HouseKeeping/SystemSetup/';

  constructor(private httpClient: HttpClient) {}

  public GetFuncOptList(): Observable<IAutoVoucherModel[]> {
    return this.httpClient
      .get<IAutoVoucherModel[]>(
        this.apiAction + `AutoVoucherPrint/GetFuncOptList`
      )
      .pipe(catchError(this.handleError));
  }

  public UpdateAutoVoucherPrint(
    data: IAutoVoucherModel[]
  ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(
      this.apiAction + 'AutoVoucherPrint/Update',
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
