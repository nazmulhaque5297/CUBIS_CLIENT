import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { MemberCreateResponse } from '../interfaces/api-response';
import { environment } from 'src/environments/environment';
import {
  IVillageDetails,
  MemberApplicationInputHelp,
  MemberApplicationModel,
  OldMemberInfo,
} from '../modules/accounting/models/member-application.model';

@Injectable({
  providedIn: 'root',
})
export class MemberApplicationService {
  readonly apiAction = environment.baseUrl + 'Accounting/MemberMaintenance/';

  constructor(private httpClient: HttpClient) {}

  public getInputHelp() {
    return this.httpClient.get<MemberApplicationInputHelp>(
      this.apiAction + 'GetInputHelpData'
    );
  }

  public GetApplicationDetails(
    memNo: number
  ): Observable<MemberApplicationModel> {
    return this.httpClient
      .get<MemberApplicationModel>(
        this.apiAction + `GetInformationMemNo?memNo=` + memNo
      )
      .pipe(catchError(this.handleError));
  }

  public GetOldMemberInfo(id: number): Observable<OldMemberInfo> {
    return this.httpClient
      .get<OldMemberInfo>(this.apiAction + `GetInfoOldMember?memNo=` + id)
      .pipe(catchError(this.handleError));
  }

  public GetVillageDetails(villageCode: number): Observable<IVillageDetails> {
    return this.httpClient
      .get<IVillageDetails>(
        this.apiAction + `GetVillageDetails?villageCode=` + villageCode
      )
      .pipe(catchError(this.handleError));
  }

  Insert(data: any): Observable<MemberCreateResponse> {
    return this.httpClient.post<MemberCreateResponse>(
      this.apiAction + 'Insert',
      data
    );
  }

  Update(data: any): Observable<MemberCreateResponse> {
    return this.httpClient.post<MemberCreateResponse>(
      this.apiAction + 'Update',
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
