import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectListFilter } from 'src/app/filters/select-list-filter';
import { IdDescription } from 'src/app/interfaces/id-description';
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
  selector: 'app-service-charge-process',
  templateUrl: './service-charge-process.component.html',
  styleUrls: ['./service-charge-process.component.css'],
})
export class ServiceChargeProcessComponent implements OnInit, OnDestroy {
  public accountTypeList: IdDescription[] = [];
  setupForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  public interestDetailsData: InterestParamModel = new InterestParamModel();
  public calculationStatusList: CalculationStatusModel[] = [];
  private reportModel: ReportCommonModel = new ReportCommonModel();

  storefDate: any;
  storetDate: any;
  displayIFrame = false;
  AccDDLName: any;

  constructor(
    private pService: YearClosingProcessService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router
  ) {
    this.reportModel.ReportName = 'CCULB_rptCsServiceChargeReport';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getInputHelpData();
  }

  private initializeForm() {
    this.setupForm = this.fb.group({
      AccountTypeCode: new FormControl(''),
      AccountTypeId: new FormControl(''),
      VoucherNo: new FormControl(''),
    });
  }

  private getInputHelpData(): void {
    this.pService
      .GetServiceChargeAccountTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.accountTypeList = data;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTypeChange(value: number): any {
    var item = new SelectListFilter().getItem(this.accountTypeList, value);
    this.setupForm.controls['AccountTypeCode'].setValue(
      item != null ? item.Id : value
    );
    this.pService
      .GetServiceChargeInterestDetails(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.interestDetailsData = res.Data;
        this.calculationStatusList = res.StatusData;
        let selectedCode = this.accountTypeList.find(
          (x) => x.Id == this.setupForm.value.AccountTypeId
        );
        this.AccDDLName = selectedCode.Description;
      });
  }

  onCalculation(): void {
    if (confirm('Are you sure?')) {
      this.spinner.show();
      var formValue = this.setupForm.value;
      this.pService
        .CalculateServiceChargeProcess(formValue.AccountTypeId)
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
        .PostServiceChargeProcess(formValue)
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
        .ReverseServiceChargePosting(formValue)
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

  // Date change event
  applicationDateChange() {
    var fv = this.setupForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.setupForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.setupForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.setupForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.setupForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.setupForm.value);
    console.log(this.storetDate);
  }

  public getReportToken = () => {
    if (this.setupForm.value.AccountTypeCode == '') {
      this.toaster.warning('Please Select a AccType!!!');
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
        (x) => {
          this.setIframe(x);
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  private setParameter(): void {
    var fValue = this.setupForm.value;
    this.reportModel.Values = [];
    this.reportModel.ReportName = 'CCULB_rptCsServiceChargeReport';

    this.reportModel.Values.push(
      new ReportKeyValue('AccTypeName', this.AccDDLName)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('AccNo', fValue.AccountTypeCode)
    );
  }

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
  };

  exitPage() {
    this.router.navigate(['accounting/']);
  }
}
