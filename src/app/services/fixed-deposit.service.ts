import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import {
  FixedDepositInputHelp,
  FixedDepositDataModel,
  FixedDepositAccountViewModel,
  FixedDepositCreateModel,
  FixedDepositTransTypeResponseModel,
  IFixedDepositAccountDetails,
} from '../modules/accounting/models/fixed-deposit.model';

@Injectable({
  providedIn: 'root',
})
export class FixedDepositService {
  readonly apiAction = environment.baseUrl + 'Accounting/FixedDeposit/';

  constructor(private httpClient: HttpClient) {}

  public GetInputHelp() {
    return this.httpClient.get<FixedDepositInputHelp>(
      this.apiAction + 'GetInputHelpData'
    );
  }

  public GetDetailsByMember(memNo: number): Observable<FixedDepositDataModel> {
    return this.httpClient.get<FixedDepositDataModel>(
      this.apiAction + 'GetDetailsByMember?memNo=' + memNo
    );
  }

  public OnAccountTypeChange(
    data: FixedDepositDataModel
  ): Observable<FixedDepositAccountViewModel> {
    return this.httpClient.post<FixedDepositAccountViewModel>(
      this.apiAction + 'OnAccountTypeChange',
      data
    );
  }

  public GetAccountDetails(
    accNo: string
  ): Observable<IFixedDepositAccountDetails> {
    return this.httpClient.get<IFixedDepositAccountDetails>(
      this.apiAction + 'GetAccountDetails?accNo=' + accNo
    );
  }

  public OnVoucherNoChange(
    data: FixedDepositDataModel
  ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(
      this.apiAction + 'OnVoucherNoChange',
      data
    );
  }

  public OnTransTypeChange(
    data: FixedDepositCreateModel
  ): Observable<FixedDepositTransTypeResponseModel> {
    return this.httpClient.post<FixedDepositTransTypeResponseModel>(
      this.apiAction + 'OnTransTypeChange',
      data
    );
  }

  public OnGLAccNoChange(
    data: FixedDepositCreateModel
  ): Observable<FixedDepositTransTypeResponseModel> {
    return this.httpClient.post<FixedDepositTransTypeResponseModel>(
      this.apiAction + 'OnGLAccNoChange',
      data
    );
  }

  public AddNewBlankRow(
    data: FixedDepositCreateModel
  ): Observable<FixedDepositTransTypeResponseModel> {
    return this.httpClient.post<FixedDepositTransTypeResponseModel>(
      this.apiAction + 'AddNewBlankRow',
      data
    );
  }

  public onAmountChange(
    data: FixedDepositCreateModel
  ): Observable<FixedDepositTransTypeResponseModel> {
    return this.httpClient.post<FixedDepositTransTypeResponseModel>(
      this.apiAction + 'OnAmountChange',
      data
    );
  }

  public SubmitDeposit(data: FixedDepositCreateModel): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(
      this.apiAction + 'SubmitDeposit',
      data
    );
  }
}
