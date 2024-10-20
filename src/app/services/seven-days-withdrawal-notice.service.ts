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
export class SevenDaysWithdrwalNoticeService {
  readonly apiAction = environment.baseUrl + 'Accounting/SevenDaysWithdrwalNotice/';

  constructor(private httpClient: HttpClient) {}
  
  public GetMemNo(MemNo:number) {
    return this.httpClient.get<any>(
      this.apiAction + `MemberName?MemNo=${MemNo}`
    );
  }

  public GetAccList(MemNo:number) {
    return this.httpClient.get<any>(
      this.apiAction + `AccList?MemNo=${MemNo}`
    );
  }
  public GetNoticeList(AccNo:number) {
    return this.httpClient.get<any>(
      this.apiAction + `NoticeList?AccNo=${AccNo}`
    );
  }
  public AddUpdateNotice(data:any) {
    return this.httpClient.post<any>(
      this.apiAction + `AddEditNotice`,data
    );
  }


}
