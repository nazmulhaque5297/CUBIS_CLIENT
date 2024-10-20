import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { IdDescription } from 'src/app/interfaces/id-description';
import { EditLoanAccountService } from 'src/app/services/edit-loan-account.service';
import { LoanApplicationService } from 'src/app/services/loan-application.service';
import {
  EditLoanAccLoadModel,
  AccTypeDataDropDown,
  MemberNoDataModel,
  AccNoDataModel,
  AccTypeDataModel,
} from '../../../models/edit-loan-account.model';
import {
  LoanApplicationInputHelp,
  LoanAccountTypeViewModel,
  LoanMemberViewModel,
  ShareGuarantorDetailsModel,
  DepositGuarantorDetailsModel,
  PropertyGuarantorDetailsModel,
} from '../../../models/loan-application.model';
import { EditLoanApplicationService } from '../../../services/edit-loan-application.service';
import { LoanApplicationEventService } from '../../../services/loan-application-event-service';

@Component({
  selector: 'app-edit-loan-application-info',
  templateUrl: './edit-loan-application-info.component.html',
  styleUrls: ['./edit-loan-application-info.component.css'],
})
export class EditLoanApplicationInfoComponent implements OnInit {
  @Output() callParentFunction: EventEmitter<any> = new EventEmitter<any>();
  @Output() parentFunctionShare: EventEmitter<any> = new EventEmitter<any>();
  @Input() formGroupName: string;
  public inputHelpData: LoanApplicationInputHelp = new LoanApplicationInputHelp();
  loanInfoForm: FormGroup;
  private loanAppEventService: LoanApplicationEventService;
  private destroy$: Subject<void> = new Subject<void>();
  public hideShowModel = {
    ShowCorrAccNo: false,
    ShowInstallment: false,
    ShowLoanGraceMonth: false,
    ShowPeriod: true,
  };
  public accountTypeDetails: LoanAccountTypeViewModel = new LoanAccountTypeViewModel();
  public memberDetails: LoanMemberViewModel = new LoanMemberViewModel();
  public shareGuaranteeMonth: number;
  public shareGuranteeNo: number;
  public shareAmountNow: number = 0;
  public depositAmountNow: number = 0;
  public propertyAmountNow: number = 0;
  public shareDataList: ShareGuarantorDetailsModel[] = [];
  public depositDataList: DepositGuarantorDetailsModel[] = [];
  public propertyDataList: PropertyGuarantorDetailsModel[] = [];
  constructor(
    private rootFormGroup: FormGroupDirective,
    private applicationService: LoanApplicationService,
    private editLoanApplication: EditLoanApplicationService,
    private editAccountService: EditLoanAccountService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    public datepipe: DatePipe,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.loanInfoForm = this.rootFormGroup.control.get(
      this.formGroupName
    ) as FormGroup;
    this.setDefaultOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setDefaultOptions(): void {
    this.spinner.show();
    this.applicationService
      .GetInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log('input help', data);
        this.loanInfoForm.controls['ApplicationDate'].setValue(
          data.ApplicationDate
        );
        this.loanAppEventService = new LoanApplicationEventService(
          this.loanInfoForm,
          this.inputHelpData
        );
        this.spinner.hide();
      });
  }

  public onAccountTypeChange(value: number): void {
    this.spinner.show();
    this.loanAppEventService.setAccountType(value);
    this.applicationService
      .GetLoanAccountTypeDetails(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        this.accountTypeDetails = data;
        console.log('loan acc type details', data);
        var accountTypeTitle = this.inputHelpData.AccountTypeList.filter(
          (item) => item.Id == value
        );
        localStorage.setItem(
          'accountTypeTitle',
          JSON.stringify(accountTypeTitle[0].Description)
        );
        this.applicationService.setShareData(data);
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        this.hideShowModel.ShowCorrAccNo = data.ShowCorrAccNo;
        this.hideShowModel.ShowInstallment = data.ShowInstallment;
        this.hideShowModel.ShowLoanGraceMonth = data.ShowLoanGraceMonth;
        this.hideShowModel.ShowPeriod = data.ShowPeriod;
        this.shareGuaranteeMonth = data.ShareGuaranteeMonth;
        this.shareGuranteeNo = data.ShareGuaranteeNo;
        this.loanAppEventService.setAccountTypeDetails(data);
        this.memberDetails = new LoanMemberViewModel();
      });
  }

  public onLoanPurposeChange(value: number): void {
    this.loanAppEventService.setLoanPurpose(value);
    document.getElementById(`LoanInterestCalMethodCode`).focus();
  }
  public onLoanPurposeChangekeydown(e: KeyboardEvent): void {
    if (e.keyCode != 13) return;
    document.getElementById(`LoanInterestCalMethodCode`).focus();
  }

  public onLoanCalMethodChange(value: number): void {
    this.loanAppEventService.setLoanCalMethod(value);
    document.getElementById(`LoanSuretyMemNo`).focus();
  }
  public onLoanCalMethodChangekeydown(e: KeyboardEvent): void {
    if (e.keyCode != 13) return;
    document.getElementById(`LoanSuretyMemNo`).focus();
  }

  loanCatagoryChange() {
    this.loanInfoForm.controls['LoanCategoryCode'].setValue(
      this.loanInfoForm.value.LoanCategory
    );
  }

  loanCatagoryCodeChange() {
    this.loanInfoForm.controls['LoanCategory'].setValue(
      this.loanInfoForm.value.LoanCategoryCode
    );
    document.getElementById(`LoanPurposeCode`).focus();
  }
  loanCatagoryCodeChangekeydown(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    this.loanInfoForm.controls['LoanCategory'].setValue(
      this.loanInfoForm.value.LoanCategoryCode
    );
    document.getElementById(`LoanPurposeCode`).focus();
  }

  public onMemberNoChange(): void {
    var fValue = this.loanInfoForm.value;
    if (fValue.LoanAccountTypeCode.length <= 0) {
      alert('Please Select Loan A/C Type!');
      this.loanInfoForm.controls['LoanMemberNo'].setValue('');
      return;
    }

    this.spinner.show();
    this.applicationService
      .GetLoanMemberDetails(
        fValue.LoanMemberNo,
        fValue.LoanAccountTypeCode,
        this.shareGuranteeNo,
        this.shareGuaranteeMonth
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.loanInfoForm.controls['MemType'].setValue(data.MemType);
        if (!data.Success) {
          alert(data.Message);
        } else {
          let shareData = data.ShareGuarantorData.Length;
          if (shareData != 0 && shareData != null && shareData != undefined) {
            console.log(data.ShareGuarantorData.Length);
            this.applicationService.changeLoanMemberNo(data.ShareGuarantorData);
            this.applicationService.changeTotalShare(
              Number(data.ShareGuarantorData[0].ShareAmount)
            );
            this.shareDataList.push(data.ShareGuarantorData);
            if (this.shareAmountNow != 0) {
              let sendData = {
                singleValue: 1,
                Data: this.shareAmountNow * -1,
              };
              this.callParentFunction.emit(sendData);
            }
            this.shareAmountNow = Number(
              data.ShareGuarantorData[0].ShareAmount
            );
            let sendData = {
              singleValue: 0,
              Data: data.ShareGuarantorData,
            };
            this.callParentFunction.emit(sendData);
          }
          this.loanAppEventService.setLoanMemberDetails(data);
          this.memberDetails = data;
          this.hideShowModel.ShowCorrAccNo = data.ShowCorrAccNo;
        }
        this.spinner.hide();
      });
  }

  private getCreateModel(): any {
    var fValue = this.loanInfoForm.value;
    fValue.AccountClassId = this.accountTypeDetails.AccTypeClass;
    fValue.MemType = this.memberDetails.MemType;
    fValue.DepositMode = this.accountTypeDetails.AccDepositMode;
    fValue.GraceFlag = this.accountTypeDetails.GraceFlag;
    return fValue;
  }

  public onLoanAmountEvent(): void {
    this.spinner.show();
    this.applicationService
      .CalculateInstallmentDetails(this.getCreateModel())
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.loanAppEventService.setLoanDetails(data);
        console.log('calculate installment details', data);
        if (!data.Success) {
          alert(data.Message);
        }
        this.spinner.hide();
      });
    document.getElementById(`LoanInterestRate`).focus();
  }

  public onLoanAmountEventkeydown(e: KeyboardEvent): void {
    if (e.keyCode != 13) return;

    document.getElementById(`LoanInterestRate`).focus();
  }
  public onLoanAmountEventInstkeydown(e: KeyboardEvent): void {
    if (e.keyCode != 13) return;

    document.getElementById(`LoanLastInstallmentAmount`).focus();
  }

  public onLoanInterestRateEvent(): void {
    document.getElementById(`LoanCategoryCode`).focus();
  }
  public onLoanInterestRateEventkeydown(e: KeyboardEvent): void {
    if (e.keyCode != 13) return;
    document.getElementById(`LoanCategoryCode`).focus();
  }

  public onLoanNoEvent(): void {
    this.spinner.show();
    this.applicationService
      .CalculateByNoOfLoan(this.getCreateModel())
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.loanAppEventService.setDetailsByInstallmentNo(data);
        console.log('calculate by no of loan', data);
        if (!data.Success) {
          alert(data.Message);
        }
        this.spinner.hide();
      });
    document.getElementById(`LoanInstallmentAmount`).focus();
  }
  public onLoanNoEventkeydown(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`LoanInstallmentAmount`).focus();
  }

  public onSuretyMemberNo(): void {
    this.applicationService
      .GetMemberByMemNo(this.loanInfoForm.value.LoanSuretyMemNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.loanAppEventService.setSuretyMemberName(data);
        console.log('get member by mem no', data);
      });
    document.getElementById(`LoanNoInstallment`).focus();
  }
  public onSuretyMemberNokeydown(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`LoanNoInstallment`).focus();
  }

  onApplicationNoChange() {
    if (
      this.loanInfoForm.value.ApplicationNo != '' &&
      this.loanInfoForm.value.ApplicationNo != '0'
    ) {
      this.editLoanApplication
        .applicationNoChange(this.loanInfoForm.value.ApplicationNo)
        .pipe(first())
        .subscribe((x: any) => {
          if (x.Success) {
            console.log(x);
            this.editAccountService.setLoanApplicationNo(
              this.loanInfoForm.value.ApplicationNo
            );
            this.editAccountService.setAccountType(x.AccType);
            this.loanInfoForm.controls['LoanAccountTypeCode'].setValue(
              x.AccType
            );
            // have to do work here
            console.log('coming here');
            this.setFormData(x);

            if (
              x.ShareGuarantorList != null &&
              x.ShareGuarantorList != undefined
            ) {
              this.applicationService.changeLoanMemberNo(x.ShareGuarantorList);
              var tot = 0;
              for (var i = 0; i < x.ShareGuarantorList.length; i++) {
                tot += Number(x.ShareGuarantorList[i].AccAmount);
              }
              this.applicationService.changeTotalShare(tot);
              this.shareDataList.push(x.ShareGuarantorList);
              if (this.shareAmountNow != 0) {
                let sendData = {
                  singleValue: 1,
                  Data: this.shareAmountNow * -1,
                };
                this.callParentFunction.emit(sendData);
              }
              this.shareAmountNow = Number(tot);
              let sendData = {
                singleValue: 0,
                Data: this.shareAmountNow,
              };
              this.callParentFunction.emit(sendData);
            }

            if (
              x.DepositGuarantorList != null &&
              x.DepositGuarantorList != undefined
            ) {
              this.applicationService.changeDepositData(x.DepositGuarantorList);
              var tot = 0;
              for (var i = 0; i < x.DepositGuarantorList.length; i++) {
                tot += Number(x.DepositGuarantorList[i].AccAmount);
              }
              this.applicationService.changeTotalDeposit(tot);
              this.depositDataList.push(x.DepositGuarantorList);
              this.depositAmountNow = Number(tot);
              let sendData = {
                singleValue: 0,
                Data: this.depositAmountNow,
              };
              this.callParentFunction.emit(sendData);
            }

            if (
              x.PropertyGuarantorList != null &&
              x.PropertyGuarantorList != undefined
            ) {
              this.applicationService.changePropertyData(
                x.PropertyGuarantorList
              );
              var tot = 0;
              for (var i = 0; i < x.PropertyGuarantorList.length; i++) {
                tot += Number(x.PropertyGuarantorList[i].PrAmount);
              }
              this.applicationService.changeTotalProperty(tot);
              this.propertyDataList.push(x.PropertyGuarantorList);
              this.propertyAmountNow = Number(tot);
              let sendData = {
                singleValue: 0,
                Data: this.propertyAmountNow,
              };
              this.callParentFunction.emit(sendData);
            }
          } else {
            alert(x.Message);
            this.loanInfoForm.controls['ApplicationNo'].setValue('');
          }
        });
    } else {
      alert('Please input a valid Application No.');
    }
    document.getElementById(`LoanApplicationAmount`).focus();
  }

  setFormData(x: any) {
    this.loanInfoForm.controls['ApplicationID'].setValue(x.ID);
    this.loanInfoForm.controls['ApplicationDate'].setValue(
      x.LoanApplicationDate
    );
    this.loanInfoForm.controls['MemType'].setValue(x.MemType);
    this.loanInfoForm.controls['LoanAccountType'].setValue(x.AccType);
    this.loanInfoForm.controls['LoanAccCorrType'].setValue(x.AccCorrType);
    this.loanInfoForm.controls['CorrAccountNo'].setValue(x.AccCorrNo);
    this.loanInfoForm.controls['CorrAccountTitle'].setValue(x.AccCorrTitle);
    this.loanInfoForm.controls['IsAutoTrfCorrAccount'].setValue(x.AutoTrf);
    this.loanInfoForm.controls['LoanMemberNo'].setValue(x.MemNumber);
    this.loanInfoForm.controls['LoanMemberName'].setValue(x.MemName);
    this.loanInfoForm.controls['LoanApplicationAmount'].setValue(
      x.LoanAppAmount
    );
    this.loanInfoForm.controls['LoanInterestRate'].setValue(x.LoanInterestRate);
    this.loanInfoForm.controls['LoanCategoryCode'].setValue(x.LoanCategory);
    this.loanInfoForm.controls['LoanCategory'].setValue(x.LoanCategory);
    this.loanInfoForm.controls['LoanExpDate'].setValue(x.LoanExpDate);
    this.loanInfoForm.controls['LoanPurposeCode'].setValue(x.LoanPurpose);
    this.loanInfoForm.controls['LoanPurpose'].setValue(x.LoanPurpose);
    this.loanInfoForm.controls['LoanSuretyMemNo'].setValue(x.SuretyMemNo);
    if (x.SuretyMemNo > 0)
      this.loanInfoForm.controls['LoanSuretyMemName'].setValue(x.SuretyMemName);
    this.loanInfoForm.controls['AccPeriod'].setValue(x.Period);
    this.loanInfoForm.controls['LoanNoInstallment'].setValue(x.NoInstallment);
    this.loanInfoForm.controls['LoanInstallmentAmount'].setValue(
      x.LoanInstallmentAmount
    );
    this.loanInfoForm.controls['LoanLastInstallmentAmount'].setValue(
      x.LoanLastInstlAmount
    );
    this.loanInfoForm.controls['LoanFirstInstallmentdate'].setValue(
      x.FirstInstlDt
    );
    this.loanInfoForm.controls['LoanGracePeriod'].setValue(x.LoanGrace);
    this.loanInfoForm.controls['LoanSecondInstallmentdate'].setValue(
      x.SecondInstlDt
    );
    this.loanInfoForm.controls['LoanSuretyMemType'].setValue(x.SuretyMemType);
    this.loanInfoForm.controls['DepositMode'].setValue(x.DepositMode);
    this.loanInfoForm.controls['LoanCalculationMethod'].setValue(
      x.LoanCalMethod
    );
    this.loanInfoForm.controls['InputBy'].setValue(x.Input);
    this.loanInfoForm.controls['InputByDate'].setValue(x.InputDate);
    this.loanInfoForm.controls['ApproveBy'].setValue(x.Approve);
    this.loanInfoForm.controls['ApproveByDate'].setValue(x.ApproveDate);
    this.loanInfoForm.controls['WeeklyDay'].setValue(x.WeeklyDay);
    this.hideShowModel.ShowCorrAccNo = x.CorrAccNoVisible;
    this.hideShowModel.ShowInstallment = x.FirstInstlDtVisible;
    this.hideShowModel.ShowLoanGraceMonth = x.LoanInstallmentAmountVisible;
    this.hideShowModel.ShowPeriod = x.PeriodVisible;
    let selectedCode = this.inputHelpData.AccountTypeList.find(
      (p) => p.Id == x.AccType
    );
    localStorage.setItem(
      'accountTypeTitle',
      JSON.stringify(selectedCode.Description)
    );
  }

  applicationDateChange() {
    var fv = this.loanInfoForm.value;
    var value = this.datepipe.transform(fv.ApplicationDate, 'dd-MM-yyyy');
    this.loanInfoForm.value.ApplicationDate = this.editAccountService.convertDateToString(
      value
    );
    console.log(this.loanInfoForm.value);
  }
  loanExpDateChange() {
    var fv = this.loanInfoForm.value;
    var value = this.datepipe.transform(fv.LoanExpDate, 'dd-MM-yyyy');
    this.loanInfoForm.value.LoanExpDate = this.editAccountService.convertDateToString(
      value
    );
    console.log(this.loanInfoForm.value);
  }
  loanFirstInstallmentdate() {
    var fv = this.loanInfoForm.value;
    var value = this.datepipe.transform(
      fv.LoanFirstInstallmentdate,
      'dd-MM-yyyy'
    );
    this.loanInfoForm.value.LoanFirstInstallmentdate = this.editAccountService.convertDateToString(
      value
    );
    console.log(this.loanInfoForm.value);
  }
}
