import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { IDayEndProcessInputHelp } from '../modules/accounting/models/day-end-process.model';

@Injectable({
  providedIn: 'root',
})
export class DayEndProcessService {
  readonly apiAction = environment.baseUrl + 'Accounting/DayEndProcess/';

  constructor(private httpClient: HttpClient) {}

  public GetInputHelp() {
    return this.httpClient.get<IDayEndProcessInputHelp>(
      this.apiAction + 'GetInputHelp'
    );
  }

  public Submit(data: IDayEndProcessInputHelp): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(
      this.apiAction + 'ProcessUpdate',
      data
    );
  }

  public YearEnd(year: any) {
    return this.httpClient.get<any>(this.apiAction + 'YearEnd?year=' + year);
  }
}
