import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { ReportCommonService } from 'src/app/services/report-common.service';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { FormGroup, FormControl } from '@angular/forms';
import { LoanReceivedReportService } from 'src/app/services/loanreceived-report.service';
import {
  LoanReceivedReportInputHelp,
  AccClassDetails,
} from 'src/app/Models/loanreceived-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { UserModule, UserInfo } from 'src/app/Models/Common.model';
import {
  CashCollectionAccPageLoadModel,
  CashCollectionMemberNoChngModel,
} from '../../../models/cash-collection-report-by-acc.model';
import { Router } from '@angular/router';
import { AccountOpenCloseReportService } from 'src/app/services/account-open-close-report.service';
import { AccountOpenCloseReportPageLoadModel } from '../../../models/account-open-close-report.model';
import { GeneralLedgerReportService } from 'src/app/services/general-ledger-report.service';
import { GeneralLedgerReportPageLoadModel } from '../../../models/general-ledger-report.model';
import { MutualAidServiceReportService } from 'src/app/services/mutual-aid-service-report.service';
import { MutualAidServiceReportPageLoadModel } from '../../../models/mutual-aid-service-report.model';
import { isBuffer } from 'util';

@Component({
  selector: 'app-mutual-aid-service-report',
  templateUrl: './mutual-aid-service-report.component.html',
  styleUrls: ['./mutual-aid-service-report.component.css'],
})
export class MutualAidServiceReportComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  public pageLoadModel: MutualAidServiceReportPageLoadModel = new MutualAidServiceReportPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  LoanAccShow: boolean = false;
  chbForCollectorDisable: boolean = true;
  chbForGroupDisable: boolean = true;
  chbForGenderDisable: boolean = true;
  MutualAidServiceForm: FormGroup;
  Grid1DataList = [];
  selectedItem: any[] = [];
  storeADate: any;
  storetDate: any;
  storefDate: any;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    private mutualAidServiceReportService: MutualAidServiceReportService
  ) {
    this.reportModel.ReportName = 'CCULB_rptCSMutualAidServiceReport';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
  }
  private initializeForm() {
    this.MutualAidServiceForm = new FormGroup({
      IssueFromDate: new FormControl(''),
      IssueFromDate1: new FormControl(''),
      IssueToDate1: new FormControl(''),
      AccountServiceRb: new FormControl('0'),
    });

    this.getInputHelpData();
    this.getGrid1InfoDetails();
  }
  public getInputHelpData() {
    this.mutualAidServiceReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        this.pageLoadModel = data;
        this.storeADate = this.pageLoadModel.ProcessDate;
        this.MutualAidServiceForm.controls['IssueFromDate'].setValue(
          this.pageLoadModel.ProcessDate
        );
        this.storefDate = this.pageLoadModel.FromDate;
        this.MutualAidServiceForm.controls['IssueFromDate1'].setValue(
          this.pageLoadModel.FromDate
        );
        this.storetDate = this.pageLoadModel.ToDate;
        this.MutualAidServiceForm.controls['IssueToDate1'].setValue(
          this.pageLoadModel.ToDate
        );
      });
  }

  LoanRbSelect() {
    this.LoanAccShow = true;
    this.storefDate = this.pageLoadModel.FromDate;
    this.MutualAidServiceForm.controls['IssueFromDate1'].setValue(
      this.pageLoadModel.FromDate
    );
    this.storetDate = this.pageLoadModel.ToDate;
    this.MutualAidServiceForm.controls['IssueToDate1'].setValue(
      this.pageLoadModel.ToDate
    );
    this.MutualAidServiceForm.controls['AccountServiceRb'].setValue('1');
    this.Grid1DataList = null;
    this.getGrid1InfoDetails();
  }
  AccRbSelect() {
    this.LoanAccShow = false;
    this.MutualAidServiceForm.controls['AccountServiceRb'].setValue('0');
    this.Grid1DataList = null;
    this.getGrid1InfoDetails();
  }

  public getReportToken = (type: any) => {
    if (this.selectedItem.length < 1) {
      this.toastr.warning('No A/c Type Selected!');
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
          if (type === 'CRV') {
            this.setIframeCRV(x);
          } else {
            this.setIframe(x);
          }
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  private setParameter(): void {
    var fValue = this.MutualAidServiceForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('rbDepositAccount', fValue.AccountServiceRb)
    );
    // start date push
    if (fValue.AccountServiceRb == '0') {
      this.reportModel.Values.push(
        new ReportKeyValue('AsOnDate', this.storeADate)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('fDate', this.storefDate)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('tDate', this.storetDate)
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('AsOnDate', fValue.IssueFromDate)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('fDate', fValue.IssueFromDate1)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('tDate', fValue.IssueToDate1)
      );
    }
    // end date push

    this.reportModel.Values.push(
      new ReportKeyValue(
        'selectedDataCount',
        this.selectedItem.length.toString()
      )
    );

    for (let i = 0; i < this.selectedItem.length; i++) {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'selectedAccType' + i.toString(),
          this.selectedItem[i].AccType.toString()
        )
      );
      this.reportModel.Values.push(
        new ReportKeyValue(
          'selectedAccTypeDesc' + i.toString(),
          this.selectedItem[i].Description.toString()
        )
      );
    }

    console.log(this.reportModel.Values);
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

  exitPage() {
    this.router.navigate(['accounting/']);
  }

  // Grid1 Info table data
  getGrid1InfoDetails = () => {
    let arbdata = this.MutualAidServiceForm.controls['AccountServiceRb'].value;

    console.log(arbdata);

    if (arbdata) {
      this.spinner.show();
      this.mutualAidServiceReportService
        .GetGrid1Info(arbdata)
        .pipe(first())
        .subscribe(
          (x: any[]) => {
            this.Grid1DataList = x;
            console.log('This is Grid1Table information', this.Grid1DataList);

            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
            this.toastr.error('Invalid !', 'Error');
          }
        );
    }
  };

  selectedItemList(data: any) {
    let check = this.selectedItem.find((x) => x == data);
    if (!check) {
      this.selectedItem.push(data);
      console.log('This is selected data', this.selectedItem);
    } else {
      let index = this.selectedItem.indexOf(data);
      let temp = [];
      var i = 0;
      while (i < this.selectedItem.length) {
        if (i != index) {
          temp.push(this.selectedItem[i]);
        }
        i++;
      }
      this.selectedItem = temp;
      console.log(this.selectedItem);
    }
  }

  DateChange() {
    var fv = this.MutualAidServiceForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.MutualAidServiceForm.value.IssueFromDate = formatedValue;
    this.storeADate = formatedValue;
  }

  // Date change event
  fromDateChange() {
    var fv = this.MutualAidServiceForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate1, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.MutualAidServiceForm.value.IssueFromDate1 = formatedValue;
    this.storefDate = formatedValue;
    console.log('f date', this.storefDate);
  }
  toDateChange2() {
    var fv = this.MutualAidServiceForm.value;
    var value = this.datepipe.transform(fv.IssueToDate1, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.MutualAidServiceForm.value.IssueToDate1 = formatedValue;
    this.storetDate = formatedValue;
  }
}
