import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry } from 'rxjs/operators';
import { ApiResponse } from 'src/app/interfaces/api-response';
import { environment } from 'src/environments/environment';
import {
  TransferBalanceViewModel,
  TransferFromModel,
  TransferToModel,
} from '../models/special-account-balance-transfer.model';

@Injectable({
  providedIn: 'root',
})
export class SpecialBalanceTransferService {
  readonly apiAction =
    environment.baseUrl + 'Accounting/AccountBalanceTransfer/';

  constructor(private httpClient: HttpClient) {}

  public GetFromMemberDetails({
    data,
  }: {
    data: TransferFromModel;
  }): Observable<TransferFromModel> {
    return this.httpClient.post<TransferFromModel>(
      this.apiAction + 'GetFromMemberDetails',
      data
    );
  }

  public GetToMemberDetails(
    data: TransferToModel
  ): Observable<TransferToModel> {
    return this.httpClient.post<TransferToModel>(
      this.apiAction + 'GetToMemberDetails',
      data
    );
  }

  public Transfer(data: TransferBalanceViewModel): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.apiAction + 'Submit', data);
  }
}
