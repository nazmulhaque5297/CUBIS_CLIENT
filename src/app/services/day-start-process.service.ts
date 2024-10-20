import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { IdDescription } from '../interfaces/id-description';
import { IProcessStartDateModel } from '../Models/Common.model';

@Injectable({
  providedIn: 'root',
})
export class DayStartProcessService {
  readonly apiAction = environment.baseUrl + 'SystemControl/DayStartProcess/';

  constructor(private httpClient: HttpClient) {}

  public GetHolidayList() {
    return this.httpClient.get<IdDescription[]>(
      this.apiAction + 'GetHolidayList'
    );
  }

  public CheckProcessStartDate(moduleId: number) {
    return this.httpClient.get<IProcessStartDateModel>(
      this.apiAction + 'CheckDayStartProcess?moduleId=' + moduleId
    );
  }

  public SubmitStartOfDay(
    data: IProcessStartDateModel
  ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(
      this.apiAction + 'ProcessUpdate',
      data
    );
  }
}
