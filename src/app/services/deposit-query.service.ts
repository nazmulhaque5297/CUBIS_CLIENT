import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import {
  DepositQueryCreateModel,
  DepositQueryDataModel,
  DepositQueryInputHelp,
  IAmountChangeResponse,
  OldMemberViewModel,
} from '../modules/accounting/models/deposit-query.model';

@Injectable({
  providedIn: 'root',
})
export class DepositQueryService {
  readonly apiAction = environment.baseUrl + 'Accounting/DepositQuery/';

  constructor(private httpClient: HttpClient) {}

  public GetInputHelp() {
    return this.httpClient.get<DepositQueryInputHelp>(
      this.apiAction + 'GetInputHelpData'
    );
  }

  public GetDetailsByOldMemberNo(
    data: OldMemberViewModel
  ): Observable<OldMemberViewModel> {
    return this.httpClient.post<OldMemberViewModel>(
      this.apiAction + 'GetNewMemberByOldMember',
      data
    );
  }

  public GetDetailsByMember(
    data: DepositQueryCreateModel
  ): Observable<DepositQueryDataModel> {
    return this.httpClient.post<DepositQueryDataModel>(
      this.apiAction + 'GetDetailsByMember',
      data
    );
  }

  public OnVoucherNoChange(
    data: DepositQueryCreateModel
  ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(
      this.apiAction + 'OnVoucherNoChange',
      data
    );
  }

  public OnItemChange(
    data: DepositQueryCreateModel
  ): Observable<IAmountChangeResponse> {
    return this.httpClient.post<IAmountChangeResponse>(
      this.apiAction + 'OnItemChange',
      data
    );
  }

  public Submit(data: DepositQueryCreateModel): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.apiAction + 'Submit', data);
  }
}
