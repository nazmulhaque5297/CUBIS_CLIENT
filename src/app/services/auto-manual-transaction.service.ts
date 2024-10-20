import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { IdDescription } from '../interfaces/id-description';
import {
  AutoManualInputHelp,
  ManualInsertModel,
  ManualMemberDataModel,
  MemberDetailsDataModel,
  ManualPostTranModel,
} from '../modules/accounting/models/auto-manual-transaction.model';

@Injectable({
  providedIn: 'root',
})
export class AutoManualService {
  readonly apiAction =
    environment.baseUrl +
    'Accounting/AutoTransferTransaction/AutoManualTransaction/';

  constructor(private httpClient: HttpClient) {}

  public GetInputHelp() {
    return this.httpClient.get<AutoManualInputHelp>(
      this.apiAction + 'GetInputHelpData'
    );
  }
  public GetGlCode(AccType: number) {
    return this.httpClient.get<IdDescription>(
      this.apiAction + `GetGL?AccType=${AccType}`
    );
  }

  public GetMemberDetails(
    data: MemberDetailsDataModel
  ): Observable<MemberDetailsDataModel> {
    return this.httpClient.post<MemberDetailsDataModel>(
      this.apiAction + 'MemDetails',
      data
    );
  }
  public AddAllMember(data: ManualInsertModel): Observable<ManualInsertModel> {
    return this.httpClient.post<ManualInsertModel>(
      this.apiAction + 'AddAllMember',
      data
    );
  }
  public UpdateAccount(data: ManualMemberDataModel[]): Observable<any> {
    return this.httpClient.post<any>(this.apiAction + 'UpdateAccount', data);
  }
  public DeleteAccount(data: ManualInsertModel): Observable<ManualInsertModel> {
    return this.httpClient.post<ManualInsertModel>(
      this.apiAction + 'DeleteAccount',
      data
    );
  }
  public Preview(AccType: number) {
    return this.httpClient.get<any>(
      this.apiAction + `Preview?AccType=${AccType}`
    );
  }
  public Post(data: ManualPostTranModel): Observable<ManualPostTranModel> {
    return this.httpClient.post<ManualPostTranModel>(
      this.apiAction + 'Post',
      data
    );
  }

  public Reverse(data: ManualPostTranModel): Observable<ManualPostTranModel> {
    return this.httpClient.post<ManualPostTranModel>(
      this.apiAction + 'Reverse',
      data
    );
  }

  public Refresh(AccType: number): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(
      this.apiAction + `Refresh${AccType}`
    );
  }
}
