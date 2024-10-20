import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/interfaces/api-response';
import { IdDescription } from 'src/app/interfaces/id-description';
import { environment } from 'src/environments/environment';
import { IAutoVoucherModel } from '../models/system-setup-model';
import {
  ITransactionControl,
  ITransactionControlItem,
} from '../models/transaction-control-setup.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionControlSetupService {
  readonly apiAction = environment.baseUrl + 'HouseKeeping/SystemSetup/';

  constructor(private httpClient: HttpClient) {}

  public GetAccountClassList(): Observable<IdDescription[]> {
    return this.httpClient
      .get<IdDescription[]>(
        environment.baseUrl + `InputHelp/GetAccountClassList`
      )
      .pipe(catchError(this.handleError));
  }

  public GetTransactionControlFlags(): Observable<IdDescription[]> {
    return this.httpClient
      .get<IdDescription[]>(
        this.apiAction + `TransControlSetup/GetTransactionControlFlags`
      )
      .pipe(catchError(this.handleError));
  }

  public GetTransControlList(id: number): Observable<ITransactionControl[]> {
    return this.httpClient
      .get<ITransactionControl[]>(
        this.apiAction + `TransControlSetup/GetTransControlList?classId=` + id
      )
      .pipe(catchError(this.handleError));
  }

  public Update(data: ITransactionControlItem[]): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(
      this.apiAction + 'TransControlSetup/Update',
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
