import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { IdDescription } from '../interfaces/id-description';
import {
    AutoManualInputHelp,
    ManualInsertModel,
    ManualMemberDataModel,
    MemberDetailsDataModel,
    ManualPostTranModel
} from '../modules/accounting/models/auto-manual-transaction.model';

@Injectable({
  providedIn: 'root',
})
export class AutoAnniversaryService {
  readonly apiAction = environment.baseUrl + 'Accounting/AutoTransferTransaction/AutoAnniversary/';

  constructor(private httpClient: HttpClient) {}

  public getAccountTypeForAutoAnniversary() {
    return this.httpClient.get<any>(
      this.apiAction + 'AnniversaryAccountType'
    );
  }
  public getAccountDetails(AccType:number) {
    return this.httpClient.get<any>(
      this.apiAction + `AccDetailControl?AccType=${AccType}`
    );
  }

  
  public Calculate(AccType:number, AccTypeClass:number) {
    return this.httpClient.get<any>(this.apiAction + `Calculate?AccType=${AccType}&&AccTypeClass=${AccTypeClass}`);
  }

  public Post(data:any) {
    return this.httpClient.post<any>(this.apiAction + `Post`, data);
  }
  
  public Reverse(data:any) {
    return this.httpClient.post<any>(this.apiAction + `Reverse`, data);
  }
  
}