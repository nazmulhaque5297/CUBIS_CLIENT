import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MemberCreateResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class OpenMemberInformationService {
  MemNo: number;
  MemType: number;

  readonly apiAction =
    environment.baseUrl + 'Accounting/OpenMemberMaintenance/';

  constructor(private httpClient: HttpClient) {}

  public getMemNo(Memtype: any) {
    return this.httpClient
      .get(this.apiAction + `MemNo?Memtype=` + Memtype)
      .pipe(catchError(this.handleError));
  }

  Insert(data: any) {
    return this.httpClient.post(this.apiAction + 'Insert', data);
  }

  public saveAccData(body: any) {
    return this.httpClient.post(this.apiAction + `SaveAccInfoData`, body);
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
