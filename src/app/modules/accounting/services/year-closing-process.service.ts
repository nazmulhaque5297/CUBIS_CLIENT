import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { IdDescription } from 'src/app/interfaces/id-description';
import { environment } from 'src/environments/environment';
import {
  CalculationStatusModel,
  DebateVerifyAccounts,
  ProcessPostModel,
  ProcessResponse,
  RebateProcessPostModel,
  RebateResponse,
  ServiceChargeResponse,
} from '../models/year-closing-process.model';

@Injectable({
  providedIn: 'root',
})
export class YearClosingProcessService {
  readonly apiAction = environment.baseUrl + 'Accounting/';

  constructor(private httpClient: HttpClient) {}

  public GetBranchList(): Observable<IdDescription[]> {
    return this.httpClient
      .get<IdDescription[]>(environment.baseUrl + `InputHelp/GetBranchList`)
      .pipe(catchError(this.handleError));
  }

  public GetStandardAccountTypes(): Observable<IdDescription[]> {
    return this.httpClient
      .get<IdDescription[]>(
        this.apiAction + `StandardIntProcess/GetAccountTypes`
      )
      .pipe(catchError(this.handleError));
  }

  public GetInterestDetails(accTypeId: number, type: number): Observable<any> {
    return this.httpClient
      .get<any>(
        this.apiAction +
          `StandardIntProcess/GetInterestDetails?accTypeId=` +
          accTypeId +
          `&&type=` +
          type
      )
      .pipe(catchError(this.handleError));
  }

  public UpdateIntPostFlag(accType: number): Observable<any> {
    return this.httpClient
      .get<any>(
        this.apiAction + `StandardIntProcess/UpdatePostFlag?accType=` + accType
      )
      .pipe(catchError(this.handleError));
  }

