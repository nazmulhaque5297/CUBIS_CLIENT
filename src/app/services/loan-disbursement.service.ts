import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import {
  DisbursementAccountViewModel,
  IDisbursementAccountDetails,
  ILoanDisbursementApplication,
  LoanDisbursementCreateModel,
  LoanDisbursementDataModel,
  LoanDisbursementInputHelp,
  TransResponseModel,
} from '../modules/accounting/models/loan-disbursement.model';

@Injectable({
  providedIn: 'root',
})
export class LoanDisbursementService {
  readonly apiAction = environment.baseUrl + 'Accounting/LoanDisbursement/';

  constructor(private httpClient: HttpClient) {}

  public GetInputHelp() {
    return this.httpClient.get<LoanDisbursementInputHelp>(
      this.apiAction + 'GetInputHelpData'
    );
  }

  public GetApplicationDetails(applicationNo: string) {
    return this.httpClient.get<ILoanDisbursementApplication>(
      this.apiAction + 'GetApplicationDetails?applicationNo=' + applicationNo
    );
  }

  public GetDetailsByMember(
    data: LoanDisbursementCreateModel
  ): Observable<LoanDisbursementDataModel> {
    return this.httpClient.post<LoanDisbursementDataModel>(
      this.apiAction + 'GetDetailsByMember',
      data
    );
  }

  public OnAccountTypeChange(
    data: LoanDisbursementDataModel
  ): Observable<DisbursementAccountViewModel> {
    return this.httpClient.post<DisbursementAccountViewModel>(
      this.apiAction + 'OnAccountTypeChange',
      data
    );
  }

  public OnVoucherNoChange(
    data: LoanDisbursementDataModel
  ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(
      this.apiAction + 'OnVoucherNoChange',
      data
    );
  }

  public OnTransTypeChange(
    data: LoanDisbursementCreateModel
  ): Observable<TransResponseModel> {
    return this.httpClient.post<TransResponseModel>(
      this.apiAction + 'OnTransTypeChange',
      data
    );
  }

  public onItemChange(
    data: LoanDisbursementCreateModel
  ): Observable<TransResponseModel> {
    return this.httpClient.post<TransResponseModel>(
      this.apiAction + 'OnItemChange',
      data
    );
  }

  public Submit(data: LoanDisbursementCreateModel): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.apiAction + 'Submit', data);
  }
}
