import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import {
  LoanSettlementInputHelp,
  LoanSettlementDataModel,
  LoanSettlementAccountViewModel,
  LoanSettlementCreateModel,
  LoanSettlementTransTypeResponseModel,
  ILoanSettlementAccountDetails,
} from '../modules/accounting/models/loan-settlement.model';

@Injectable({
  providedIn: 'root',
})
export class LoanSettlementService {
  readonly apiAction = environment.baseUrl + 'Accounting/LoanSettlement/';

  constructor(private httpClient: HttpClient) {}

  public GetInputHelp() {
    return this.httpClient.get<LoanSettlementInputHelp>(
      this.apiAction + 'GetInputHelpData'
    );
  }

  public GetDetailsByMember(
    memNo: number
  ): Observable<LoanSettlementDataModel> {
    return this.httpClient.get<LoanSettlementDataModel>(
      this.apiAction + 'GetDetailsByMember?memNo=' + memNo
    );
  }

  public OnAccountTypeChange(
    data: LoanSettlementDataModel
  ): Observable<LoanSettlementAccountViewModel> {
    return this.httpClient.post<LoanSettlementAccountViewModel>(
      this.apiAction + 'OnAccountTypeChange',
      data
    );
  }

  public GetAccountDetails(
    accNo: string
  ): Observable<ILoanSettlementAccountDetails> {
    return this.httpClient.get<ILoanSettlementAccountDetails>(
      this.apiAction + 'GetAccountDetails?accNo=' + accNo
    );
  }

  public OnVoucherNoChange(
    data: LoanSettlementDataModel
  ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(
      this.apiAction + 'OnVoucherNoChange',
      data
    );
  }

  public OnTransTypeChange(
    data: LoanSettlementCreateModel
  ): Observable<LoanSettlementTransTypeResponseModel> {
    return this.httpClient.post<LoanSettlementTransTypeResponseModel>(
      this.apiAction + 'OnTransTypeChange',
      data
    );
  }

  public onAmountChange(
    data: LoanSettlementCreateModel
  ): Observable<LoanSettlementTransTypeResponseModel> {
    return this.httpClient.post<LoanSettlementTransTypeResponseModel>(
      this.apiAction + 'onAmountChange',
      data
    );
  }

  public SubmitDeposit(
    data: LoanSettlementCreateModel
  ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(
      this.apiAction + 'SubmitDeposit',
      data
    );
  }
}
