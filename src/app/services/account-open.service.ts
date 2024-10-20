import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import {
  AccountOpenInputHelp,
  IAccountOpenCreate,
  IAccountOpenMemberDetails,
  IAccountOpenPeriodSlab,
  IAccountOpenViewModel,
} from '../modules/accounting/models/account-open.model';

@Injectable({
  providedIn: 'root',
})
export class AccountOpenService {
  MemNo: number;
  AccNo: string;
  MemType: number;
  AccType: number;
  checkTemp: boolean = false;

  readonly apiAction =
    environment.baseUrl + 'Accounting/AccountOpenMaintenance/';

  constructor(private httpClient: HttpClient) {}

  public GetInputHelp() {
    return this.httpClient.get<AccountOpenInputHelp>(
      this.apiAction + 'GetInputHelpData'
    );
  }

  public OnAccountTypeChange(accTypeId: number) {
    return this.httpClient.get<IAccountOpenViewModel>(
      this.apiAction + 'OnAccountTypeChange?accTypeId=' + accTypeId
    );
  }

  public EditAccountTypeChange(
    accTypeId: number,
    MemNo: number,
    MemType: number
  ) {
    return this.httpClient.get<IAccountOpenViewModel>(
      this.apiAction +
        `OnEditAccountTypeChange?accTypeId=${+accTypeId}&&MemNo=${MemNo}&&MemType=${MemType}`
    );
  }
  public GetEditDetialsByAccountNo(accTypeId: number, AccNo: string) {
    return this.httpClient.get<IAccountOpenViewModel>(
      this.apiAction +
        `OnAccountNoChange?accTypeId=${+accTypeId}&&AccNo=${AccNo}`
    );
  }
  public GetCorrAccDetailsAccountNo(
    MemNo: number,
    MemType: number,
    AccNo: string
  ) {
    return this.httpClient.get<any>(
      this.apiAction +
        `OnCorrAccChange?MemNo=${+MemNo}&&MemType=${MemType}&&AccNo=${AccNo}`
    );
  }

  public GetDetailsByMember(
    memNo: number,
    AccCorrType: number,
    AccFlag: number,
    AccType: number
  ): Observable<IAccountOpenMemberDetails> {
    return this.httpClient.get<IAccountOpenMemberDetails>(
      this.apiAction +
        `GetDetailsByMember?memNo=${+memNo}&&AccCorrType=${+AccCorrType}&&AccFlag=${+AccFlag}&&AccType=${AccType}`
    );
  }

  public Submit(data: IAccountOpenCreate): Observable<any> {
    return this.httpClient.post<any>(this.apiAction + 'Submit', data);
  }

  public Update(data: IAccountOpenCreate): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.apiAction + 'Update', data);
  }

  public OnDepositAmountChange(data) {
    return this.httpClient.post<any>(
      this.apiAction + 'OnDepositAmountChange',
      data
    );
  }

  public OnPeriodChange(data: any): Observable<IAccountOpenPeriodSlab> {
    return this.httpClient.post<IAccountOpenPeriodSlab>(
      this.apiAction + 'OnPeriodChange',
      data
    );
  }

  //Delete Temp Nominee

  public DeleteTempNomi(): Observable<any> {
    return this.httpClient.get<any>(this.apiAction + `DeleteTempNominee`);
  }
}
