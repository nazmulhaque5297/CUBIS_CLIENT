import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import {
  IInterestAccountDetails,
  InterestAccountViewModel,
  InterestWithdrawCreateModel,
  InterestWithdrawDataModel,
  InterestWithdrawInputHelp,
  TransTypeResponseModel,
  OldMemberViewModel,
} from '../modules/accounting/models/interest-withdrawal.model';

@Injectable({
  providedIn: 'root',
})
export class InterestWithdrawalService {
  readonly apiAction = environment.baseUrl + 'Accounting/InterestWithdrawal/';

  constructor(private httpClient: HttpClient) {}

  public GetInputHelp() {
    return this.httpClient.get<InterestWithdrawInputHelp>(
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
    data: InterestWithdrawCreateModel
  ): Observable<InterestWithdrawDataModel> {
    return this.httpClient.post<InterestWithdrawDataModel>(
      this.apiAction + 'GetDetailsByMember',
      data
    );
  }

  public OnAccountTypeChange(
    data: InterestWithdrawDataModel
  ): Observable<InterestAccountViewModel> {
    return this.httpClient.post<InterestAccountViewModel>(
      this.apiAction + 'OnAccountTypeChange',
      data
    );
  }

  public GetAccountDetails(
    data: InterestWithdrawCreateModel
  ): Observable<IInterestAccountDetails> {
    return this.httpClient.post<IInterestAccountDetails>(
      this.apiAction + 'GetAccountDetails',
      data
    );
  }

  public OnVoucherNoChange(
    data: InterestWithdrawDataModel
  ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(
      this.apiAction + 'OnVoucherNoChange',
      data
    );
  }

  public OnTransTypeChange(
    data: InterestWithdrawCreateModel
  ): Observable<TransTypeResponseModel> {
    return this.httpClient.post<TransTypeResponseModel>(
      this.apiAction + 'OnTransTypeChange',
      data
    );
  }

  public onItemChange(
    data: InterestWithdrawCreateModel
  ): Observable<TransTypeResponseModel> {
    return this.httpClient.post<TransTypeResponseModel>(
      this.apiAction + 'OnItemChange',
      data
    );
  }

  public SubmitDeposit(
    data: InterestWithdrawCreateModel
  ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.apiAction + 'Submit', data);
  }
}
