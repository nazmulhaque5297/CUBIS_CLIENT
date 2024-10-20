import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  ExcelCollectionSheetModel,
  ExcelSheetCollectionDataModel,
  ExcelSheetCollectionDataViewModel,
  ExcelSheetCollectionVerifyParam,
} from '../Models/excel-collection-sheet.model';

@Injectable({
  providedIn: 'root',
})
export class ExcelCollectionSheetService {
  readonly apiAction = environment.baseUrl + 'Accounting/ExcelCollectionSheet/';

  constructor(private httpClient: HttpClient) {}

  public GetDefaultData(): Observable<ExcelCollectionSheetModel> {
    return this.httpClient.get<ExcelCollectionSheetModel>(
      this.apiAction + 'GetDefaultData'
    );
  }

  public GetGlList(
    optionId: number
  ): Observable<ExcelSheetCollectionDataModel[]> {
    return this.httpClient.get<ExcelSheetCollectionDataModel[]>(
      this.apiAction + 'GetGlList?optionId=' + optionId
    );
  }

  public SaveSerial(data: ExcelSheetCollectionVerifyParam): Observable<any> {
    return this.httpClient.post<any>(this.apiAction + 'SaveSerial', data);
  }

  public Verify(
    data: ExcelSheetCollectionVerifyParam
  ): Observable<ExcelSheetCollectionDataViewModel> {
    return this.httpClient.post<ExcelSheetCollectionDataViewModel>(
      this.apiAction + 'Verify',
      data
    );
  }

  public ExportToExcel(
    isCheckOldMemNo: boolean,
    optionId: number
  ): Observable<any> {
    return this.httpClient.get(
      this.apiAction +
        'ExportToExcel?isCheckOldMemNo=' +
        isCheckOldMemNo +
        '&optionId=' +
        optionId,
      {
        responseType: 'blob',
      }
    );
  }
}
