import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/interfaces/api-response';
import { IdDescription } from 'src/app/interfaces/id-description';
import { environment } from 'src/environments/environment';
import {
  IHolidayType,
  INationalHolidayCreate,
  INationalHolidayViewModel,
  IWeekDay,
} from '../models/holiday-setup-model';

@Injectable({
  providedIn: 'root',
})
export class HolidaySetupService {
  readonly apiAction = environment.baseUrl + 'HouseKeeping/HolidaySetup/';

  constructor(private httpClient: HttpClient) {}

  public GetHolidayTypes(): Observable<IdDescription[]> {
    return this.httpClient
      .get<IdDescription[]>(this.apiAction + `HolidayTypeSetup/GetHolidayTypes`)
      .pipe(catchError(this.handleError));
  }

  public Submit(data: IHolidayType[]): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(
      this.apiAction + 'HolidayTypeSetup/Insert',
      data
    );
  }

  public GetWeekDays(): Observable<IdDescription[]> {
    return this.httpClient
      .get<IdDescription[]>(this.apiAction + `WeeklyHolidaySetup/GetWeekDays`)
      .pipe(catchError(this.handleError));
  }

  public GetAssignedWeekDays(): Observable<IWeekDay> {
    return this.httpClient
      .get<IWeekDay>(this.apiAction + `WeeklyHolidaySetup/GetAssignedWeekDays`)
      .pipe(catchError(this.handleError));
  }

  public UpdateWeekHoliday(
    day1: number,
    day2: number
  ): Observable<ApiResponse> {
    return this.httpClient
      .get<ApiResponse>(
        this.apiAction +
          `WeeklyHolidaySetup/Insert?day1=` +
          day1 +
          '&day2=' +
          day2
      )
      .pipe(catchError(this.handleError));
  }

  public GetNationalHolidayTypes(): Observable<IdDescription[]> {
    return this.httpClient
      .get<IdDescription[]>(
        this.apiAction + `NationalHolidaySetup/GetNationalHolidayTypes`
      )
      .pipe(catchError(this.handleError));
  }

  public SubmitNationalHoliday(
    data: INationalHolidayCreate
  ): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(
      this.apiAction + 'NationalHolidaySetup/Insert',
      data
    );
  }

  public GetNationalHolidayList(): Observable<INationalHolidayViewModel[]> {
    return this.httpClient
      .get<INationalHolidayViewModel[]>(
        this.apiAction + `NationalHolidaySetup/GetNationalHolidayList`
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