  public CalculateProcess(
    accTypeId: number,
    IsAllBranch: boolean
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.apiAction +
          `StandardIntProcess/CalculateProcess?accTypeId=${accTypeId}&&IsAllBranch=${IsAllBranch}`
      )
      .pipe(catchError(this.handleError));
  }

  public PostProcess(data: ProcessPostModel): Observable<ProcessResponse> {
    return this.httpClient.post<ProcessResponse>(
      this.apiAction + 'StandardIntProcess/PostProcess',
      data
    );
  }

  public ReverseProcess(data: ProcessPostModel): Observable<ProcessResponse> {
    return this.httpClient.post<ProcessResponse>(
      this.apiAction + 'StandardIntProcess/ReverseProcess',
      data
    );
  }

  //Pension interest calculation
  public GetPensionAccountTypes(): Observable<IdDescription[]> {
    return this.httpClient
      .get<IdDescription[]>(
        this.apiAction + `PensionIntProcess/GetAccountTypes`
      )
      .pipe(catchError(this.handleError));
  }
  public PensionInterestCalculation(accTypeId: number): Observable<any> {
    return this.httpClient
      .get<any>(
        this.apiAction +
          `PensionIntProcess/CalculateProcess?accTypeId=` +
          accTypeId
      )
      .pipe(catchError(this.handleError));
  }
  public PostPensionProcess(
    data: ProcessPostModel
  ): Observable<ProcessResponse> {
    return this.httpClient.post<ProcessResponse>(
      this.apiAction + 'PensionIntProcess/PostProcess',
      data
    );
  }

  //Time deposit interest calculation
  public GetTimeDepositAccountTypes(): Observable<IdDescription[]> {
    return this.httpClient
      .get<IdDescription[]>(
        this.apiAction + `TimeDepositIntProcess/GetAccountTypes`
      )
      .pipe(catchError(this.handleError));
  }
  public TimeDepositInterestCalculation(
    accTypeId: number
  ): Observable<CalculationStatusModel[]> {
    return this.httpClient
      .get<CalculationStatusModel[]>(
        this.apiAction +
          `TimeDepositIntProcess/CalculateProcess?accTypeId=` +
          accTypeId
      )
      .pipe(catchError(this.handleError));
  }
  public PostTimeDepositProcess(
    data: ProcessPostModel
  ): Observable<ProcessResponse> {
    return this.httpClient.post<ProcessResponse>(
      this.apiAction + 'TimeDepositIntProcess/PostProcess',
      data
    );
  }

  //dividend interest calculation
  public GetDividendAccountTypes(): Observable<IdDescription[]> {
    return this.httpClient
      .get<IdDescription[]>(
        this.apiAction + `DividendIntProcess/GetAccountTypes`
      )
      .pipe(catchError(this.handleError));
  }
  public CalculateDividendProcess(data: ProcessPostModel): Observable<any> {
    return this.httpClient.post<any>(
      this.apiAction + 'DividendIntProcess/CalculateProcess',
      data
    );
  }

  public PostDividendProcess(
    data: ProcessPostModel
  ): Observable<ProcessResponse> {
    return this.httpClient.post<ProcessResponse>(
      this.apiAction + 'DividendIntProcess/PostProcess',
      data
    );
  }
  public ReverseDividendPosting(
    data: ProcessPostModel
  ): Observable<ProcessResponse> {
    return this.httpClient.post<ProcessResponse>(
      this.apiAction + 'DividendIntProcess/ReverseProcess',
      data
    );
  }

  //Share Protection interest calculation
  public GetShareProtectionAccountTypes(): Observable<IdDescription[]> {
    return this.httpClient
      .get<IdDescription[]>(
        this.apiAction + `ShareProtectionIntProcess/GetAccountTypes`
      )
      .pipe(catchError(this.handleError));
  }
  public CalculateShareProtectionProcess(
    accType: number
  ): Observable<CalculationStatusModel[]> {
    return this.httpClient
      .get<CalculationStatusModel[]>(
        this.apiAction +
          `ShareProtectionIntProcess/CalculateProcess?accTypeId=` +
          accType
      )
      .pipe(catchError(this.handleError));
  }

  public PostShareProtectionProcess(
    data: ProcessPostModel
  ): Observable<ProcessResponse> {
    return this.httpClient.post<ProcessResponse>(
      this.apiAction + 'ShareProtectionIntProcess/PostProcess',
      data
    );
  }
  public ReverseShareProtectionPosting(
    data: ProcessPostModel
  ): Observable<ProcessResponse> {
    return this.httpClient.post<ProcessResponse>(
      this.apiAction + 'ShareProtectionIntProcess/ReverseProcess',
      data
    );
  }

  //Rebate interest calculation
  public GetRebateAccountTypes(): Observable<IdDescription[]> {
    return this.httpClient
      .get<IdDescription[]>(this.apiAction + `RebateIntProcess/GetAccountTypes`)
      .pipe(catchError(this.handleError));
  }

  public GetRebateParameters(accTypeId: number): Observable<RebateResponse> {
    return this.httpClient
      .get<RebateResponse>(
        this.apiAction +
          `RebateIntProcess/GetRebateParameters?accTypeId=` +
          accTypeId
      )
      .pipe(catchError(this.handleError));
  }
  public CalculateRebateProcess(accTypeId: number): Observable<any> {
    return this.httpClient
      .get<RebateResponse>(
        this.apiAction +
          `RebateIntProcess/CalculateProcess?accTypeId=` +
          accTypeId
      )
      .pipe(catchError(this.handleError));
  }
  public AllCalculation(accTypeId: number): Observable<RebateResponse> {
    return this.httpClient
      .get<RebateResponse>(
        this.apiAction +
          `RebateIntProcess/AllCalculation?accTypeId=` +
          accTypeId
      )
      .pipe(catchError(this.handleError));
  }
  public GetVerifyList(accTypeId: number): Observable<DebateVerifyAccounts[]> {
    return this.httpClient
      .get<DebateVerifyAccounts[]>(
        this.apiAction + `RebateIntProcess/GetVerifyList?accTypeId=` + accTypeId
      )
      .pipe(catchError(this.handleError));
  }
  public PostRebateProcess(
    data: RebateProcessPostModel
  ): Observable<ProcessResponse> {
    return this.httpClient.post<ProcessResponse>(
      this.apiAction + 'RebateIntProcess/PostProcess',
      data
    );
  }
  public ReverseRebatePosting(
    data: RebateProcessPostModel
  ): Observable<ProcessResponse> {
    return this.httpClient.post<ProcessResponse>(
      this.apiAction + 'RebateIntProcess/ReverseProcess',
      data
    );
  }

  public VerifyRebateUpdate(
    data: DebateVerifyAccounts[]
  ): Observable<ProcessResponse> {
    return this.httpClient.post<ProcessResponse>(
      this.apiAction + 'RebateIntProcess/VerifyRebateUpdate',
      data
    );
  }

  public UpdateRebatePostFlag(accType: number): Observable<any> {
    return this.httpClient
      .get<any>(
        this.apiAction + `RebateIntProcess/UpdatePostFlag?accType=` + accType
      )
      .pipe(catchError(this.handleError));
  }

  //Service charge interest calculation
  public GetServiceChargeAccountTypes(): Observable<IdDescription[]> {
    return this.httpClient
      .get<IdDescription[]>(
        this.apiAction + `ServiceChargeIntProcess/GetAccountTypes`
      )
      .pipe(catchError(this.handleError));
  }
  public GetServiceChargeInterestDetails(
    accTypeId: number
  ): Observable<ServiceChargeResponse> {
    return this.httpClient
      .get<ServiceChargeResponse>(
        this.apiAction +
          `ServiceChargeIntProcess/GetInterestDetails?accTypeId=` +
          accTypeId
      )
      .pipe(catchError(this.handleError));
  }
  public CalculateServiceChargeProcess(
    accType: number
  ): Observable<CalculationStatusModel[]> {
    return this.httpClient
      .get<CalculationStatusModel[]>(
        this.apiAction +
          `ServiceChargeIntProcess/CalculateProcess?accTypeId=` +
          accType
      )
      .pipe(catchError(this.handleError));
  }

  public PostServiceChargeProcess(
    data: ProcessPostModel
  ): Observable<ProcessResponse> {
    return this.httpClient.post<ProcessResponse>(
      this.apiAction + 'ServiceChargeIntProcess/PostProcess',
      data
    );
  }
  public ReverseServiceChargePosting(
    data: ProcessPostModel
  ): Observable<ProcessResponse> {
    return this.httpClient.post<ProcessResponse>(
      this.apiAction + 'ServiceChargeIntProcess/ReverseProcess',
      data
    );
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

  public UpdateServicePostFlag(accType: number): Observable<any> {
    return this.httpClient
      .get<any>(
        this.apiAction +
          `ServiceChargeIntProcess/UpdatePostFlag?accType=` +
          accType
      )
      .pipe(catchError(this.handleError));
  }
}
