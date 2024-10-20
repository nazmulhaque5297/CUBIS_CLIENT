import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectListFilter } from 'src/app/filters/select-list-filter';
import { IdDescription } from 'src/app/interfaces/id-description';
import { IApplicationCommonModel } from 'src/app/Models/Common.model';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import {
  CalculationStatusModel,
  InterestParamModel,
  ProcessPostModel,
} from '../../../models/year-closing-process.model';
import { YearClosingProcessService } from '../../../services/year-closing-process.service';

@Component({
  selector: 'app-time-deposit-process',
  templateUrl: './time-deposit-process.component.html',
  styleUrls: ['./time-deposit-process.component.css'],
})
export class TimeDepositProcessComponent implements OnInit, OnDestroy {
  public branchList: IdDescription[] = [];
  public accountTypeList: IdDescription[] = [];
  setupForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  public interestDetailsData: InterestParamModel = new InterestParamModel();
  public calculationStatusList: CalculationStatusModel[] = [];
  commonData: IApplicationCommonModel;
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;

  constructor(
    private pService: YearClosingProcessService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private store: Store,
    private sanitizer: DomSanitizer,
    private aService: ReportCommonService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getInputHelpData();
  }

  private initializeForm() {
    this.setupForm = this.fb.group({
      BranchId: new FormControl(''),
      BranchCode: new FormControl(''),
      AccountTypeCode: new FormControl(''),
      AccountTypeId: new FormControl(''),
      VoucherNo: new FormControl(''),
    });
  }

  private getInputHelpData(): void {
    this.pService
      .GetBranchList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.branchList = data;
      });
    this.pService
      .GetTimeDepositAccountTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.accountTypeList = data;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onBranchChange(value: number): any {
    var item = new SelectListFilter().getItem(this.branchList, value);
    this.setupForm.controls['BranchCode'].setValue(
      item != null ? item.Id : value
    );
  }

  onTypeChange(value: number): any {
    var item = new SelectListFilter().getItem(this.accountTypeList, value);
    this.setupForm.controls['AccountTypeCode'].setValue(
      item != null ? item.Id : value
    );
    this.pService
      .GetInterestDetails(value, 0)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.interestDetailsData = data?.Data;
        this.calculationStatusList = data?.StatusData;
      });
  }

  onCalculation(): void {
    if (confirm('Are you sure?')) {
      this.spinner.show();
      var formValue = this.setupForm.value;
      this.pService
        .TimeDepositInterestCalculation(formValue.AccountTypeId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data) => {
            this.calculationStatusList = data;
            this.spinner.hide();
            alert('Calculation Done');
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  }

  onPost(): void {
    if (confirm('Are you sure?')) {
      var formValue = this.setupForm.value as ProcessPostModel;
      if (formValue.VoucherNo == '') {
        alert('Please enter voucher no.');
        return;
      }
      this.spinner.show();
      formValue.InterestParam = this.interestDetailsData;
      this.pService
        .PostTimeDepositProcess(formValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            this.calculationStatusList = res.Data;
            if (res.Success) {
              alert('Posting Done');
            } else {
              alert('Voucher Already Exists');
            }

            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  }

  onReversePost(): void {
    if (confirm('Are you sure?')) {
      var formValue = this.setupForm.value as ProcessPostModel;
      if (formValue.VoucherNo == '') {
        alert('Please enter voucher no.');
        return;
      }
      this.spinner.show();
      formValue.InterestParam = this.interestDetailsData;
      this.pService
        .ReverseProcess(formValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            this.calculationStatusList = res.Data;
            if (res.Success) {
              alert('Reverse Done');
            } else {
              alert(res.Message);
            }

            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  }

  public setParameter1(): void {
    var fValue = this.setupForm.value;
    // this.pService
    //   .UpdateIntPostFlag(fValue.AccountTypeId)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(
    //     (data) => {
    //       //
    //     },
    //     (err) => {
    //       this.spinner.hide();
    //     }
    //   );
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('AccType', fValue.AccountTypeCode)
    );
    let selectedCode = this.accountTypeList.find(
      (x) => x.Id == fValue.AccountTypeCode
    );
    let valueCommonName1 =
      'Interest Calculation for ' +
      fValue.AccountTypeCode.toString() +
      ' - ' +
      selectedCode.Description.toString();
    let valueCommonName2 =
      'Int. ' + this.interestDetailsData.CalculationPeriod.toString();
    this.reportModel.Values.push(
      new ReportKeyValue('CommonName1', valueCommonName1)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('CommonName2', valueCommonName2)
    );

    if (fValue.BranchCode == '') {
      this.reportModel.Values.push(new ReportKeyValue('BranchValue', '0'));
      this.reportModel.ReportName = 'rptCsTimeDepositInterestReportAll';
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('BranchValue', fValue.BranchCode)
      );
      this.reportModel.ReportName = 'rptCsSBInterestReportTimeDeposit';
    }

    this.getReportToken();
  }

  public setParameter2(): void {
    var fValue = this.setupForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('AccType', fValue.AccountTypeCode)
    );
    let selectedCode = this.accountTypeList.find(
      (x) => x.Id == fValue.AccountTypeCode
    );
    let valueCommonName1 =
      'Interest Calculation for ' +
      fValue.AccountTypeCode.toString() +
      ' - ' +
      selectedCode.Description.toString();
    let valueCommonName2 =
      'Int. ' + this.interestDetailsData.CalculationPeriod.toString();
    this.reportModel.Values.push(
      new ReportKeyValue('CommonName1', valueCommonName1)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('CommonName2', valueCommonName2)
    );

    if (fValue.BranchCode == '') {
      this.reportModel.Values.push(new ReportKeyValue('BranchValue', '0'));
      this.reportModel.ReportName =
        'rptCsPensionInterestDetailReportAllTimeDeposit';
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('BranchValue', fValue.BranchCode)
      );
      this.reportModel.ReportName = 'rptCsSBInterestDetailReportTimeDeposit';
    }

    this.getReportToken();
  }

  public getReportToken = () => {
    this.spinner.show();
    this.displayIFrame = true;
    console.log(this.reportModel);
    this.aService
      .getReportToken(this.reportModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (x) => {
          this.setIframe(x);
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
  };
}
