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
  ManualPostTranModel,
} from '../modules/accounting/models/auto-manual-transaction.model';

@Injectable({
  providedIn: 'root',
})
export class AutoBenefitService {
  readonly apiAction =
    environment.baseUrl +
    'Accounting/AutoTransferTransaction/AutoBenefitTransfer/';

  constructor(private httpClient: HttpClient) {}

  public getAccountTypeForAutoBenefit() {
    return this.httpClient.get<any>(this.apiAction + 'AccountTypeBenefit');
  }

  public getAccountDetailAndControl(AccType: number) {
    return this.httpClient.get<any>(
      this.apiAction + `AccDetailControl?AccType=${AccType}`
    );
  }

  public Calculate(AccType: number) {
    return this.httpClient.get<any>(
      this.apiAction + `Calculate?AccType=${AccType}`
    );
  }

  public UpdateRecordMark(RecordMark: number, Id: number) {
    return this.httpClient.get<any>(
      this.apiAction + `UpdateRecord?RecordMark=${RecordMark}&&Id=${Id}`
    );
  }

  public Post(data: any) {
    return this.httpClient.post<any>(this.apiAction + `Post`, data);
  }

  public Reverse(data: any) {
    return this.httpClient.post<any>(this.apiAction + `Reverse`, data);
  }

  public SearchReverse(data: any) {
    return this.httpClient.post<any>(this.apiAction + `SearchReverse`, data);
  }
}
