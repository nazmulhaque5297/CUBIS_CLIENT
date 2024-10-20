import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import {
  CashDepositInputHelp,
  CashDepositViewModel,
  ICashDepositAccountDetails,
  ICashDepositTransactionModel,
  IGLCodeChangeResponse,
  CashDepositCommonoModel,
  OldMemberViewModel,
} from '../modules/accounting/models/cash-deposit.model';

@Injectable({
  providedIn: 'root',
})
export class CashDepositService {
  readonly apiAction = environment.baseUrl + 'Accounting/CashDeposit/';

  constructor(private httpClient: HttpClient) {}

  public GetInputHelp() {
    return this.httpClient.get<CashDepositInputHelp>(
      this.apiAction + 'GetInputHelpData'
    );
  }

  public GetDepositTransactions() {
    return this.httpClient.get<ICashDepositTransactionModel>(
      this.apiAction + 'GetDepositTransactions'
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
    memNo: number,
    module: number
  ): Observable<CashDepositViewModel> {
    return this.httpClient.get<CashDepositViewModel>(
      this.apiAction +
        'GetDetailsByMember?memNo=' +
        memNo +
        `&moduleNo=` +
        module
    );
  }

  public GetAccountDetails(
    accountNo: number
  ): Observable<ICashDepositAccountDetails> {
    return this.httpClient.get<ICashDepositAccountDetails>(
      this.apiAction + 'GetAccountDetails?accountNo=' + accountNo
    );
  }

  public SelectAccountFromHelp(
    data: CashDepositViewModel
  ): Observable<CashDepositCommonoModel> {
    return this.httpClient.post<CashDepositCommonoModel>(
      this.apiAction + 'SelectAccountFromHelp',
      data
    );
  }

  public GLCodeChange(
    data: CashDepositViewModel
  ): Observable<IGLCodeChangeResponse> {
    return this.httpClient.post<IGLCodeChangeResponse>(
      this.apiAction + 'GLCodeChange',
      data
    );
  }

  public InvalidGLCodeChange(data: number): Observable<IGLCodeChangeResponse> {
    return this.httpClient.get<IGLCodeChangeResponse>(
      this.apiAction + 'InvalidGLCodeChange?id=' + data
    );
  }

  public onAmountChange(
    data: CashDepositViewModel
  ): Observable<IGLCodeChangeResponse> {
    return this.httpClient.post<IGLCodeChangeResponse>(
      this.apiAction + 'onAmountChange',
      data
    );
  }

  public SubmitDeposit(data: CashDepositViewModel): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(
      this.apiAction + 'SubmitDeposit',
      data
    );
  }

  public CheckVchNo(data: CashDepositViewModel): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.apiAction + 'CheckVch', data);
  }
  public InsertVch(data: CashDepositViewModel): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.apiAction + 'InserVch', data);
  }

  public DeleteTran(id: Number): Observable<IGLCodeChangeResponse> {
    return this.httpClient.get<IGLCodeChangeResponse>(
      this.apiAction + 'DeleteTran?id=' + id
    );
  }
}
