import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { InterestWithdrawDataModel } from '../modules/accounting/models/interest-withdrawal.model';
import {
  IAccountDetails,
  IWithdrawCreate,
  MemberChangeMode,
  TransactionGridViewModel,
  VoucherChangeViewModel,
  WithdrawAccountViewModel,
  WithdrawalDataModel,
  WithdrawalInputHelpViewModel,
  WithdrawalViewModel,
  OldMemberViewModel,
} from '../modules/accounting/models/payment-withdrawal.model';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root',
})
export class PaymentWithdrawalService {
  readonly apiAction = environment.baseUrl + 'Accounting/PaymentWithdrawal/';

  constructor(private httpClient: HttpClient) {}

  public GetInputHelp() {
    return this.httpClient.get<WithdrawalInputHelpViewModel>(
      this.apiAction + 'GetInputHelpData'
    );
  }

  public OnAccountTypeChange(
    data: WithdrawalDataModel
  ): Observable<WithdrawAccountViewModel> {
    return this.httpClient.post<WithdrawAccountViewModel>(
      this.apiAction + 'OnAccountTypeChange',
      data
    );
  }

  public GetAccountDetails(accNo: string): Observable<IAccountDetails> {
    return this.httpClient.get<IAccountDetails>(
      this.apiAction + 'GetAccountDetails?accNo=' + accNo
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
    data: WithdrawalViewModel
  ): Observable<WithdrawalDataModel> {
    return this.httpClient.post<WithdrawalDataModel>(
      this.apiAction + 'GetDetailsByMember',
      data
    );
  }

  public Submit(data: IWithdrawCreate): Observable<ApiResponse> {
    console.log(data);
    return this.httpClient.post<ApiResponse>(this.apiAction + 'Submit', data);
  }

  public onVoucherNoChange(
    data: IWithdrawCreate
  ): Observable<VoucherChangeViewModel> {
    return this.httpClient.post<VoucherChangeViewModel>(
      this.apiAction + 'OnVoucherChange',
      data
    );
  }

  public TrnHistory(
    data: MemberChangeMode
  ): Observable<TransactionGridViewModel> {
    return this.httpClient.post<TransactionGridViewModel>(
      this.apiAction + 'GetTrnHistory',
      data
    );
  }

  public GetCorrAccNo(AccNo: any) {
    return this.httpClient.get(
      createUrl(
        `Accounting/PaymentWithdrawal/GetCorrAccHelpData?AccNo=` + AccNo
      )
    );
  }
}
