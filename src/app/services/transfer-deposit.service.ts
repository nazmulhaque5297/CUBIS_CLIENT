import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import {
  TransferDepositInputHelp,
  TransferDepositViewModel,
  TransferDepositAccountViewModel,
  TransferDepositResponseModel,
  TransferDepositCreateModel,
} from '../modules/accounting/models/transfer-deposit.model';

@Injectable({
  providedIn: 'root',
})
export class TransferDepositService {
  readonly apiAction = environment.baseUrl + 'Accounting/TransferDeposit/';

  constructor(private httpClient: HttpClient) {}

  public GetInputHelp() {
    return this.httpClient.get<TransferDepositInputHelp>(
      this.apiAction + 'GetInputHelpData'
    );
  }

  public GetDetailsByMember(
    memNo: number
  ): Observable<TransferDepositViewModel> {
    return this.httpClient.get<TransferDepositViewModel>(
      this.apiAction + 'GetDetailsByMember?memNo=' + memNo
    );
  }

  public OnAccountTypeChange(
    data: TransferDepositViewModel
  ): Observable<TransferDepositAccountViewModel> {
    return this.httpClient.post<TransferDepositAccountViewModel>(
      this.apiAction + 'OnAccountTypeChange',
      data
    );
  }

  //   public GetAccountDetails(data:TransferDepositCreateModel): Observable<TransferDepositAccountViewModel> {
  //     return this.httpClient.post<TransferDepositAccountViewModel>(this.apiAction+"GetAccountDetails",data);
  // }

  public GetAccountDetails(
    data: TransferDepositViewModel
  ): Observable<TransferDepositAccountViewModel> {
    return this.httpClient.post<TransferDepositAccountViewModel>(
      this.apiAction + 'GetAccountDetails',
      data
    );
  }

  public OnVoucherNoChange(
    data: TransferDepositViewModel
  ): Observable<TransferDepositResponseModel> {
    return this.httpClient.post<TransferDepositResponseModel>(
      this.apiAction + 'OnVoucherNoChange',
      data
    );
  }

  public onAmountChange(
    data: TransferDepositViewModel
  ): Observable<TransferDepositResponseModel> {
    return this.httpClient.post<TransferDepositResponseModel>(
      this.apiAction + 'onAmountChange',
      data
    );
  }

  public SubmitDeposit(
    data: TransferDepositCreateModel
  ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(
      this.apiAction + 'SubmitDeposit',
      data
    );
  }
}
