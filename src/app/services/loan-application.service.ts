import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { MemberCreateResponse } from '../interfaces/api-response';
import { environment } from 'src/environments/environment';
import {
  ReturnScheduleHelpDataModel,
  ShareGuarantorDetailsModel,
  LoanAccountTypeViewModel,
  LoanAmountViewModel,
  LoanApplicationCreateModel,
  LoanApplicationInputHelp,
  LoanMemberViewModel,
  MemberNameModel,
} from '../modules/accounting/models/loan-application.model';
import { FormGroupDirective } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class LoanApplicationService {
  HoLoadApplication: string;
  HOLoanABooth: string;
  memNo: number;
  memType: number;

  public dataList = new BehaviorSubject<[]>([]);
  currentLoanMemberNo = this.dataList.asObservable();

  public dataListDeposit = new BehaviorSubject<[]>([]);
  currentDeposit = this.dataListDeposit.asObservable();

  public dataListProperty = new BehaviorSubject<[]>([]);
  currentProperty = this.dataListProperty.asObservable();

  public totalShare = new BehaviorSubject<number>(0);
  currentTotalShare = this.totalShare.asObservable();

  public totalDeposit = new BehaviorSubject<number>(0);
  currentTotalDeposit = this.totalDeposit.asObservable();

  public totalProperty = new BehaviorSubject<number>(0);
  currentTotalProperty = this.totalProperty.asObservable();

  shareData: any;
  depositData: any;
  propertyData: any;

  readonly apiAction = environment.baseUrl + 'Accounting/LoanApplication/';

  constructor(private httpClient: HttpClient) {}

  changeLoanMemberNo(member: any) {
    console.log(member);
    this.dataList.next(member);
  }

  changeDepositData(member: any) {
    console.log(member);
    this.dataListDeposit.next(member);
  }

  changePropertyData(member: any) {
    console.log(member);
    this.dataListProperty.next(member);
  }

  changeTotalShare(data: number) {
    this.totalShare.next(data);
  }

  public setShareData(data) {
    this.shareData = data;
  }
  public getShareData() {
    return this.shareData;
  }

  changeTotalDeposit(data: number) {
    this.totalDeposit.next(data);
  }

  public setDepositData(data) {
    this.depositData = data;
  }
  public getDepositData() {
    return this.depositData;
  }

  changeTotalProperty(data: number) {
    this.totalProperty.next(data);
  }

  public setPropertyData(data) {
    this.propertyData = data;
  }
  public getPropertyData() {
    return this.propertyData;
  }

  public GetInputHelp() {
    return this.httpClient.get<LoanApplicationInputHelp>(
      this.apiAction + 'GetInputHelpData'
    );
  }

  Insert(data: LoanApplicationCreateModel): Observable<MemberCreateResponse> {
    return this.httpClient.post<MemberCreateResponse>(
      this.apiAction + 'Insert',
      data
    );
  }

  InsertHO(data: LoanApplicationCreateModel): Observable<MemberCreateResponse> {
    return this.httpClient.post<MemberCreateResponse>(
      this.apiAction + 'InsertHO',
      data
    );
  }

  Update(data: LoanApplicationCreateModel): Observable<MemberCreateResponse> {
    return this.httpClient.post<MemberCreateResponse>(
      this.apiAction + 'Update',
      data
    );
  }

  public GetLoanMemberDetails(
    memNo: number,
    accTypeId: number,
    shareGuaranteeNo: number,
    shareGuaranteeMonth: number
  ) {
    return this.httpClient.get<LoanMemberViewModel>(
      this.apiAction +
        'GetLoanMemberDetails?memNo=' +
        memNo +
        '&accTypeId=' +
        accTypeId +
        '&shareGuranteeNo=' +
        shareGuaranteeNo +
        '&shareGuranteeMonth=' +
        shareGuaranteeMonth
    );
  }

  public GetLoanAccountTypeDetails(accTypeId: number) {
    return this.httpClient.get<LoanAccountTypeViewModel>(
      this.apiAction + 'GetLoanAccountTypeDetails?accTypeId=' + accTypeId
    );
  }

  public CalculateInstallmentDetails(
    data: LoanApplicationCreateModel
  ): Observable<LoanAmountViewModel> {
    console.log('service data', data);
    return this.httpClient.post<LoanAmountViewModel>(
      this.apiAction + 'CalculateInstallmentDetails',
      data
    );
  }

  public CalculateByNoOfLoan(
    data: LoanApplicationCreateModel
  ): Observable<LoanAmountViewModel> {
    return this.httpClient.post<LoanAmountViewModel>(
      this.apiAction + 'CalculateByNoOfLoan',
      data
    );
  }

  public GetMemberByMemNo(memNo: number) {
    return this.httpClient.get<MemberNameModel>(
      this.apiAction + 'GetMemberByMemNo?memNo=' + memNo
    );
  }

  public GetDepositAccountList() {
    return this.httpClient.get<any>(this.apiAction + 'GetDepositAccountList');
  }

  public GetShareGuarantorDetails(
    data: LoanAccountTypeViewModel,
    memNo: number
  ): Observable<ShareGuarantorDetailsModel> {
    console.log(data, ' hudai ', memNo);
    return this.httpClient.post<ShareGuarantorDetailsModel>(
      this.apiAction + 'GetShareGuarantorDetails?memNo=' + memNo,
      data
    );
  }

  public GetDepositGuarantorDetails(memNo: number) {
    return this.httpClient.get<any>(
      this.apiAction + 'GetDepositGuarantorDetails?memNo=' + memNo
    );
  }

  public GetDepositAccountAll(
    BranchNo: number,
    MemNo: number,
    MemType: number,
    AccType: number
  ) {
    return this.httpClient.get<any>(
      this.apiAction +
        'GetDepositAccountAll?BranchNo=' +
        BranchNo +
        '&MemNo=' +
        MemNo +
        '&MemType=' +
        MemType +
        '&AccType=' +
        AccType
    );
  }

  public ReturnScheduleData(model: ReturnScheduleHelpDataModel) {
    console.log(model);
    return this.httpClient.post<any>(
      this.apiAction + 'ReturnScheduleData',
      model
    );
  }
}
