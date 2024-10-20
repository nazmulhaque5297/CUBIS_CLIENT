import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import {
  EncashmentInputHelp,
  EncashmentAccountViewModel,
  EncashmentDataModel,
  EncashmentCreateModel,
  IEncashmentAccountDetails,
  TransTypeResponseModel,
  OldMemberViewModel,
} from '../modules/accounting/models/encashment.model';

@Injectable({
  providedIn: 'root',
})
export class EncashmentService {
  readonly apiAction = environment.baseUrl + 'Accounting/Encashment/';
  constructor(private httpClient: HttpClient) {}

  public GetInputHelp() {
    return this.httpClient.get<EncashmentInputHelp>(
      this.apiAction + 'GetInputHelpData'
    );
  }
  public OnAccountTypeChange(
    data: EncashmentDataModel
  ): Observable<EncashmentAccountViewModel> {
    return this.httpClient.post<EncashmentAccountViewModel>(
      this.apiAction + 'OnAccountTypeChange',
      data
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
    data: EncashmentCreateModel
  ): Observable<EncashmentDataModel> {
    return this.httpClient.post<EncashmentDataModel>(
      this.apiAction + 'GetDetailsByMember',
      data
    );
  }

  public OnVoucherNoChange(data: EncashmentDataModel): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(
      this.apiAction + 'OnVoucherNoChange',
      data
    );
  }

  public GetAccountDetails(
    data: EncashmentCreateModel
  ): Observable<TransTypeResponseModel> {
    return this.httpClient.post<TransTypeResponseModel>(
      this.apiAction + 'GetAccountDetails',
      data
    );
  }
  public OnTransTypeChange(
    data: EncashmentCreateModel
  ): Observable<TransTypeResponseModel> {
    return this.httpClient.post<TransTypeResponseModel>(
      this.apiAction + 'OnTransTypeChange',
      data
    );
  }
  public onAmountChange(
    data: EncashmentCreateModel,
    num: number
  ): Observable<TransTypeResponseModel> {
    return this.httpClient.post<TransTypeResponseModel>(
      this.apiAction + 'OnAmountChange?num=' + num,
      data
    );
  }
  public SubmitEncashment(
    data: EncashmentCreateModel
  ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.apiAction + 'Submit', data);
  }
}
