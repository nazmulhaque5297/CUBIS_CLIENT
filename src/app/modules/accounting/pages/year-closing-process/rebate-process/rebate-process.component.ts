import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectListFilter } from 'src/app/filters/select-list-filter';
import { IdDescription } from 'src/app/interfaces/id-description';
import {
  CalculationStatusModel,
  DebateTargetAccount,
  RebateParameter,
  RebateProcessPostModel,
} from '../../../models/year-closing-process.model';
import { YearClosingProcessService } from '../../../services/year-closing-process.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RebateVerifyListComponent } from './rebate-verify-list/rebate-verify-list.component';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import { IApplicationCommonModel } from 'src/app/Models/Common.model';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { getCommonData } from 'src/app/selector/user.selectors';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import { Console } from 'console';

@Component({
  selector: 'app-rebate-process',
  templateUrl: './rebate-process.component.html',
  styleUrls: ['./rebate-process.component.css'],
})
export class RebateProcessComponent implements OnInit, OnDestroy {
  public branchList: IdDescription[] = [];
  public accountTypeList: IdDescription[] = [];
  setupForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  public interestDetailsData: RebateParameter = new RebateParameter();
  public calculationStatusList: CalculationStatusModel[] = [];
  public targetAccountList: DebateTargetAccount[] = [];
  commonData: IApplicationCommonModel;
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;

  constructor(
    private pService: YearClosingProcessService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toaster: ToastrService,
    private store: Store,
    private sanitizer: DomSanitizer,
    private aService: ReportCommonService
  ) {
    this.reportModel.ReportName = '';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getInputHelpData();
    this.store
      .pipe(select(getCommonData))
      .subscribe((cData: IApplicationCommonModel) => {
        this.commonData = cData;
        console.log(cData);
      });
  }

  private initializeForm() {
    this.setupForm = this.fb.group({
      BranchId: new FormControl(''),
      BranchCode: new FormControl(''),
      AccountTypeCode: new FormControl('', [Validators.required]),
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
      .GetRebateAccountTypes()
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
    this.spinner.show();
    var item = new SelectListFilter().getItem(this.accountTypeList, value);
    this.setupForm.controls['AccountTypeCode'].setValue(
      item != null ? item.Id : value
    );
    this.pService
      .GetRebateParameters(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((sResponse) => {

        console.log("InterestSata----->", sResponse )
        this.interestDetailsData = sResponse.Data;
        this.calculationStatusList = sResponse.StatusData;
        this.targetAccountList = sResponse.TargetAccData;
        this.spinner.hide();
      });
  }

  onCalculation(): void {
    if (this.setupForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }
    if (confirm('Are you sure?')) {
      this.spinner.show();
      var formValue = this.setupForm.value as RebateProcessPostModel;
      this.pService
        .CalculateRebateProcess(formValue.AccountTypeId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (sResponse) => {
            this.spinner.hide();
            if(!sResponse.Success){
              alert(sResponse.Message);
              return;
            }
            this.calculationStatusList = sResponse.StatusData;
            this.targetAccountList = sResponse.TargetAccData;
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
      var formValue = this.setupForm.value as RebateProcessPostModel;
      if (formValue.VoucherNo == '') {
        alert('Please enter voucher no.');
        return;
      }
      this.spinner.show();
      formValue.InterestParam = this.interestDetailsData;
      this.pService
        .PostRebateProcess(formValue)
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
      var formValue = this.setupForm.value as RebateProcessPostModel;
      if (formValue.VoucherNo == '') {
        alert('Please enter voucher no.');
        return;
      }
      this.spinner.show();
      formValue.InterestParam = this.interestDetailsData;
      this.pService
        .ReverseRebatePosting(formValue)
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

  onVerifyList(): void {
    this.setParameter3();
    var formValue = this.setupForm.value as RebateProcessPostModel;
    const modalRef = this.modalService.open(RebateVerifyListComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'my-modal',
    });
    (<RebateVerifyListComponent>modalRef.componentInstance).itemOb = formValue;
    modalRef.result.then((result) => {}).catch((result) => {});
  }

  public setParameter1() {
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



      console.log("InterestDetails Data---->", this.interestDetailsData)

    let valueCommonName2 =
      'Rebalte ' + this.interestDetailsData.CalculationPeriod.toString();
    this.reportModel.Values.push(
      new ReportKeyValue('CommonName1', valueCommonName1)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('CommonName2', valueCommonName2)
    );

    if (fValue.BranchCode == '') {
      this.reportModel.Values.push(new ReportKeyValue('BranchValue', '0'));
      this.reportModel.ReportName = 'rptCsRebateReportAll';
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('BranchValue', fValue.BranchCode)
      );
      this.reportModel.ReportName = 'rptCsRebateReportAll';
    }
    console.log("gettingAA");
    this.getReportToken();
  }

  public setParameter2() {
    var fValue = this.setupForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('AccType', fValue.AccountTypeCode));


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
      this.reportModel.ReportName = 'rptCsSBInterestDetailReportAll';
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('BranchValue', fValue.BranchCode)
      );
      this.reportModel.ReportName = 'rptCsSBInterestDetailReportAll';
    }



    this.getReportToken();
  }


  public setParameter3() {
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



      console.log("InterestDetails Data---->", this.interestDetailsData)

    let valueCommonName2 =
      'Rebalte ' + this.interestDetailsData.CalculationPeriod.toString();
    this.reportModel.Values.push(
      new ReportKeyValue('CommonName1', valueCommonName1)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('CommonName2', valueCommonName2)
    );

    if (fValue.BranchCode == '') {
      this.reportModel.Values.push(new ReportKeyValue('BranchValue', '0'));
      this.reportModel.ReportName = 'rptCsRebateReportAllRebate';
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('BranchValue', fValue.BranchCode)
      );
      this.reportModel.ReportName = 'rptCsRebateReportAllRebate';
    }
    console.log("gettingAA");
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

    window.open(iFramePath,"_blank");
  };

}
