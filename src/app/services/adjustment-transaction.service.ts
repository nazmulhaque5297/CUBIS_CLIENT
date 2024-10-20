import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { IdDescription } from '../interfaces/id-description';
import {
  AdjustmentAccountViewModel,
  AdjustmentCreateModel,
  AdjustmentDataModel,
  AdjustmentInputHelp,
  TransResponseModel,
  OldMemberViewModel,
  IAdjustmentAccountDetails,
} from '../modules/accounting/models/adjustment-transaction.model';

@Injectable({
  providedIn: 'root',
})
export class AdjustmentService {
  readonly apiAction = environment.baseUrl + 'Accounting/Adjustment/';

  constructor(private httpClient: HttpClient) {}

  public GetInputHelp() {
    return this.httpClient.get<AdjustmentInputHelp>(
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
    data: AdjustmentCreateModel
  ): Observable<AdjustmentDataModel> {
    return this.httpClient.post<AdjustmentDataModel>(
      this.apiAction + 'GetDetailsByMember',
      data
    );
  }

  public OnAccountTypeChange(
    data: AdjustmentDataModel
  ): Observable<AdjustmentAccountViewModel> {
    return this.httpClient.post<AdjustmentAccountViewModel>(
      this.apiAction + 'OnAccountTypeChange',
      data
    );
  }

  public OnVoucherNoChange(data: AdjustmentDataModel): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(
      this.apiAction + 'OnVoucherNoChange',
      data
    );
  }

  public OnTransTypeChange(
    data: AdjustmentCreateModel
  ): Observable<TransResponseModel> {
    return this.httpClient.post<TransResponseModel>(
      this.apiAction + 'OnTransTypeChange',
      data
    );
  }

  public GetAccountDetails(
    accNo: string
  ): Observable<IAdjustmentAccountDetails> {
    return this.httpClient.get<IAdjustmentAccountDetails>(
      this.apiAction + 'GetAccountDetails?accNo=' + accNo
    );
  }

  public OnBankChange(
    data: AdjustmentCreateModel
  ): Observable<TransResponseModel> {
    return this.httpClient.post<TransResponseModel>(
      this.apiAction + 'OnBankChange',
      data
    );
  }

  public GetTrfHeadDetailCodeList(
    headCode: number
  ): Observable<IdDescription[]> {
    return this.httpClient.get<IdDescription[]>(
      this.apiAction + 'GetTrfHeadDetailCodeList?headCode=' + headCode
    );
  }

  public onItemChange(
    data: AdjustmentCreateModel
  ): Observable<TransResponseModel> {
    return this.httpClient.post<TransResponseModel>(
      this.apiAction + 'OnItemChange',
      data
    );
  }

  public Submit(data: AdjustmentCreateModel): Observable<any> {
    return this.httpClient.post<any>(this.apiAction + 'Submit', data);
  }

  public CloseAccount(data: AdjustmentCreateModel): Observable<any> {
    return this.httpClient.post<any>(this.apiAction + 'CloseAccount', data);
  }
}
