import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry } from 'rxjs/operators';
import { ApiResponse } from 'src/app/interfaces/api-response';
import { environment } from 'src/environments/environment';
import {
  MemInfoAccountList,
  AccountTransferViewModel,
} from '../models/special-account-transfer.model';

@Injectable({
  providedIn: 'root',
})
export class SpecialAccountTransferService {
  readonly apiAction =
    environment.baseUrl + 'Accounting/SpecialFunction/AccountTransfer/';

  constructor(private httpClient: HttpClient) {}

  public GetMemberAndAccTypeInfo(MemNo: number) {
    return this.httpClient.get<MemInfoAccountList>(
      this.apiAction + `MemInfoAccTypeList?MemNo=${MemNo}`
    );
  }
  public GetAccTypeInfo(
    data: AccountTransferViewModel
  ): Observable<AccountTransferViewModel> {
    return this.httpClient.post<AccountTransferViewModel>(
      this.apiAction + 'AccTypeInfo',
      data
    );
  }
  public GetAccNoInfo(
    data: AccountTransferViewModel
  ): Observable<AccountTransferViewModel> {
    return this.httpClient.post<AccountTransferViewModel>(
      this.apiAction + 'AccNoDetails',
      data
    );
  }
  public GetTrnMemDetails(
    data: AccountTransferViewModel
  ): Observable<AccountTransferViewModel> {
    return this.httpClient.post<AccountTransferViewModel>(
      this.apiAction + 'TrnMemDetails',
      data
    );
  }
  public Transfer(
    data: AccountTransferViewModel
  ): Observable<AccountTransferViewModel> {
    return this.httpClient.post<AccountTransferViewModel>(
      this.apiAction + 'Transfer',
      data
    );
  }
}
