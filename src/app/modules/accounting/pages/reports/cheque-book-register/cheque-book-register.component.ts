import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { IdDescription } from 'src/app/interfaces/id-description';
import {
  ChequeBookReportAccNoDetails,
  ChequeBookReportAccTypeDetails,
  ChequeBookReportInputHelp,
} from 'src/app/Models/chequebook-report.model';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { ChequeBookReportService } from 'src/app/services/chequebook-report.service';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cheque-book-register',
  templateUrl: './cheque-book-register.component.html',
  styleUrls: ['./cheque-book-register.component.css'],
})
export class ChequeBookRegisterComponent implements OnInit, OnDestroy {
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  chbIsAllMemberStatus: any;
  chbIsAllDateStatus: any;
  IsAccNoCodeDisabled: any;
  IsAccNoDisabled: any;
  MemberName: any;
  AccNoShow: boolean;
  AccountNum: any;
  storefDate: any;
  storetDate: any;
  AccDDLName: any;
  ChequeBookReportByGroupForm: FormGroup;
  public inputHelpData: ChequeBookReportInputHelp = new ChequeBookReportInputHelp();
  public inputHelpDetails: ChequeBookReportAccTypeDetails = new ChequeBookReportAccTypeDetails();
  public inputHelpAccNoDetails: ChequeBookReportAccNoDetails = new ChequeBookReportAccNoDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private chequeBookReportService: ChequeBookReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe
  ) {
    this.reportModel.ReportName = 'ChequeBookReportByGroup';
    //this.reportModel.ReportName = 'ChequeBookReportList';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
  }

  private setDefaultOptions(): void {
    this.spinner.show();
    this.chequeBookReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log(this.inputHelpData);
        this.ChequeBookReportByGroupForm.controls['IssueFromDate'].setValue(
          data.ApplicationDate
        );

        this.ChequeBookReportByGroupForm.controls['IssueToDate'].setValue(
          data.ApplicationDate
        );
        this.storefDate = data.ApplicationDate;
        this.storetDate = data.ApplicationDate;
        this.spinner.hide();
      });
  }

  private initializeForm() {
    this.chbIsAllMemberStatus = true;
    this.chbIsAllDateStatus = true;
    // this.IsAccNoCodeDisabled = true;
    this.IsAccNoDisabled = true;
    this.AccNoShow = false;

    this.ChequeBookReportByGroupForm = new FormGroup({
      IsAllMember: new FormControl('true'),
      MemNo: new FormControl(''),
      AccTypeCode: new FormControl(''),
      AccType: new FormControl('0'),
      IsAllDate: new FormControl('true'),
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
      AccNumber: new FormControl(''),
      AccDDL: new FormControl('0'),
    });
  }

  checkIsAllMemberValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllMemberStatus = true;
      this.AccNoShow = false;
      this.ChequeBookReportByGroupForm.get('MemNo').disable();
      this.IsAccNoDisabled = true;
      this.chbIsAllMemberStatus = true;
      this.chbIsAllDateStatus = true;
      this.ChequeBookReportByGroupForm.controls['MemNo'].setValue('');
      this.ChequeBookReportByGroupForm.controls['AccNo'].setValue('0');
    } else {
      this.chbIsAllMemberStatus = false;
      this.AccNoShow = true;

      this.ChequeBookReportByGroupForm.get('MemNo').enable();
      this.ChequeBookReportByGroupForm.get('AccNo').enable();
      this.IsAccNoDisabled = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
  }

  onChangeAccType(event: any) {
    let AccTypeId = this.ChequeBookReportByGroupForm.controls['AccType'].value;
    let selectedCode = this.inputHelpData.AccountTypeList.find(
      (x) => x.Id == this.ChequeBookReportByGroupForm.value.AccType
    );
    this.AccDDLName = selectedCode.Description;
    console.log(AccTypeId);
    if (AccTypeId) {
      this.ChequeBookReportByGroupForm.patchValue({
        AccTypeCode: AccTypeId,
      });
    }
    let AccType = this.ChequeBookReportByGroupForm.value.AccTypeCode;
    let memNo = this.ChequeBookReportByGroupForm.value.MemNo;
    console.log('AccType:', AccType);
    console.log('MemNo:', memNo);
    this.chequeBookReportService
      .getAccountInfo(AccType, memNo)
      .pipe(first())
      .subscribe((data: any) => {
        console.log('len', data, data.length);
        this.ChequeBookReportByGroupForm.controls['AccNumber'].setValue(
          data[0].Description
        );
      });
  }

  onChangeMemNo() {
    let MemNo = this.ChequeBookReportByGroupForm.value.MemNo;
    this.chequeBookReportService
      .GetMemName(MemNo)
      .pipe(first())
      .subscribe((data: any) => {
        this.MemberName = data.MemberName;
        console.log('MemName:', this.MemberName);
      });
  }

  onChangeAccTypeCode(event: any) {
    let AccTypeCodeId = this.ChequeBookReportByGroupForm.controls['AccTypeCode']
      .value;
    let selectedCode = this.inputHelpData.AccountTypeList.find(
      (x) => x.Id == this.ChequeBookReportByGroupForm.value.AccType
    );
    this.AccDDLName = selectedCode.Description;
    console.log(AccTypeCodeId);
    if (AccTypeCodeId) {
      this.spinner.show();
      this.chequeBookReportService
        .getAccountTypeDetails(AccTypeCodeId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          if (data.AccountTypeDetails.length == 0) {
            this.spinner.hide();
            alert('Invalid Account Type!');
            this.ChequeBookReportByGroupForm.patchValue({
              AccType: 0,
              AccTypeCode: '',
            });
          } else {
            this.inputHelpDetails = data;
            console.log(this.inputHelpDetails);
            if (
              AccTypeCodeId == this.inputHelpDetails.AccountTypeDetails[0].Id
            ) {
              this.ChequeBookReportByGroupForm.patchValue({
                AccType: this.inputHelpDetails.AccountTypeDetails[0].Id,
              });
            } else {
              alert('Invalid Account Type!');
              this.ChequeBookReportByGroupForm.patchValue({
                AccType: 0,
                AccTypeCode: '',
              });
            }
            this.spinner.hide();
          }

          (err) => {
            this.spinner.hide();
          };
        });
    }

    let AccType = this.ChequeBookReportByGroupForm.value.AccTypeCode;
    let memNo = this.ChequeBookReportByGroupForm.value.MemNo;
    console.log('AccType:', AccType);
    console.log('MemNo:', memNo);
    this.chequeBookReportService
      .getAccountInfo(AccType, memNo)
      .pipe(first())
      .subscribe((data: any) => {
        console.log('len', data, data.length);
        this.ChequeBookReportByGroupForm.controls['AccNumber'].setValue(
          data[0].Description
        );
      });
  }

  // Date change event
  applicationDateChange() {
    var fv = this.ChequeBookReportByGroupForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.ChequeBookReportByGroupForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.ChequeBookReportByGroupForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.ChequeBookReportByGroupForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.ChequeBookReportByGroupForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.ChequeBookReportByGroupForm.value);
    console.log(this.storetDate);
  }

  public getReportToken = (type: any) => {
    if (this.ChequeBookReportByGroupForm.value.AccTypeCode === '') {
      this.toastr.warning('Please Insert AccType!!!');
      return;
    }
    this.spinner.show();
    this.setParameter();
    this.displayIFrame = true;
    console.log(this.reportModel);
    this.aService
      .getReportToken(this.reportModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (x) => {
          if (type === 'CRV') {
            await this.setIframeCRV(x);
          } else {
            await this.setIframe(x);
          }
          this.spinner.hide();
          setTimeout(() => {
            location.reload();
          }, 1000);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  private setParameter(): void {
    var fValue = this.ChequeBookReportByGroupForm.value;
    this.reportModel.Values = [];
    console.log('chbIsAllMemberStatus', this.chbIsAllMemberStatus);
    if (this.chbIsAllMemberStatus) {
      this.reportModel.ReportName = 'CCULB_rptChequeBookReportByGroup';
    } else {
      this.reportModel.ReportName = 'CCULB_rptChequeBookReportList';
    }

    this.reportModel.Values.push(new ReportKeyValue('fDate', this.storefDate));
    this.reportModel.Values.push(new ReportKeyValue('tDate', this.storetDate));
    if (this.chbIsAllDateStatus) {
      this.reportModel.Values.push(new ReportKeyValue('nFlag', '0'));
    } else {
      this.reportModel.Values.push(new ReportKeyValue('nFlag', '1'));
    }

    this.reportModel.Values.push(
      new ReportKeyValue('AccType', fValue.AccTypeCode)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('AccDDLName', this.AccDDLName)
    );

    if (this.chbIsAllMemberStatus) {
      this.reportModel.Values.push(new ReportKeyValue('memNo', '0'));
      this.reportModel.Values.push(
        new ReportKeyValue('memName', 'All Member ')
      );
    } else {
      this.reportModel.Values.push(new ReportKeyValue('memNo', fValue.MemNo));
      this.reportModel.Values.push(
        new ReportKeyValue('memName', this.MemberName)
      );
    }

    this.reportModel.Values.push(new ReportKeyValue('AccNo', fValue.AccNumber));
  }

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;
    window.open(iFramePath, '_blank');
  };
  private setIframeCRV = (x: any) => {
    var iFramePath =
      environment.reportUrl +
      'id=' +
      x.id +
      '&token=' +
      x.token +
      '&type=crViewer';

    window.open(iFramePath, '_blank');
  };
}
